import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_POOL } from '@/graphql/queries';
import { GetPoolQuery, Pool as PoolT } from '@/graphql/__generated__/graphql';
import { Loader } from '@/components/ui/loader';
import { getExplorerUrl } from '@/program/utils';
import BuyTokensForm from '@/components/forms/BuyTokensForm';
import SellTokensForm from '@/components/forms/SellTokensForm';
import { getUnitAmount } from '@/program/utils';
import { formatAddress } from '@/lib/utils';
import { SquareArrowOutUpRightIcon } from 'lucide-react';
import TokenImage from '@/components/TokenImage';
import useTokenBalance from '@/hooks/useTokenBalance';
import { useTransaction } from '@/hooks/useTransaction';

const BackButton = () => {
  const navigate = useNavigate();

  const goToPools = () => {
    navigate('/');
  };

  return (
    <Button variant="ghost" className="px-2" onClick={goToPools}>
      <ArrowLeft size={16} className="mr-1" />
      Pools
    </Button>
  );
};

const PoolPage = () => {
  const { processingTransaction } = useTransaction();
  const { tokenAddress } = useParams();
  const { balance, isFetchingBalance, refetchBalance } = useTokenBalance({ token: tokenAddress });

  const { data, loading, error } = useQuery<GetPoolQuery>(GET_POOL, {
    variables: {
      contractAddress: tokenAddress,
    },
  });

  if (loading) {
    return (
      <div className="flex justify-center pt-3">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center pt-3">Error fetching pool</p>;
  }

  const pool = data?.getPool as PoolT;
  const token = pool?.token;

  const canSell = !isFetchingBalance && (balance || 0) > 0;

  return (
    <div className="pt-0 md:pt-3">
      <div className="pb-2 pt-3 md:pt-0">
        <BackButton />
      </div>
      {!pool ? (
        <p>Pool not found</p>
      ) : (
        <div className="flex flex-col gap-4 ">
          <div className="grid grid-rows-1 grid-cols-[5rem_1fr] gap-5 overflow-hidden">
            <TokenImage tokenImage={token.image} size={5} />
            <div className="flex flex-col justify-center">
              <p className="text-2xl text-ellipsis overflow-hidden tracking-wide">{token.name}</p>
              <div className="flex justify-between items-baseline relative top-[-5px]">
                <p className="uppercase tracking-widest text-ellipsis overflow-hidden text-sm font-thin text-gray-800">
                  ${token.symbol}
                </p>
                <p className="text-gray-900 text-2xl font-light">
                  {getUnitAmount(token.latestPurchasePrice || 0)} SOL
                </p>
              </div>
            </div>
          </div>
          {token.description && <p className="">{token.description}</p>}
          <div className="text-gray-500">
            <div className="flex justify-between border-b border-gray-100 py-2 items-center uppercase text-xs font-normal">
              <p>Supply</p>
              <p>{getUnitAmount(token.supply)}</p>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2 items-center uppercase text-xs font-normal">
              <p>Holders</p>
              <p>{token?.holders?.length || 0}</p>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2 items-center uppercase text-xs font-normal">
              <p>Market Cap</p>
              <p>{getUnitAmount(token.marketCap || 0)} SOL</p>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2 items-center uppercase text-xs font-normal">
              <p>Contract Address</p>
              <a
                className="pl-1 flex items-center hover:underline"
                href={getExplorerUrl(token.address, 'address')}
                target="_blank"
              >
                {formatAddress(token.address)}
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
          {isFetchingBalance ? (
            <div className="flex justify-center w-full pt-5">
              <Loader />
            </div>
          ) : (
            <div className="pt-1">
              <div className="flex justify-end text-xs font-light text-gray-400 px-3 pb-1">
                <p>
                  Current balance: {balance} ${pool.token.symbol}
                </p>
              </div>
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
        </div>
      )}
    </div>
  );
};

export default PoolPage;
