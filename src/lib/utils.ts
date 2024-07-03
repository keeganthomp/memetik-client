/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as anchor from '@coral-xyz/anchor';
import { Cluster } from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatAddress = (address?: string | null) => {
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

export const getNetwork = (): Cluster => {
  switch (import.meta.env.MODE) {
    case 'development':
      return 'devnet';
    case 'beta':
      return 'devnet';
    default:
      return 'mainnet-beta';
  }
};

export const checkValidSolanaWallet = (walletAddress?: string | null) => {
  if (!walletAddress) return false;
  try {
    const publicKey = new PublicKey(walletAddress);
    return PublicKey.isOnCurve(publicKey.toBuffer());
  } catch (e) {
    return false;
  }
};

//////////////////////
// for testing chart
//////////////////////
export const generateChartData = (numberOfCandles = 500, updatesPerCandle = 5, startAt = 100) => {
  const randomFactor = 25 + Math.random() * 25;
  const samplePoint = (i: number): number =>
    i *
      (0.5 +
        Math.sin(i / 1) * 0.2 +
        Math.sin(i / 2) * 0.4 +
        Math.sin(i / randomFactor) * 0.8 +
        Math.sin(i / 50) * 0.5) +
    200 +
    i * 2;
  const createCandle = (val: number, time: number): any => ({
    time,
    open: val,
    high: val,
    low: val,
    close: val,
  });
  const updateCandle = (candle: any, val: number): any => ({
    ...candle,
    close: val,
    low: Math.min(candle.low, val),
    high: Math.max(candle.high, val),
  });
  const date = new Date(Date.UTC(2018, 0, 1, 12, 0, 0, 0));
  const numberOfPoints = numberOfCandles * updatesPerCandle;
  const initialData: any[] = [];
  const realtimeUpdates: any[] = [];
  let lastCandle: any | null = null;
  let previousValue = samplePoint(-1);

  for (let i = 0; i < numberOfPoints; ++i) {
    if (i % updatesPerCandle === 0) {
      date.setUTCDate(date.getUTCDate() + 1);
    }
    const time = date.getTime() / 1000;
    let value = samplePoint(i);
    const diff = (value - previousValue) * Math.random();
    value = previousValue + diff;
    previousValue = value;
    if (i % updatesPerCandle === 0) {
      const candle = createCandle(value, time);
      lastCandle = candle;
      if (i >= startAt) {
        realtimeUpdates.push(candle);
      }
    } else if (lastCandle) {
      lastCandle = updateCandle(lastCandle, value);
      if (i >= startAt) {
        realtimeUpdates.push(lastCandle);
      } else if ((i + 1) % updatesPerCandle === 0) {
        initialData.push(lastCandle);
      }
    }
  }
  return {
    initialData,
    realtimeUpdates,
  };
};
