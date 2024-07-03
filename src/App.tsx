import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { getNetwork } from '@/lib/utils';
import { PythProvider } from './context/PythFeedProvider';

function App() {
  const network = getNetwork();
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider autoConnect wallets={wallets}>
        <PythProvider>
          <RouterProvider router={router} />
        </PythProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
