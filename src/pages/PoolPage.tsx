import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_POOL } from '@/graphql/queries';
import { GetPoolQuery, Pool as PoolT } from '@/graphql/__generated__/graphql';
import { Loader } from '@/components/ui/loader';
import { getExplorerUrl } from '@/program/utils';
import BuyTokensForm from '@/components/forms/BuyTokensForm';
import SellTokensForm from '@/components/forms/SellTokensForm';
import { getUnitAmount, calculateMarketCap } from '@/program/utils';
import { formatAddress } from '@/lib/utils';
import { SquareArrowOutUpRightIcon } from 'lucide-react';
import TokenImage from '@/components/TokenImage';
import useTokenBalance from '@/hooks/useTokenBalance';
import { useTransaction } from '@/hooks/useTransaction';
import { useWallet } from '@solana/wallet-adapter-react';
import AddCommentForm from '@/components/forms/AddCommentForm';
import Comment from '@/components/Comment';
import BackButton from '@/components/buttons/BackButton';
import { useSolPrice } from '@/hooks/useSolPrice';
import TradingChart from '@/components/TradingChart';

const PoolPage = () => {
  const { solPrice, loading: isFetchingSolPrice } = useSolPrice();
  const { connected } = useWallet();
  const { processingTransaction } = useTransaction();
  const { tokenAddress } = useParams();
  const { formattedBalance, balance, isFetchingBalance, refetchBalance } = useTokenBalance({
    token: tokenAddress,
  });
  const { data, loading, error } = useQuery<GetPoolQuery>(GET_POOL, {
    variables: {
      contractAddress: tokenAddress,
    },
  });

  const pool = data?.getPool as PoolT;
  const token = pool?.token;

  const marketCap = useMemo(() => {
    return calculateMarketCap(token, solPrice, false);
  }, [token?.supply, solPrice]);

  if (loading) {
    return (
      <div className="flex justify-center pt-6">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center pt-3">Error fetching pool</p>;
  }

  const canSell = !isFetchingBalance && (balance || 0) > 0;

  return (
    <div>
      <div className="pb-2 pt-3">
        <BackButton route="/pools">Pools</BackButton>
      </div>
      {!pool ? (
        <p>Pool not found</p>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Token overview */}
          <div className="grid grid-rows-1 grid-cols-[5rem_1fr] gap-5 overflow-hidden">
            <TokenImage tokenImage={token?.image} size={5} />
            <div className="flex flex-col justify-center">
              <p className="text-2xl text-ellipsis overflow-hidden tracking-wide">{token?.name}</p>
              <div className="flex justify-between items-baseline relative top-[-5px]">
                <p className="uppercase tracking-widest text-ellipsis overflow-hidden text-sm font-thin text-gray-800">
                  ${token?.symbol}
                </p>
                <p className="text-gray-900 text-2xl font-light">
                  {getUnitAmount(token?.latestPurchasePrice || 0)} SOL
                </p>
              </div>
            </div>
          </div>
          {/* Buy/Sell buttons */}
          {isFetchingBalance ? (
            <div className="flex justify-center w-full pt-5">
              <Loader />
            </div>
          ) : (
            <div className="pt-1">
              {connected && (
                <div className="flex justify-end text-xs font-light text-gray-400 px-3 pb-1">
                  <p>
                    Current balance: {formattedBalance || 0} ${pool?.token?.symbol}
                  </p>
                </div>
              )}
              <div className="flex justify-between gap-7">
                <BuyTokensForm
                  pool={pool}
                  onSubmit={refetchBalance}
                  disabled={!!processingTransaction}
                />
                {canSell && (
                  <SellTokensForm
                    pool={pool}
                    tokenBalance={balance}
                    onSubmit={refetchBalance}
                    disabled={!!processingTransaction}
                  />
                )}
              </div>
            </div>
          )}
          {/* Info about token */}
          {token?.description && <p className="">{token.description}</p>}
          <div className="text-gray-500">
            <div className="flex justify-between border-b border-gray-100 py-2 items-center uppercase text-xs font-normal">
              <p>Holders</p>
              <p>{token?.holders?.length || 0}</p>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2 items-center uppercase text-xs font-normal">
              <p>Market Cap</p>
              {isFetchingSolPrice ? <Loader /> : <p>${marketCap}</p>}
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2 items-center uppercase text-xs font-normal">
              <p>Contract Address</p>
              <a
                className="pl-1 flex items-center hover:underline"
                href={getExplorerUrl(token?.contractAddress, 'address')}
                target="_blank"
              >
                {formatAddress(token?.contractAddress)}
                <SquareArrowOutUpRightIcon size={12} className="ml-1" />
              </a>
            </div>
            <div className="flex justify-between py-2 items-baseline uppercase text-xs font-normal">
              <p>Creator</p>
              <a
                className="pl-1 flex items-center hover:underline"
                href={getExplorerUrl(pool.creator, 'address')}
                target="_blank"
              >
                {formatAddress(pool.creator)}
                <SquareArrowOutUpRightIcon size={12} className="ml-1" />
              </a>
            </div>
          </div>

          <TradingChart symbol={token?.symbol} />
        </div>
      )}
      {/* Comments */}
      <div className="pt-3">
        <AddCommentForm poolId={pool.id} />
        <div className="flex flex-col pt-2 gap-2">
          {pool.comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PoolPage;
