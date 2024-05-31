import { Outlet } from 'react-router-dom';
import WalletInfo from './components/WalletInfo';
import { Toaster } from '@/components/ui/toaster';
import NewPoolForm from '@/components/forms/NewPoolForm';

const Header = () => {
  return (
    <div className="w-full h-full backdrop-blur-md bg-white/30 flex justify-between items-center">
      <p className="tracking-wide font-light">Memetik</p>
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
      <div className="w-full md:w-2/3 grid grid-rows-[40px_1fr] px-3 md:px-5 pb-14 h-screen overflow-hidden mx-auto gap-0">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-5">
          <LeftSideBar />
          <Outlet />
        </div>
        <Toaster />
      </div>
    </div>
  );
};

export const NoSidebarLayout = () => {
  return (
    <div className="w-full">
      <div className="w-full md:w-2/3 grid grid-rows-[40px_1fr] px-3 md:px-5 pb-14 h-screen overflow-hidden mx-auto gap-0">
        <Header />
        <Outlet />
        <Toaster />
      </div>
    </div>
  );
};

export default SidebarLayout;
