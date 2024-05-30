import { formatAddress } from '@/lib/utils';
import { getExplorerUrl } from '@/program/utils';
import { waitForTxnFinalization } from '@/lib/utils';
import { FaCircleCheck } from 'react-icons/fa6';
import { SquareArrowOutUpRightIcon } from 'lucide-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useToast } from '@/components/ui/use-toast';
import { Loader } from '@/components/ui/loader';

export const useTransaction = () => {
  const { toast } = useToast();
  const { connection } = useConnection();

  const showTransactionToast = async (txnSig: string) => {
    const txnUrl = getExplorerUrl(txnSig);
    const transactionToast = toast({
      duration: 16000,
      title: 'Waiting for transaction finalization',
      description: (
        <div className="flex flex-row items-center gap-2">
          <a
            href={txnUrl}
            target="_blank"
            className="hover:underline flex items-center text-gray-600 hover:text-gray-900 mr-2"
          >
            {formatAddress(txnSig)}
            <SquareArrowOutUpRightIcon size={13} className="ml-1" />
          </a>
          <Loader />
        </div>
      ),
    });
    await waitForTxnFinalization(connection!, txnSig);
    transactionToast.update({
      id: transactionToast.id,
      duration: 3500,
      title: 'Transaction finalized!',
      description: (
        <div className="flex flex-row items-center gap-2">
          <a
            href={txnUrl}
            target="_blank"
            className="hover:underline flex items-center text-gray-600 hover:text-gray-900 mr-1"
          >
            {formatAddress(txnSig)}
            <SquareArrowOutUpRightIcon size={13} className="ml-1" />
          </a>
          <FaCircleCheck size={19} className="ml-1" />
        </div>
      ),
    });
  };

  return { showTransactionToast };
};
