import * as anchor from '@coral-xyz/anchor';
import { Memetik } from './types/memetik';
import idl from './idl/memetik.json';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { TOKEN_METADATA_PROGRAM_ID } from './constants';

export type Program = anchor.Program<Memetik>;

export type ProgramInteractionArgs = {
  connection: anchor.web3.Connection;
  wallet: AnchorWallet;
};

export const getNum = (num: number | anchor.BN): number =>
  typeof num === 'number' ? num : num.toNumber();

export const getExplorerUrl = (
  txnOrAddress: string,
  type = 'transaction' as 'transaction' | 'address'
) => {
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

export const getMetadataPDA = (mint: anchor.web3.PublicKey) => {
  const METADATA_SEED_CONSTANT = 'metadata';
  const [metadataAddress] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(METADATA_SEED_CONSTANT), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    TOKEN_METADATA_PROGRAM_ID
  );
  return metadataAddress;
};

export const getMintPDA = (args: ProgramInteractionArgs & { poolId: number | anchor.BN }) => {
  const program = getProgram(args);
  const MINT_SEED_CONSTANT = 'mint';
  const poolIdNum = getNum(args.poolId);
  const seeds = [
    Buffer.from(MINT_SEED_CONSTANT),
    Buffer.from(new Uint8Array(new BigUint64Array([BigInt(poolIdNum)]).buffer)),
  ];
  const [mintPDA] = anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId);
  return mintPDA;
};

export const getPoolPDA = (args: ProgramInteractionArgs & { poolId: number | anchor.BN }) => {
  const program = getProgram(args);
  const POOL_SEED_CONSTANT = 'pool';
  const poolIdNum = getNum(args.poolId);
  const seeds = [
    Buffer.from(POOL_SEED_CONSTANT),
    Buffer.from(new Uint8Array(new BigUint64Array([BigInt(poolIdNum)]).buffer)),
  ];
  const [poolPDA] = anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId);
  return poolPDA;
};

export const getGlobalStatePDA = (args: ProgramInteractionArgs) => {
  const program = getProgram(args);
  const GLOBAL_SEED_CONSTANT = 'global-state';
  const [globalStatePda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(GLOBAL_SEED_CONSTANT)],
    program.programId
  );
  return globalStatePda;
};

export const getNextPoolId = async (args: ProgramInteractionArgs) => {
  const program = getProgram(args);
  const globalStatePda = getGlobalStatePDA(args);
  try {
    const globalState = await program.account.globalState.fetch(globalStatePda);
    return globalState.poolsCreated.toNumber() + 1;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const accountDoesNotExist = err?.message?.includes('Account does not exist');
    if (accountDoesNotExist) return 1;
    throw err;
  }
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

export const getUnitAmount = (amount: number | string, decimals = 9) => {
  const numAmount = typeof amount === 'string' ? parseInt(amount) : amount;
  if (numAmount === 0) {
    return '0'; // Adjust this based on the desired number of decimal places
  }
  const amountInUnits = numAmount / Math.pow(10, decimals);
  const formattedUnitAmt = amountInUnits.toFixed(9).replace(/\.?0+$/, ''); // Adjust this based on the desired number of decimal places
  return formattedUnitAmt;
};
