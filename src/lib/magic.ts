import { Magic } from 'magic-sdk';
import { SolanaExtension } from '@magic-ext/solana';
import { OAuthExtension } from '@magic-ext/oauth';
import { clusterApiUrl } from '@solana/web3.js';
import { getNetwork } from './utils';

const magicPublishibleKey = import.meta.env.VITE_MAGIC_PUBLISHABLE_KEY;

if (!magicPublishibleKey) {
  throw new Error('VITE_MAGIC_PUBLISHABLE_KEY is not set');
}

// current Solana network (mainnet, devnet, etc.)
const solanaNetwork = getNetwork();

const magic = new Magic(magicPublishibleKey, {
  useStorageCache: true,
  extensions: [
    new SolanaExtension({
      rpcUrl: clusterApiUrl(solanaNetwork),
    }),
    new OAuthExtension(),
  ],
});

export default magic;
