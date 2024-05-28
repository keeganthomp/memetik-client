import { Outlet } from 'react-router-dom';
import WalletInfo from './components/WalletInfo';
import { Toaster } from '@/components/ui/toaster';

const Header = () => {
  return (
    <div className="flex justify-end items-center fixed w-full top-0 left-0 px-5 h-10 backdrop-blur-md bg-white/30">
      <WalletInfo />
    </div>
  );
};

const AppLayout = () => {
  return (
    <div className="flex flex-col gap-3 px-5 pb-14">
      <Header />
      <div className="pt-10">
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
};

export default AppLayout;
