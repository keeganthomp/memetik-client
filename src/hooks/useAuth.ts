import { useContext } from 'react';
import { AuthContext, AuthContextT } from '@/context/AuthContext';

export const useAuth = () => {
  const auth = useContext(AuthContext);
  return auth as AuthContextT;
};
