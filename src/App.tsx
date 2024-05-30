import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import { RouterProvider } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import apolloClient from './lib/apolloClient';
import router from './router';
import { SocketProvider } from './context/SocketContext';

const getWalletEndpoint = () => {
  console.log('wee', import.meta.env.MODE);
  switch (import.meta.env.MODE) {
    case 'development':
      return clusterApiUrl('devnet');
    case 'beta':
      return clusterApiUrl('devnet');
    default:
      return clusterApiUrl('mainnet-beta');
  }
};

function App() {
  const wallets = useMemo(() => [], []);
  return (
    <ApolloProvider client={apolloClient}>
      <ConnectionProvider endpoint={getWalletEndpoint()}>
        <WalletProvider autoConnect wallets={wallets}>
          <SocketProvider>
            <RouterProvider router={router} />
          </SocketProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ApolloProvider>
  );
}

export default App;
