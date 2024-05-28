import * as anchor from '@coral-xyz/anchor';
import {
  ProgramInteractionArgs,
  getProgram,
  getNum,
  getMetadataPDA,
  getMintPDA,
  getExplorerUrl,
  getNextPoolId,
} from './utils';

type CreatePoolArgs = ProgramInteractionArgs & {
  token: {
    name: string;
    symbol: string;
    uri: string;
  };
};

type TokenTransactionArgs = ProgramInteractionArgs & {
  poolId: number | typeof anchor.BN;
  amount: number;
};

export const createPool = async (args: CreatePoolArgs) => {
  const program = getProgram(args);
  const poolId = await getNextPoolId(args);
  const mint = getMintPDA({ ...args, poolId });
  const metadataPDA = getMetadataPDA(mint);
  const creator = args.wallet.publicKey;
  console.log('Creating pool with id:', poolId);
  const txn = await program.methods
    .initialize(new anchor.BN(poolId), args.token)
    .accounts({
      signer: creator,
      metadata: metadataPDA,
    })
    .rpc();
  console.log('Transaction url:', getExplorerUrl(txn));
  return txn;
};

export const buyTokens = async (args: TokenTransactionArgs) => {
  const program = getProgram(args);
  const poolIdNum = getNum(args.poolId);
  const mintPDA = getMintPDA({ ...args, poolId: poolIdNum });
  const buyer = args.wallet.publicKey;
  const buyerTokenAccount = await anchor.utils.token.associatedAddress({
    mint: mintPDA,
    owner: buyer,
  });
  const txn = await program.methods
    .buy(new anchor.BN(poolIdNum), new anchor.BN(args.amount))
    .accounts({
      buyer: buyer,
      buyerTokenAccount,
    })
    .rpc();
  console.log('Transaction url:', getExplorerUrl(txn));
  return txn;
};

export const sellTokens = async (args: TokenTransactionArgs) => {
  const program = getProgram(args);
  const poolIdNum = getNum(args.poolId);
  const mintPDA = getMintPDA({ ...args, poolId: poolIdNum });
  const seller = args.wallet.publicKey;
  const sellerTokenAccount = await anchor.utils.token.associatedAddress({
    mint: mintPDA,
    owner: seller,
  });
  const txn = await program.methods
    .sell(new anchor.BN(poolIdNum), new anchor.BN(args.amount))
    .accounts({
      seller,
      sellerTokenAccount,
    })
    .rpc();
  console.log('Transaction url:', getExplorerUrl(txn));
  return txn;
};
