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
import { sellTokens } from '@/program';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader } from '@/components/ui/loader';
import { useToast } from '@/components/ui/use-toast';
import { getAtomicAmount } from '@/program/utils';
import { UPDATE_POOL_FROM_TXN } from '@/graphql/mutations';
import { UpdatePoolFromTxnMutation, Pool } from '@/graphql/__generated__/graphql';
import { useMutation } from '@apollo/client';
import useTokenBalance from '@/hooks/useTokenBalance';

type Props = {
  pool: Pool;
};

const SellTokensForm = ({
  closeDialog,
  pool,
  tokenBalance = 0,
}: {
  closeDialog: () => void;
  pool: Props['pool'];
  tokenBalance?: number | null;
}) => {
  const { toast } = useToast();
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const [updatePoolFromTxn] = useMutation<UpdatePoolFromTxnMutation>(UPDATE_POOL_FROM_TXN);

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
    try {
      const atomicAmount = getAtomicAmount(amount);
      const txn = await sellTokens({
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
      console.error('Error selling tokens:', error);
      toast({
        title: 'Error selling tokens',
        description: 'There was an error selling tokens. Please try again.',
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
                  How much ${pool.token.symbol} do you want to sell?
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
                    You have {tokenBalance} {pool.token.symbol}
                  </p>
                </>
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
          {form.formState.isSubmitting ? <Loader /> : 'Sell Tokens'}
        </Button>
      </form>
    </Form>
  );
};

const DialogForm = ({ pool }: Props) => {
  const { connected } = useWallet();
  const { balance: tokenBalance, isFetchingBalance } = useTokenBalance({
    token: pool.token.address,
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleFormOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleFormOpen}>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="bg-red-500 hover:bg-red-600 text-white hover:text-white"
      >
        Sell
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        {!connected ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-center">Please connect your wallet to sell tokens.</p>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        ) : isFetchingBalance ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Sell ${pool.token.symbol}</DialogTitle>
            </DialogHeader>
            <SellTokensForm
              pool={pool}
              closeDialog={() => setIsOpen(false)}
              tokenBalance={tokenBalance}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogForm;
