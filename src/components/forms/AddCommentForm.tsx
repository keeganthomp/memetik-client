import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { ADD_COMMENT } from '@/graphql/mutations';
import { GET_POOL } from '@/graphql/queries';
import { useMutation } from '@apollo/client';
import { AddCommentMutation } from '@/graphql/__generated__/graphql';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'react-router-dom';
import { Loader } from '@/components/ui/loader';

const newCommentFormSchema = z.object({
  comment: z.string().min(1, 'Comment cannot be empty'),
});

const NewCommentForm = ({
  closeDialog,
  onSubmit: onSubmitProp,
  poolId,
}: {
  closeDialog: () => void;
  poolId: number;
  onSubmit?: () => void;
}) => {
  const { tokenAddress } = useParams();
  const { toast } = useToast();
  const { publicKey } = useWallet();
  const [addComment] = useMutation<AddCommentMutation>(ADD_COMMENT, {
    refetchQueries: [{ query: GET_POOL, variables: { contractAddress: tokenAddress } }],
  });
  const form = useForm<z.infer<typeof newCommentFormSchema>>({
    resolver: zodResolver(newCommentFormSchema),
    defaultValues: {
      comment: '',
    },
  });

  const onSubmit = async ({ comment }: z.infer<typeof newCommentFormSchema>) => {
    try {
      if (!publicKey) return;
      await addComment({
        variables: {
          poolId,
          text: comment,
          creator: publicKey.toBase58(),
        },
      });
      toast({
        title: 'Comment added!',
        description: 'Comment added succesfully',
      });
      closeDialog();
      if (onSubmitProp) {
        onSubmitProp();
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        variant: 'destructive',
        title: 'Error creating comment',
        description: 'There was an error submitting your comment. Please try again.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <div className="pb-[7px]">
                <FormLabel>Thot</FormLabel>
                <FormDescription className="text-gray-400 text-xs">
                  thots are shared anonymously
                </FormDescription>
              </div>
              <FormControl>
                <Textarea
                  disabled={form.formState.isSubmitting}
                  className="w-full"
                  placeholder="shit is gnar..."
                  {...field}
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
          {form.formState.isSubmitting ? <Loader /> : 'Submit'} 
        </Button>
      </form>
    </Form>
  );
};

const CommentDialog = ({
  onSubmit,
  disabled,
  poolId,
}: {
  onSubmit?: () => void;
  disabled?: boolean;
  poolId: number;
}) => {
  const { connected } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  const handleFormOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleFormOpen}>
      <Button
        disabled={disabled || !connected}
        onClick={() => setIsOpen(true)}
        variant="ghost"
        className="tracking-wide rounded h-11 w-full"
      >
        Create Post
      </Button>
      <DialogContent className="max-w-[95%] rounded md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share your thot</DialogTitle>
        </DialogHeader>
        <NewCommentForm onSubmit={onSubmit} closeDialog={() => setIsOpen(false)} poolId={poolId} />
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
