import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { useConnection, useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { makeBuyTokenTxn } from '@/program';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader } from '@/components/ui/loader';
import { useToast } from '@/components/ui/use-toast';
import { getAtomicAmount } from '@/program/utils';
import { RECORD_TRADE } from '@/graphql/mutations';
import { RecordTradeMutation, Token, Pool } from '@/graphql/__generated__/graphql';
import { useMutation } from '@apollo/client';
import { useTransaction } from '@/hooks/useTransaction';

type Props = {
  pool?: Pool | null;
  onSubmit?: () => void;
  disabled?: boolean;
};

const buyTokensFormSchema = z.object({
  amount: z.number().min(0.000_000_001),
});

const BuyTokensForm = ({
  token,
  closeDialog,
  onSubmit: onSubmitProp,
}: {
  closeDialog: () => void;
  token?: Token | null;
  onSubmit: Props['onSubmit'];
}) => {
  const { showTransactionToast } = useTransaction();
  const { toast } = useToast();
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();

  // const { sendTransaction } = useWallet();
  const [recordTrade] = useMutation<RecordTradeMutation>(RECORD_TRADE);

  const form = useForm<z.infer<typeof buyTokensFormSchema>>({
    resolver: zodResolver(buyTokensFormSchema),
    defaultValues: {
      amount: undefined,
    },
  });

  const onSubmit = async ({ amount }: z.infer<typeof buyTokensFormSchema>) => {
    if (!anchorWallet) {
      console.error('Wallet not connected');
      alert('Wallet not connected');
      return;
    }
    if (!token) {
      console.error('Token not found');
      window.alert('Token not found');
      return;
    }

    try {
      const atomicAmount = getAtomicAmount(amount);
      const transaction = await makeBuyTokenTxn({
        connection,
        wallet: anchorWallet,
        symbol: token.symbol,
        amount: atomicAmount,
      });
      const signedTxn = await anchorWallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTxn.serialize());
      closeDialog();
      // submit to server to update pool info in db
      // will ultimately emit socket event to update UI
      console.log('sending to server...');
      recordTrade({
        variables: {
          transaction: signature,
        },
      });
      await showTransactionToast(signature);
      if (onSubmitProp) {
        onSubmitProp();
      }
    } catch (error) {
      console.error('Error buying tokens:', JSON.stringify(error, null, 2));
      toast({
        variant: 'destructive',
        title: 'Error buying tokens',
        description: 'There was an error buying tokens. Please try again.',
      });
    }
  };

  if (!token) {
    return <p className="text-center">Token not found</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <div className="pb-[7px]">
                <FormLabel>Amount</FormLabel>
                <FormDescription className="text-gray-400 text-xs">
                  How much ${token.symbol} do you want to purchase?
                </FormDescription>
              </div>
              <FormControl>
                <Input
                  disabled={form.formState.isSubmitting}
                  className="w-full"
                  placeholder="1.00"
                  type="number"
                  {...field}
                  step="0.000000001" // Allows up to 9 decimal places
                  onChange={(e) => {
                    let newValue = e.target.value;
                    // Enforce maximum 9 decimal places
                    const decimalPlaces = newValue.split('.')[1];
                    if (decimalPlaces && decimalPlaces.length > 9) {
                      newValue = newValue.slice(0, newValue.length - (decimalPlaces.length - 9));
                    }
                    // Update the field value
                    const parsedVal = parseFloat(newValue);
                    if (parsedVal) {
                      field.onChange(parsedVal);
                    } else {
                      field.onChange(newValue);
                    }
                  }}
                  onBlur={() => {
                    // Convert to number on blur to ensure it's a valid number
                    const isValString = typeof field?.value === 'string';
                    if (field?.value && isValString) {
                      field.onChange(parseFloat(field.value as unknown as string));
                    }
                  }}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage className="text-xs font-light pt-1" />
            </FormItem>
          )}
        />
        <Button
          disabled={!form.formState.isValid || form.formState.isSubmitting}
          className="w-full h-11 rounded-full"
          type="submit"
        >
          {form.formState.isSubmitting ? <Loader /> : 'Buy Tokens'}
        </Button>
      </form>
    </Form>
  );
};

const DialogForm = ({ pool, onSubmit, disabled }: Props) => {
  const { connected } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  const handleFormOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  if (!pool) {
    return <p className="text-center">Pool not found</p>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleFormOpen}>
      <Button
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        variant="ghost"
        className="bg-green-400 hover:bg-green-500 text-white hover:text-white w-full tracking-wide rounded-full h-11"
      >
        Buy
      </Button>
      <DialogContent className="max-w-[95%] rounded md:max-w-[425px]">
        {!connected ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-center">Please connect your wallet to purchase tokens.</p>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Purchase {pool?.token?.name}</DialogTitle>
            </DialogHeader>
            <BuyTokensForm
              token={pool?.token}
              onSubmit={onSubmit}
              closeDialog={() => setIsOpen(false)}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogForm;
