import * as anchor from '@coral-xyz/anchor';
import {
  ProgramInteractionArgs,
  getProgram,
  getNum,
  getMetadataPDA,
  getMintPDA,
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

export const createPoolTxn = async (args: CreatePoolArgs) => {
  const program = getProgram(args);
  const poolId = await getNextPoolId(args);
  const mint = getMintPDA({ ...args, poolId });
  const metadataPDA = getMetadataPDA(mint);
  const creator = args.wallet.publicKey;
  const transaction = await program.methods
    .initialize(new anchor.BN(poolId), args.token)
    .accounts({
      signer: creator,
      metadata: metadataPDA,
    })
    .transaction();
  const latestBlock = await args.connection.getLatestBlockhash();
  transaction.feePayer = creator;
  transaction.recentBlockhash = latestBlock.blockhash;
  return transaction;
};

export const buyTokensTxn = async (args: TokenTransactionArgs) => {
  const program = getProgram(args);
  const poolIdNum = getNum(args.poolId);
  const mintPDA = getMintPDA({ ...args, poolId: poolIdNum });
  const buyer = args.wallet.publicKey;
  const buyerTokenAccount = await anchor.utils.token.associatedAddress({
    mint: mintPDA,
    owner: buyer,
  });
  const transaction = await program.methods
    .buy(new anchor.BN(poolIdNum), new anchor.BN(args.amount))
    .accounts({
      buyer: buyer,
      buyerTokenAccount,
    })
    .transaction();
  const latestBlock = await args.connection.getLatestBlockhash();
  transaction.feePayer = buyer;
  transaction.recentBlockhash = latestBlock.blockhash;
  return transaction;
};

export const sellTokensTxn = async (args: TokenTransactionArgs) => {
  const program = getProgram(args);
  const poolIdNum = getNum(args.poolId);
  const mintPDA = getMintPDA({ ...args, poolId: poolIdNum });
  const seller = args.wallet.publicKey;
  const sellerTokenAccount = await anchor.utils.token.associatedAddress({
    mint: mintPDA,
    owner: seller,
  });
  const transaction = await program.methods
    .sell(new anchor.BN(poolIdNum), new anchor.BN(args.amount))
    .accounts({
      seller,
      sellerTokenAccount,
    })
    .transaction();
  const latestBlock = await args.connection.getLatestBlockhash();
  transaction.feePayer = seller;
  transaction.recentBlockhash = latestBlock.blockhash;
  return transaction;
};
