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
    <Button variant="outline" onClick={handleSelectWallet}>
      {wallet.adapter.name}
    </Button>
  );
};

const ConnectWalletButton = () => {
  const { wallets } = useWallet();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Connect</Button>
      </DialogTrigger>
      <DialogContent className="pt-10">
        <DialogHeader>Connect to a wallet</DialogHeader>
        {wallets.map((wallet) => (
          <WalletOption key={wallet.adapter.name} wallet={wallet} />
        ))}
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
          <span className="mr-2 text-sm">{formattedAddress}</span>
          <CiWallet size={24} />
        </div>
      </DialogTrigger>
      <DialogContent>
        <h2 className="font-light text-center">
          Currently connected with <span className="font-normal">{formattedAddress}</span>
        </h2>
        <Button onClick={disconnect}>Disconnect</Button>
      </DialogContent>
    </Dialog>
  );
};

export default WalletInfo;
