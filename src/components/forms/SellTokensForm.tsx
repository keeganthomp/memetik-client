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
import { makeSellTokenTxn } from '@/program';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader } from '@/components/ui/loader';
import { useToast } from '@/components/ui/use-toast';
import { getAtomicAmount } from '@/program/utils';
import { RECORD_TRADE } from '@/graphql/mutations';
import { RecordTradeMutation, Pool, Token } from '@/graphql/__generated__/graphql';
import { useMutation } from '@apollo/client';
import { useTransaction } from '@/hooks/useTransaction';

type Props = {
  pool?: Pool | null;
  tokenBalance?: number | null;
  onSubmit?: () => void;
  disabled?: boolean;
};

const SellTokensForm = ({
  closeDialog,
  token,
  tokenBalance,
  onSubmit: onSubmitProp,
}: {
  closeDialog: () => void;
  token?: Token | null;
  tokenBalance: Props['tokenBalance'];
  onSubmit: Props['onSubmit'];
}) => {
  const { toast } = useToast();
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const { sendTransaction } = useWallet();
  const { showTransactionToast } = useTransaction();
  const [updatePoolFromTxn] = useMutation<RecordTradeMutation>(RECORD_TRADE);

  const sellTokensFormSchema = z.object({
    amount: z
      .number()
      .min(0.000_000_001)
      .max((tokenBalance || 0) * 1.000_000_000, 'Insufficient balance'),
  });

  const form = useForm<z.infer<typeof sellTokensFormSchema>>({
    resolver: zodResolver(sellTokensFormSchema),
    defaultValues: {
      amount: undefined,
    },
  });

  const onSubmit = async ({ amount }: z.infer<typeof sellTokensFormSchema>) => {
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
      const transaction = await makeSellTokenTxn({
        connection,
        wallet: anchorWallet,
        symbol: token?.symbol || '',
        amount: atomicAmount,
      });
      const signature = await sendTransaction(transaction, connection);
      closeDialog();
      // submit to server to update pool info in db
      // will ultimately emit socket event to update UI
      console.log('sending to server...');
      updatePoolFromTxn({
        variables: {
          transaction: signature,
        },
      });
      await showTransactionToast(signature);
      if (onSubmitProp) {
        onSubmitProp();
      }
    } catch (error) {
      console.error('Error selling tokens:', error);
      toast({
        variant: 'destructive',
        title: 'Error selling tokens',
        description: 'There was an error selling tokens. Please try again.',
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
                  How much ${token.symbol} do you want to sell?
                </FormDescription>
              </div>
              <FormControl>
                <>
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
                        form.trigger('amount');
                      } else {
                        field.onChange(newValue);
                      }

                      if (newValue === '') {
                        field.onChange(undefined);
                        form.trigger('amount');
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
                  <p className="text-gray-300 text-xs pt-1">
                    You have {tokenBalance} {token.symbol}
                  </p>
                </>
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
          {form.formState.isSubmitting ? <Loader /> : 'Sell Tokens'}
        </Button>
      </form>
    </Form>
  );
};

const DialogForm = ({ pool, tokenBalance, onSubmit, disabled }: Props) => {
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
        onClick={() => setIsOpen(true)}
        disabled={!connected || !tokenBalance || disabled}
        variant="outline"
        className="bg-red-400 hover:bg-red-500 text-white hover:text-white w-full rounded-full disabled:cursor-not-allowed h-11"
      >
        Sell
      </Button>
      <DialogContent className="max-w-[95%] rounded md:max-w-[425px]">
        {!connected ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-center">Please connect your wallet to sell tokens.</p>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Sell {pool?.token?.name}</DialogTitle>
            </DialogHeader>
            <SellTokensForm
              token={pool?.token}
              tokenBalance={tokenBalance}
              closeDialog={() => setIsOpen(false)}
              onSubmit={onSubmit}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogForm;
