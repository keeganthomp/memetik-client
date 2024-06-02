import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import { RouterProvider } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import apolloClient from './lib/apolloClient';
import router from './router';
import { SocketProvider } from './context/SocketContext';
import { TransactionProvider } from './context/TransactionContext';
import { getNetwork } from '@/lib/utils';

function App() {
  const network = getNetwork();
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [], []);
  return (
    <ApolloProvider client={apolloClient}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider autoConnect wallets={wallets}>
          <SocketProvider>
            <TransactionProvider>
              <RouterProvider router={router} />
            </TransactionProvider>
          </SocketProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ApolloProvider>
  );
}

export default App;
