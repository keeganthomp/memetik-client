import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { useWallet, Wallet } from '@solana/wallet-adapter-react';
import { formatAddress } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { CiWallet } from 'react-icons/ci';

const WalletOption = ({ wallet }: { wallet: Wallet }) => {
  const { select } = useWallet();
  const handleSelectWallet = () => {
    select(wallet.adapter.name);
  };
  return (
    <Button variant="ghost" className="bg-gray-50" onClick={handleSelectWallet}>
      {wallet.adapter.name}
    </Button>
  );
};

const ConnectWalletButton = () => {
  const { wallets } = useWallet();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="self-center font-light" variant="outline">
          Connect
        </Button>
      </DialogTrigger>
      <DialogContent className="pt-6 max-w-[95%] rounded md:max-w-[425px]">
        <DialogHeader className="text-center text-gray-900">Select a wallet</DialogHeader>
        <div className="flex flex-col gap-2">
          {wallets.length === 0 ? (
            <p className="text-center text-gray-800">No wallets available</p>
          ) : (
            wallets.map((wallet) => <WalletOption key={wallet.adapter.name} wallet={wallet} />)
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const WalletInfo = ({ className = '' }: { className?: string }) => {
  const { publicKey, disconnect } = useWallet();
  if (!publicKey) return <ConnectWalletButton />;
  const formattedAddress = formatAddress(publicKey?.toBase58());
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className={cn('flex items-center cursor-pointer hover:underline', className)}>
          <span className="mr-2 text-sm font-light">{formattedAddress}</span>
          <CiWallet size={24} />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[95%] rounded md:max-w-[350px]">
        <h2 className="font-light text-center pt-3">
          Currently connected with <span className="font-normal">{formattedAddress}</span>
        </h2>
        <Button className="bg-red-400 hover:bg-red-500" onClick={disconnect}>
          Disconnect
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default WalletInfo;
