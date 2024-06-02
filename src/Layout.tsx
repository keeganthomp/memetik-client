import { Outlet } from 'react-router-dom';
import WalletInfo from './components/WalletInfo';
import { Toaster } from '@/components/ui/toaster';
import NewPoolForm from '@/components/forms/NewPoolForm';
import { getNetwork } from './lib/utils';
import { useMemo } from 'react';

const Header = () => {
  const network = useMemo(() => getNetwork(), []);
  const isMainnet = network === 'mainnet-beta';
  return (
    <div className="w-full h-full backdrop-blur-md bg-white/30 flex justify-between items-center z-10">
      <p className="tracking-wide font-light">
        Memetik {!isMainnet && <span className="italic">(devnet)</span>}
      </p>
      <WalletInfo />
    </div>
  );
};

const LeftSideBar = () => {
  return (
    <div className="pt-3">
      <NewPoolForm />
    </div>
  );
};

const SidebarLayout = () => {
  return (
    <div className="w-full">
      <div className="w-full md:w-3/5 grid grid-rows-[50px_1fr] px-3 md:px-5 pb-14 h-screen overflow-hidden mx-auto gap-2">
        <Header />
        <div className="flex flex-col md:grid grid-cols-1 md:grid-cols-[12rem_1fr] gap-1 md:gap-6">
          <LeftSideBar />
          <Outlet />
        </div>
        <Toaster />
      </div>
    </div>
  );
};

export default SidebarLayout;
