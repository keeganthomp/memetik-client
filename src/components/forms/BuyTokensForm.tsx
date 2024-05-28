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
import { buyTokens } from '@/program';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader } from '@/components/ui/loader';
import { useToast } from '@/components/ui/use-toast';
import { getAtomicAmount } from '@/program/utils';
import { UPDATE_POOL_FROM_TXN } from '@/graphql/mutations';
import { UpdatePoolFromTxnMutation, Pool } from '@/graphql/__generated__/graphql';
import { useMutation } from '@apollo/client';

type Props = {
  pool: Pool;
};

const buyTokensFormSchema = z.object({
  amount: z.number().min(0.000_000_001),
});

const BuyTokensForm = ({ closeDialog, pool }: { closeDialog: () => void; pool: Props['pool'] }) => {
  const { toast } = useToast();
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const [updatePoolFromTxn] = useMutation<UpdatePoolFromTxnMutation>(UPDATE_POOL_FROM_TXN);

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
    try {
      const atomicAmount = getAtomicAmount(amount);
      const txn = await buyTokens({
        connection,
        wallet: anchorWallet,
        poolId: pool.id,
        amount: atomicAmount,
      });
      closeDialog();
      toast({
        title: 'Transaction submitted',
        description: 'Your transaction will be finalized shortly.',
      });
      // submit to server to update pool info in db
      // will ultimately emit socket event to update UI
      console.log('sending to server...');
      updatePoolFromTxn({
        variables: {
          txn,
        },
      });
    } catch (error) {
      console.error('Error buying tokens:', error);
      toast({
        title: 'Error buying tokens',
        description: 'There was an error buying tokens. Please try again.',
      });
    }
  };

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
                  How much ${pool.token.symbol} do you want to purchase?
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
          className="w-full h-10"
          type="submit"
        >
          {form.formState.isSubmitting ? <Loader /> : 'Buy Tokens'}
        </Button>
      </form>
    </Form>
  );
};

const DialogForm = ({ pool }: Props) => {
  const { connected } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  const handleFormOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleFormOpen}>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="bg-green-500 hover:bg-green-600 text-white hover:text-white"
      >
        Buy
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        {!connected ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-center">Please connect your wallet to purchase tokens.</p>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Purchase ${pool.token.symbol}</DialogTitle>
            </DialogHeader>
            <BuyTokensForm pool={pool} closeDialog={() => setIsOpen(false)} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogForm;
