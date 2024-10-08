import { useState, useEffect } from 'react';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { useToast } from '@/components/ui/use-toast';
import { getTokBalance } from '@/program/utils';
import * as anchor from '@coral-xyz/anchor';

interface UseTokenBalanceProps {
  token?: string | anchor.web3.PublicKey | null;
}

const useTokenBalance = ({ token }: UseTokenBalanceProps) => {
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const [errorFetchingBalance, setErrorFetchingBalance] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const { toast } = useToast();
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();

  const fetchTokenBalance = async () => {
    if (!token) return;
    try {
      setIsFetchingBalance(true);
      setErrorFetchingBalance(null);

      if (!anchorWallet) {
        throw new Error('Wallet not connected');
      }

      const tokenAddress = typeof token === 'string' ? token : token?.toString();
      const balance = await getTokBalance({
        connection,
        wallet: anchorWallet!,
        mint: tokenAddress,
      });
      setBalance(balance || 0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMesage = error?.message || 'Unable to fetch token balance';
      setErrorFetchingBalance(errorMesage);
      toast({
        variant: 'destructive',
        title: 'Error fetching balance',
        description: errorMesage,
      });
      console.error('Error fetching balance', error);
    } finally {
      setIsFetchingBalance(false);
    }
  };

  useEffect(() => {
    if (anchorWallet && connection && token) {
      fetchTokenBalance();
    }
  }, [anchorWallet, connection, token]);

  return {
    isFetchingBalance,
    errorFetchingBalance,
    balance,
    formattedBalance: balance ? balance?.toFixed(0)?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0,
    refetchBalance: fetchTokenBalance,
  };
};

export default useTokenBalance;
