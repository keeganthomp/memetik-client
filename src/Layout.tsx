import { Outlet } from 'react-router-dom';
import WalletInfo from './components/WalletInfo';
import { Toaster } from '@/components/ui/toaster';

const Header = () => {
  return (
    <div className="fixed w-full top-0 left-0 px-3 md:px-7 h-14 backdrop-blur-md bg-white/30 flex justify-between items-center">
      <p className="tracking-wide">DEVNET</p>
      <WalletInfo />
    </div>
  );
};

const AppLayout = () => {
  return (
    <div className="flex flex-col gap-3 px-3 md:px-5 pb-14 justify-center items-center">
      <Header />
      <div className="pt-14 w-full md:max-w-[600px]">
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
};

export default AppLayout;
