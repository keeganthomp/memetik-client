import { Pool as PoolT, Token } from '@/graphql/__generated__/graphql';
import { getUnitAmount } from '@/program/utils';
import moment from 'moment';
import TokenImage from './TokenImage';
import classnames from 'classnames';
import { useNavigate } from 'react-router-dom';

type Props = {
  pool: PoolT;
  isNew?: boolean;
};

const StatsBar = ({ token }: { token: Token }) => {
  return (
    <div className="flex items-center gap-5 px-2 text-gray-400 font-thin text-sm">
      <div className="flex gap-1 items-center">
        <p>Supply:</p>
        <p>{getUnitAmount(token.supply)}</p>
      </div>
    </div>
  );
};

const Pool = ({ pool, isNew }: Props) => {
  const navigate = useNavigate();
  const { token } = pool;

  const goToPool = () => {
    navigate(`/${token.address}`);
  };

  return (
    <div
      onClick={goToPool}
      className={classnames(
        'rounded-xl grid grid-rows-[20px_1fr_30px] gap-3 pt-2 px-5 py-3 bg-white  font-light hover:shadow-md cursor-pointer transition-all',
        {
          'new-item': isNew,
        }
      )}
    >
      <div className="flex justify-end items-center h-full text-gray-400 font-thin text-sm">
        <p>{moment(pool.createdAt).fromNow()}</p>
      </div>
      <div className="grid grid-rows-1 grid-cols-[5rem_1fr] gap-5 overflow-hidden">
        <TokenImage tokenImage={token.image} size={5} />
        <div className="flex flex-col justify-center">
          <p className="text-2xl text-ellipsis overflow-hidden tracking-wide">{token.name}</p>
          <div className="flex justify-between items-baseline relative top-[-5px]">
            <p className="uppercase tracking-widest text-ellipsis overflow-hidden text-sm font-thin text-gray-800">
              ${token.symbol}
            </p>
            <p className="text-gray-900 text-xl md:text-2xl font-light">
              {getUnitAmount(token.latestPurchasePrice || 0)} SOL
            </p>
          </div>
        </div>
      </div>
      <StatsBar token={token} />
    </div>
  );
};

export default Pool;
