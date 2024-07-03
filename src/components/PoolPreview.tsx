import { Pool as PoolT } from '@/graphql/__generated__/graphql';
import { getUnitAmount, calculateMarketCap } from '@/program/utils';
import moment from 'moment';
import TokenImage from './TokenImage';
import classnames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useSolPrice } from '@/hooks/useSolPrice';
import { useMemo } from 'react';
import { Loader } from './ui/loader';

type Props = {
  pool: PoolT;
  isNew?: boolean;
};

const Pool = ({ pool, isNew }: Props) => {
  const { solPrice, loading: isFetchingSolPrice } = useSolPrice();
  const navigate = useNavigate();
  const { token } = pool;
  const hasRecentPurchase = token?.latestPurchasePrice !== null;

  const marketCap = useMemo(() => {
    return calculateMarketCap(token, solPrice);
  }, [token?.supply, solPrice]);

  const goToPool = () => {
    if (!token) return;
    navigate(`/${token.contractAddress}`);
  };

  if (!token) return <p className="text-red-500 tet-center font-light">Token for pool not found</p>;

  return (
    <div
      onClick={goToPool}
      className={classnames(
        'rounded-2xl grid grid-rows-[20px_1fr] gap-1 pt-2 pb-5 px-5 bg-gray-50 font-light hover:bg-white cursor-pointer transition-all',
        {
          'new-item': isNew,
        }
      )}
    >
      <div className="flex justify-end items-center h-full text-gray-400 font-thin text-xs">
        <p>{moment(pool.createdAt).fromNow()}</p>
      </div>
      <div className="grid grid-rows-1 grid-cols-[5rem_1fr] gap-5 overflow-hidden">
        <TokenImage tokenImage={token.image} size={5} />
        <div className="flex justify-between items-center">
          <div className="flex flex-col justify-center gap-1">
            <p className="text-2xl text-ellipsis overflow-hidden tracking-wide">{token.name}</p>
            <p className="uppercase tracking-widest text-ellipsis overflow-hidden text-sm font-thin text-gray-800">
              ${token.symbol}
            </p>
          </div>
          {/* Desktop */}
          <div className="hidden md:flex flex-col gap-1 justify-center text-gray-400 font-light text-sm">
            <div className="flex justify-between items-center">
              <p className="pr-2">Supply:</p>
              <p>{getUnitAmount(token.supply, token.decimals)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="pr-2">Market Cap:</p>
              {isFetchingSolPrice ? <Loader /> : <p>${marketCap}</p>}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile */}
      <div className="flex md:hidden w-full items-center gap-4 text-gray-400 font-light text-sm pt-2 px-1">
        <div className="flex justify-between items-center">
          <p className="pr-1">Supply:</p>
          <p>{getUnitAmount(token.supply)}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="pr-1">Last price:</p>
          <p>{hasRecentPurchase ? getUnitAmount(token.latestPurchasePrice || 0) : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default Pool;
