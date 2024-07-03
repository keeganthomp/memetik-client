import * as anchor from '@coral-xyz/anchor';
import { ProgramInteractionArgs, getProgram, getMetadataPDA, getMintPDA } from './utils';

type CreatePoolArgs = ProgramInteractionArgs & {
  token: {
    name: string;
    symbol: string;
    uri: string;
  };
};

type TokenTransactionArgs = ProgramInteractionArgs & {
  symbol: string;
  amount: number;
};

export const makeCreatePoolTxn = async (args: CreatePoolArgs) => {
  const program = getProgram(args);
  const mint = getMintPDA(args.token.symbol);
  const metadataPDA = getMetadataPDA(mint);
  const creator = args.wallet.publicKey;
  const transaction = await program.methods
    .initialize(args.token)
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

export const makeBuyTokenTxn = async (args: TokenTransactionArgs) => {
  const program = getProgram(args);
  const mintPDA = getMintPDA(args.symbol);
  const buyer = args.wallet.publicKey;
  const buyerTokenAccount = await anchor.utils.token.associatedAddress({
    mint: mintPDA,
    owner: buyer,
  });
  const transaction = await program.methods
    .buy(args.symbol, new anchor.BN(args.amount))
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

export const makeSellTokenTxn = async (args: TokenTransactionArgs) => {
  const program = getProgram(args);
  const mintPDA = getMintPDA(args.symbol);
  const seller = args.wallet.publicKey;
  const sellerTokenAccount = await anchor.utils.token.associatedAddress({
    mint: mintPDA,
    owner: seller,
  });
  const transaction = await program.methods
    .sell(args.symbol, new anchor.BN(args.amount))
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
