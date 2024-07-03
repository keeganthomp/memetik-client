import { useContext } from 'react';
import { PythContextT, PythContext } from '@/context/PythFeedProvider';

export const useSolPrice = () => {
  const context = useContext(PythContext) as PythContextT;
  if (!context) {
    throw new Error('useSolPrice must be used within a PythProvider');
  }
  return context;
};
