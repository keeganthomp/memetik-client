/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useState } from 'react';
import magic from '@/lib/magic';
import { useMutation, useLazyQuery } from '@apollo/client';
import { GET_PROFILE } from '@/graphql/queries';
import { AUTHENTICATE } from '@/graphql/mutations';
import { AuthenticateMutation, User, GetProfileQuery } from '@/graphql/__generated__/graphql';
import {
  cacheAuthToken,
  clearCache,
  cacheOauthToken,
  getCachedAuthToken,
} from '@/lib/localStorage';

type LoginArgs = {
  email: string;
  showUI?: boolean;
  onOTPSent?: () => void;
};

export type AuthContextT = {
  user: User | null;
  login: ({ email }: LoginArgs) => void;
  logout: () => void;
  isAuthenticating: boolean;
  logInWithTwitter: () => Promise<void>;
  confirmOauthCreds: () => Promise<void>;
  authenticate: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextT | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [fetchProfile] = useLazyQuery<GetProfileQuery>(GET_PROFILE);
  const [authenticate] = useMutation<AuthenticateMutation>(AUTHENTICATE, {
    fetchPolicy: 'network-only',
  });

  const login = async ({ email, showUI = true, onOTPSent }: LoginArgs) => {
    const didToken = await magic.auth.loginWithMagicLink({ email, showUI }).on('email-sent', () => {
      if (onOTPSent) {
        onOTPSent();
      }
    });
    if (!didToken) {
      throw new Error('Error logging in - no did token');
    }
    cacheAuthToken(didToken);
    const { data } = await authenticate();
    const user = data?.authenticate;
    if (!user) {
      throw new Error('Error logging in - no user found in db');
    }
    cacheAuthToken(didToken);
    setUser(user as User);
    return didToken;
  };

  const logInWithTwitter = async () => {
    const origin = window.location.origin;
    await magic.oauth.loginWithRedirect({
      provider: 'twitter',
      redirectURI: `${origin}`,
      // scope: ['user:email'] /* optional */,
    });
  };

  const confirmOauthCreds = async () => {
    try {
      setIsAuthenticating(true);
      console.log('authenticating from oauth cred verification...')
      const { magic: magicAuthResponse, oauth: oauthResponse } =
        await magic.oauth.getRedirectResult();
      const didToken = magicAuthResponse.idToken;
      const oauthAccesToken = oauthResponse.accessToken;
      cacheAuthToken(didToken);
      cacheOauthToken(oauthAccesToken);
      const { data } = await authenticate();
      const user = data?.authenticate;
      if (!user) {
        throw new Error('Error logging in - no user found in db');
      }
      console.log('user from oauth verification...', user);
      setUser(user as User);
    } catch (e) {
      console.error('Error confirming OAuth credentials', e);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // should be non blocking - could use try/catch's, but would be verbose/nested
  const authenticateFromCache = async () => {
    if (isAuthenticating) return;
    try {
      const cachedToken = getCachedAuthToken();
      if (!cachedToken) return;
      setIsAuthenticating(true);
      // Try and authenticate with the current cached token
      const { data } = await authenticate();
      const user = data?.authenticate;
      setUser(user as User);
    } catch {
      // If it fails, see if we can get a new token
      try {
        const isLoggedIn = await magic.user.isLoggedIn();
        if (isLoggedIn) {
          // Get new DID token - this will refresh the session
          const latestDidToken = await magic.user.getIdToken();
          if (latestDidToken) {
            cacheAuthToken(latestDidToken);
            await authenticate();
          }
        }
      } catch {
        // Handle any errors that occur during the session check or token retrieval
      } finally {
        setIsAuthenticating(false);
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async () => {
    await magic.user.logout();
    clearCache();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticating,
        logInWithTwitter,
        confirmOauthCreds,
        authenticate: authenticateFromCache,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
