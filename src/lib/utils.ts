import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as anchor from '@coral-xyz/anchor';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatAddress = (address: string) => {
  if (!address) return '';
  const charsToShow = 4;
  return `${address.slice(0, charsToShow)}...${address.slice(-charsToShow)}`;
};

export const checkIfValidTokenImageType = (type: string): boolean => {
  return type === 'image/png' || type === 'image/jpeg';
};

// https://developers.metaplex.com/token-metadata/token-standard - for fungible assets
export const checkIfValidTokenMetadata = (metadata: Record<string, string>): boolean => {
  const minRequiredKeys = ['name', 'symbol', 'description', 'image'];
  const keys = Object.keys(metadata);
  if (keys.length < minRequiredKeys.length) return false;
  // assume valid until proven otherwise
  let isValid = true;
  for (const key of minRequiredKeys) {
    const hasKey = keys.includes(key);
    if (!hasKey) {
      isValid = false;
      break;
    }
    const value = metadata[key];
    const isString = typeof value === 'string';
    if (!isString) {
      isValid = false;
      break;
    }
    const isEmpty = value === '';
    if (isEmpty) {
      isValid = false;
      break;
    }
    const isImage = key === 'image';
    // check if valid url for image
    if (isImage) {
      const isValidUrl =
        value.startsWith('https://') &&
        (value.endsWith('.png') || value.endsWith('.jpg') || value.endsWith('.jpeg'));
      if (!isValidUrl) {
        isValid = false;
        break;
      }
    }
  }
  return isValid;
};

export const waitForTxnFinalization = async (
  connection: anchor.web3.Connection,
  signature: anchor.web3.TransactionSignature
) => {
  const RETRY_INTERVAL = 1500;
  let isFinalized = false;
  while (!isFinalized) {
    console.log('Checking transaction status...');
    const { value } = await connection.getSignatureStatus(signature, {
      searchTransactionHistory: true,
    });
    if (value?.err) {
      throw new Error(`Transaction confirmation failed: ${JSON.stringify(value?.err)}`);
    }
    isFinalized = value?.confirmationStatus === 'finalized';
    if (!isFinalized) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
    }
  }
  console.log('Transaction finalized');
};
