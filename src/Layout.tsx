import { Outlet } from 'react-router-dom';
import NewPoolForm from '@/components/forms/NewPoolForm';
import { getNetwork } from './lib/utils';
import { useMemo } from 'react';
import { UserInfo } from './components/UserInfo';
import { ConnectedWalletInfo } from './components/UserInfo';
import { useEffect, useRef } from 'react';
import useQueryParams from '@/hooks/useQueryParams';
import { useAuth } from './hooks/useAuth';
import { useSolPrice } from './hooks/useSolPrice';

const OAUTH_MAGIC_REQUEST_ID_PARAM = 'magic_oauth_request_id';

const Header = () => {
  const { solPrice } = useSolPrice();
  const network = useMemo(() => getNetwork(), []);
  const isMainnet = network === 'mainnet-beta';
  return (
    <div className="h-[46px] w-full md:w-3/5 relative md:fixed backdrop-blur-md bg-white/30 flex justify-between items-center z-10">
      <p className="tracking-wide font-light">
        Memetik {!isMainnet && <span className="italic">(devnet)</span>}
      </p>
      {solPrice && (
        <p className='font-light'>
          SOL price: <span>${solPrice}</span>
        </p>
      )}
      <ConnectedWalletInfo />
    </div>
  );
};

const LeftSideBar = () => {
  return (
    <div className="w-full md:w-[12rem] relative md:fixed z-10">
      <NewPoolForm />
    </div>
  );
};

const AppLayout = () => {
  const { confirmOauthCreds, authenticate } = useAuth();
  const queryParams = useQueryParams();

  const hasCheckedAuth = useRef(false);
  const hasConfirmedOauthCreds = useRef(false);

  // will be present if the user is redirected from the oauth provider
  const magicOauthRequestId = queryParams.get(OAUTH_MAGIC_REQUEST_ID_PARAM);

  useEffect(() => {
    // we assume that the magic_oauth_request_id is present if the user is redirected from the oauth provider
    if (magicOauthRequestId && !hasConfirmedOauthCreds.current) {
      hasConfirmedOauthCreds.current = true;
      console.log('confirming oauth creds...');
      confirmOauthCreds();
    } else if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      console.log('authenticating...');
      authenticate();
    }
  }, [magicOauthRequestId]);

  return (
    <div className="w-full md:w-3/5 mx-auto elative px-3 md:px-0">
      <Header />
      <div className="pt-0 md:pt-[46px] relative">
        <LeftSideBar />
        <div className="relative pl-0 md:pl-[13rem] pb-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
