import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useConnection, useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { createPoolTxn } from '@/program';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader } from '@/components/ui/loader';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@apollo/client';
import { CREATE_POOL_FROM_TXN } from '@/graphql/mutations';
import { CreatePoolFromTxnMutation } from '@/graphql/__generated__/graphql';
import useAws from '@/hooks/useAWS';
import { getNextPoolId, getMintPDA } from '@/program/utils';
import { useTransaction } from '@/hooks/useTransaction';

const tokenFormSchema = z.object({
  name: z.string().min(1).max(50),
  symbol: z.string().min(1).max(25),
  image: z.any().refine((value) => !value || value instanceof File, {
    message: 'Please upload an image',
  }),
});

const NewTokenForm = ({ closeDialog }: { closeDialog: () => void }) => {
  const { showTransactionToast } = useTransaction();
  const { uploadTokenImage, uploadTokenMetadata } = useAws();
  const { toast } = useToast();
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const { sendTransaction } = useWallet();
  const [createPoolFromTxn] = useMutation<CreatePoolFromTxnMutation>(CREATE_POOL_FROM_TXN);

  const form = useForm<z.infer<typeof tokenFormSchema>>({
    resolver: zodResolver(tokenFormSchema),
    defaultValues: {
      name: '',
      symbol: '',
    },
  });

  const onSubmit = async ({ image, ...token }: z.infer<typeof tokenFormSchema>) => {
    if (!anchorWallet) {
      console.error('Wallet not connected');
      alert('Wallet not connected');
      return;
    }
    try {
      const poolId = await getNextPoolId({ connection, wallet: anchorWallet });
      const mintAddress = getMintPDA({ connection, wallet: anchorWallet, poolId });
      const mintAddressString = mintAddress.toBase58();
      let imageUrl = '';
      if (image) {
        const imageFile = image as File;
        const imageUrlFromUpload = await uploadTokenImage(mintAddressString, imageFile);
        if (!imageUrlFromUpload) {
          throw new Error('Error uploading image');
        }
        imageUrl = imageUrlFromUpload;
      }
      const metadataUri = await uploadTokenMetadata(mintAddressString, {
        ...token,
        description: '', // TODO: Add description field
        image: imageUrl as string,
      });
      const tokenPayload = {
        ...token,
        uri: metadataUri as string,
      };
      const transaction = await createPoolTxn({
        connection,
        wallet: anchorWallet,
        token: tokenPayload,
      });
      const signature = await sendTransaction(transaction, connection);
      closeDialog();
      showTransactionToast(signature);
      // submit to server to save in db
      // will ultimately emit socket event to update UI
      console.log('submitting txn to server...');
      createPoolFromTxn({
        variables: {
          txn: signature,
        },
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while creating your token.',
      });
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      return;
    }
    const file = e.target.files[0];
    form.setValue('image', file);
    form.trigger('image');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Token Wif Hat"
                  {...field}
                  disabled={form.formState.isSubmitting}
                  onChange={(e) => {
                    // maybe do some validating of some sort on name - currently wahtever is entered is accepted
                    const newValue = e.target.value;
                    field.onChange(newValue);
                  }}
                />
              </FormControl>
              <FormMessage>{fieldState.error ? fieldState.error.message : null}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="symbol"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Symbol</FormLabel>
              <FormControl>
                <div className="relative">
                  <span
                    className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                      field.value ? 'text-black' : 'text-gray-400'
                    }`}
                  >
                    $
                  </span>
                  <Input
                    {...field}
                    className="pl-[1.3rem]"
                    placeholder="WIFHAT"
                    disabled={form.formState.isSubmitting}
                    onChange={(e) => {
                      const newValue = e.target.value.trim().toUpperCase().replace(/\s/g, ''); // Convert to uppercase and remove spaces
                      field.onChange(newValue);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage>{fieldState.error ? fieldState.error.message : null}</FormMessage>
            </FormItem>
          )}
        />
        <div>
          <FormLabel>Image</FormLabel>
          <Input
            className="pt-2 cursor-pointer"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={form.formState.isSubmitting}
          />
        </div>
        <Button
          disabled={!form.formState.isValid || form.formState.isSubmitting}
          className="w-full h-10"
          type="submit"
        >
          {form.formState.isSubmitting ? <Loader /> : 'Launch Token'}
        </Button>
      </form>
    </Form>
  );
};

const DialogForm = () => {
  const { connected } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  const handleFormOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleFormOpen}>
      <Button onClick={() => setIsOpen(true)}>Launch Token</Button>
      <DialogContent className="max-w-[95%] rounded md:max-w-[425px]">
        {!connected ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-center">Please connect your wallet to create new token.</p>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create Token</DialogTitle>
              <DialogDescription>
                Fill out the below fields to launch a new token.
              </DialogDescription>
            </DialogHeader>
            <NewTokenForm closeDialog={() => setIsOpen(false)} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogForm;
