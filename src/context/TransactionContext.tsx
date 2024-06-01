import React, { createContext, useState } from 'react';

type TransactionContextType = {
  processingTransaction: string;
  setProcessingTransaction: (transaction: string) => void;
  clearTransactionProcessing: () => void;
};

export const TransactionContext = createContext<TransactionContextType | null>(null);

export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
  const [processingTransaction, setProcessingTransaction] = useState('');

  const clearTransactionProcessing = () => {
    setProcessingTransaction('');
  };

  return (
    <TransactionContext.Provider
      value={{
        processingTransaction,
        setProcessingTransaction,
        clearTransactionProcessing,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
