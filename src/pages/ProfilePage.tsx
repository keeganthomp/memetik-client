import { useAuth } from '@/hooks/useAuth';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';

const ProfilePage = () => {
  const { isAuthenticating, user, logout } = useAuth();

  if (isAuthenticating) {
    return (
      <div className="flex justify-center pt-6">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return <p className="text-center pt-3">Login to view your profile</p>;
  }

  console.log('user in profile', user);

  return (
    <div>
      <p>Twitter id: {user?.twitterUserId}</p>
      <p>Twitter username: {user?.twitterHandle}</p>
      <p>Email: {user?.email}</p>
      <p>Wallet: {user?.wallet}</p>
      <Button variant="destructive" onClick={logout}>Logout</Button>
    </div>
  );
};

export default ProfilePage;
