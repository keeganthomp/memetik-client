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
    <div className="h-[46px] w-full md:w-3/5 relative md:fixed backdrop-blur-md bg-white/30 flex justify-between items-center z-10">
      <p className="tracking-wide font-light">
        Memetik {!isMainnet && <span className="italic">(devnet)</span>}
      </p>
      <WalletInfo />
    </div>
  );
};

const LeftSideBar = () => {
  return (
    <div className="w-full md:w-[12rem] relative md:fixed pt-3 z-10">
      <NewPoolForm />
    </div>
  );
};

const SidebarLayout = () => {
  return (
    <>
      <div className="w-full md:w-3/5 mx-auto elative px-3 md:px-0">
        <Header />
        <div className="pt-0 md:pt-[46px] relative">
          <LeftSideBar />
          <div className='relative pl-0 md:pl-[13rem] pb-12'>
            <Outlet />
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default SidebarLayout;
