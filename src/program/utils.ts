import * as anchor from '@coral-xyz/anchor';
import { Memetik } from './types/memetik';
import idl from './idl/memetik.json';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { TOKEN_METADATA_PROGRAM_ID } from './constants';
import { Token } from '@/graphql/__generated__/graphql';
import { programId } from './constants';

export type Program = anchor.Program<Memetik>;

export type ProgramInteractionArgs = {
  connection: anchor.web3.Connection;
  wallet: AnchorWallet;
};

export const getExplorerUrl = (
  txnOrAddress?: string | null,
  type = 'transaction' as 'transaction' | 'address'
) => {
  if (!txnOrAddress) return '';
  const BASE_URL = 'https://explorer.solana.com';
  let txnUrl = `${BASE_URL}`;
  switch (type) {
    case 'transaction':
      txnUrl += `/tx/${txnOrAddress}`;
      break;
    case 'address':
      txnUrl += `/address/${txnOrAddress}`;
      break;
  }
  switch (import.meta.env.MODE) {
    case 'development':
      return txnUrl + '?cluster=devnet';
    case 'production':
      return txnUrl + '?cluster=devnet';
    default:
      return txnUrl + '?cluster=devnet';
  }
};

export const getProgram = (args: ProgramInteractionArgs): Program => {
  const provider = new anchor.AnchorProvider(args.connection, args.wallet, {});
  anchor.setProvider(provider);
  const anchorProgram = new anchor.Program(idl as anchor.Idl) as unknown as Program;
  return anchorProgram;
};

export const getMintPDA = (ticker: string) => {
  const MINT_SEED_CONSTANT = 'pool_mint';
  const seeds = [Buffer.from(MINT_SEED_CONSTANT), Buffer.from(ticker)];
  const [mintPDA] = anchor.web3.PublicKey.findProgramAddressSync(seeds, programId);
  return mintPDA;
};

export const getMetadataPDA = (mint: anchor.web3.PublicKey) => {
  const METADATA_SEED_CONSTANT = 'metadata';
  const [metadataAddress] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(METADATA_SEED_CONSTANT), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    TOKEN_METADATA_PROGRAM_ID
  );
  return metadataAddress;
};

export const getBondingPoolPDA = (ticker: string) => {
  const POOL_BONDING_SEED_CONSTANT = 'pool';
  const seeds = [Buffer.from(POOL_BONDING_SEED_CONSTANT), Buffer.from(ticker)];
  const [poolPDA] = anchor.web3.PublicKey.findProgramAddressSync(seeds, programId);
  return poolPDA;
};

export const getAmmPoolPDA = (ticker: string) => {
  const POOL_AMM_SEED_CONSTANT = 'pool_amm';
  const seeds = [Buffer.from(POOL_AMM_SEED_CONSTANT), Buffer.from(ticker)];
  const [poolPDA] = anchor.web3.PublicKey.findProgramAddressSync(seeds, programId);
  return poolPDA;
};

export const getPoolLPMint = async (ticker: string) => {
  const POOL_LP_MINT_SEED_CONSTANT = 'pool_lp_mint';
  const seeds = [Buffer.from(POOL_LP_MINT_SEED_CONSTANT), Buffer.from(ticker)];
  const [poolLPMint] = anchor.web3.PublicKey.findProgramAddressSync(seeds, programId);
  return poolLPMint;
};

export const getTokBalance = async ({
  connection,
  wallet,
  mint,
}: {
  connection: anchor.web3.Connection;
  wallet: AnchorWallet;
  mint: string;
}) => {
  try {
    const mintPubkey = new anchor.web3.PublicKey(mint);
    const tokenAccount = await anchor.utils.token.associatedAddress({
      mint: mintPubkey,
      owner: wallet.publicKey,
    });
    const info = await connection.getTokenAccountBalance(tokenAccount);
    return (info?.value?.uiAmount as number) || 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const doesNotHaveTokenAccount = err?.message?.includes('could not find account'); // means wallet has no token account/no balance
    if (doesNotHaveTokenAccount) return 0;
    console.error('Error fetching token balance', err);
    throw err;
  }
};

export const getAtomicAmount = (amount: number, decimals = 9) => {
  return amount * Math.pow(10, decimals);
};

export const getUnitAmount = (
  amount: number | string,
  decimals = 9,
  asNumber = false
): number | string => {
  const numAmount = typeof amount === 'string' ? BigInt(amount) : BigInt(amount.toString());
  if (numAmount === BigInt(0)) {
    return asNumber ? 0 : '0'; // Return 0 as a number or a string based on asNumber
  }

  const amountInUnits = Number(numAmount) / Math.pow(10, decimals);
  const formattedUnitAmt = amountInUnits.toFixed(decimals).replace(/\.?0+$/, '');

  return asNumber ? parseFloat(formattedUnitAmt) : formattedUnitAmt;
};

const formatMarketCap = (marketCap: number) => {
  if (marketCap < 1000) {
    return '<1K';
  } else if (marketCap < 100000) {
    return `${(marketCap / 1000).toFixed(1)}K`;
  } else if (marketCap < 1000000) {
    return `${Math.round(marketCap / 1000)}K`;
  } else {
    return `${(marketCap / 1000000).toFixed(1)}M`;
  }
};

export const calculateMarketCap = (
  token?: Token | null,
  solPrice?: number | null,
  format = false
) => {
  if (!token?.supply) return 0;
  if (!solPrice) return null;
  const latestPurchasePriceInLamports = token.latestPurchasePrice || 0;
  const latestPurchasePriceInSol =
    (latestPurchasePriceInLamports as unknown as number) / Math.pow(10, 9);
  const latestPurchasePriceInUsd = latestPurchasePriceInSol * solPrice;
  const atomicSupply = getUnitAmount(token.supply, token.decimals, true);
  const marketCap = latestPurchasePriceInUsd * (atomicSupply as unknown as number);
  if (format) {
    return formatMarketCap(marketCap);
  }
  return parseFloat(marketCap.toFixed(2));
  return marketCap;
};
