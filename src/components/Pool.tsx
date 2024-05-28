import { Pool as PoolT } from '@/graphql/__generated__/graphql';
import { getExplorerUrl } from '@/program/utils';
import BuyTokensForm from '@/components/forms/BuyTokensForm';
import SellTokensForm from '@/components/forms/SellTokensForm';
import { getUnitAmount } from '@/program/utils';

type Props = {
  pool: PoolT;
};

const Pool = ({ pool }: Props) => {
  const { token } = pool;
  return (
    <div className="border rounded p-2 flex flex-col gap-2">
      <div>
        <p>Created at: {pool.createdAt}</p>
        <p>ID: {pool.id}</p>
        <p>
          Pool Address:
          <a
            className="underline pl-1"
            href={getExplorerUrl(pool.address, 'address')}
            target="_blank"
          >
            {pool.address}
          </a>
        </p>
        <p>
          Token Address:
          <a
            className="underline pl-1"
            href={getExplorerUrl(token.address, 'address')}
            target="_blank"
          >
            {token.address}
          </a>
        </p>
        <p>Name: {token.name}</p>
        <p>Symbol: ${token.symbol}</p>
        {token?.image && <img className="w-12 h-12 rounded-full object-cover" src={token?.image} />}
        {token.description && <p>Description: {token.description}</p>}
        <p>Supply: {getUnitAmount(token.supply)}</p>
        {token.latestPurchasePrice && (
          <p>Latest Price: ~{getUnitAmount(token.latestPurchasePrice)} SOL</p>
        )}
      </div>
      <div className="flex gap-2 items-center">
        <BuyTokensForm pool={pool} />
        <SellTokensForm pool={pool} />
      </div>
    </div>
  );
};

export default Pool;
