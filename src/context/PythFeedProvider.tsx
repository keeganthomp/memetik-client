import React, { createContext, useState, useEffect } from 'react';
import { PythConnection } from '@pythnetwork/client';
import { getPythProgramKeyForCluster, Product, PriceData } from '@pythnetwork/client';
import { useConnection } from '@solana/wallet-adapter-react';
import { getNetwork } from '@/lib/utils';
import { PublicKey } from '@solana/web3.js';

export type PythContextT = {
  solPrice: number | null;
  loading: boolean;
};

export const PythContext = createContext<PythContextT | null>(null);

const SOL_DEVNET = 'J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix';
const feeds = [new PublicKey(SOL_DEVNET)];

export const PythProvider = ({ children }: { children: React.JSX.Element }) => {
  const currentNetwork = getNetwork();
  const { connection } = useConnection();
  const pythPublicKey = getPythProgramKeyForCluster(currentNetwork);
  const pythConnection = new PythConnection(connection, pythPublicKey, 'confirmed', feeds);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!connection || !currentNetwork) return;
    const handlePriceChange = (product: Product, { price: solPriceUsd }: PriceData) => {
      setSolPrice(solPriceUsd ? parseFloat(solPriceUsd.toFixed(2)) : null);
      setLoading(false);
    };
    pythConnection.onPriceChange(handlePriceChange);
    // Start listening for price change events.
    console.log('starting pyth price feed connection');
    pythConnection.start();
    // Clean up the connection when the component unmounts
    return () => {
      pythConnection.stop();
    };
  }, [connection, currentNetwork]);

  return <PythContext.Provider value={{ solPrice, loading }}>{children}</PythContext.Provider>;
};
