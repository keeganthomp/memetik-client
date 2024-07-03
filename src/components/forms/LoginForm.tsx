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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader } from '@/components/ui/loader';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

const loginFormSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
});

const LoginForm = ({ closeDialog }: { closeDialog: () => void }) => {
  const { toast } = useToast();
  const { login, logInWithTwitter } = useAuth();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async ({ email }: z.infer<typeof loginFormSchema>) => {
    try {
      await login({
        email,
      });
      closeDialog();
      toast({
        title: 'Success',
        description: 'Logged in!',
      });
    } catch (error) {
      console.error('Login error occured', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred logging in.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormDescription>Enter your email to receive a OTP</FormDescription>
              <FormControl>
                <Input
                  placeholder="tigbits@example.com"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage>{fieldState.error ? fieldState.error.message : null}</FormMessage>
            </FormItem>
          )}
        />
        <Button
          disabled={!form.formState.isValid || form.formState.isSubmitting}
          className="w-full h-10"
          type="submit"
        >
          {form.formState.isSubmitting ? <Loader /> : 'Login'}
        </Button>
        <Button
          className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white"
          onClick={logInWithTwitter}
        >
          Login with Twitter
        </Button>
      </form>
    </Form>
  );
};

const DialogLoginForm = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFormOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleFormOpen}>
      <Button
        className="rounded-full bg-slate-500 hover:bg-slate-600 text-white tracking-wide"
        onClick={() => setIsOpen(true)}
      >
        Login
      </Button>
      <DialogContent className="max-w-[95%] rounded md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>
        <LoginForm closeDialog={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default DialogLoginForm;
