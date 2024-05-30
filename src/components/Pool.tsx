import { Pool as PoolT } from '@/graphql/__generated__/graphql';
import { getExplorerUrl } from '@/program/utils';
import BuyTokensForm from '@/components/forms/BuyTokensForm';
import SellTokensForm from '@/components/forms/SellTokensForm';
import { getUnitAmount } from '@/program/utils';
import moment from 'moment';
import { formatAddress } from '@/lib/utils';
import TokenImage from './TokenImage';
import { SquareArrowOutUpRightIcon } from 'lucide-react';
import classnames from 'classnames';

type Props = {
  pool: PoolT;
  isNew?: boolean;
};

const Link = ({ href, text }: { href: string; text: string }) => (
  <a className="pl-1 flex items-center hover:underline" href={href} target="_blank">
    {text}
  </a>
);

const Pool = ({ pool, isNew }: Props) => {
  const { token } = pool;
  return (
    <div
      className={classnames('rounded-xl p-5 bg-white flex flex-col gap-5 font-light', {
        'new-item': isNew,
      })}
    >
      <div className="flex justify-between text-gray-400 font-thin text-sm">
        <Link href={getExplorerUrl(pool.address, 'address')} text={formatAddress(pool.address)} />
        <p>{moment(pool.createdAt).fromNow()}</p>
      </div>
      <div className="grid grid-rows-1 grid-cols-[5rem_1fr] gap-5 overflow-hidden">
        <TokenImage tokenImage={token.image} size={5} />
        <div className="flex flex-col gap-1 justify-center">
          <p className="text-2xl text-ellipsis overflow-hidden tracking-wide">{token.name}</p>
          <p className="uppercase tracking-wide text-ellipsis overflow-hidden text-sm font-thin text-gray-700">
            ${token.symbol}
          </p>
        </div>
      </div>
      {token.description && <p className="">{token.description}</p>}
      <div className="text-gray-500">
        <div className="flex justify-between border-b border-gray-100 py-2 items-baseline uppercase text-xs font-normal">
          <p>Latest Price</p>
          <p className="text-gray-900 text-lg font-light">
            {getUnitAmount(token.latestPurchasePrice || 0)} SOL
          </p>
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
        <div className="flex justify-between py-2 items-center uppercase text-xs font-normal">
          <p>Supply</p>
          <p>{getUnitAmount(token.supply)}</p>
        </div>
      </div>
      <div className="flex justify-between gap-7">
        <BuyTokensForm pool={pool} />
        <SellTokensForm pool={pool} />
      </div>
    </div>
  );
};

export default Pool;
