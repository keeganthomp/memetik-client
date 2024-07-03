import * as anchor from '@coral-xyz/anchor';
import { ProgramInteractionArgs, getProgram, getMetadataPDA, getMintPDA } from './utils';
import { PythSolanaReceiver } from '@pythnetwork/pyth-solana-receiver';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';

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

const SOL_PRICE_FEED_ID = '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d';

const priceFeedKP = anchor.web3.Keypair.generate();
export const getPriceFeedAccount = (args: ProgramInteractionArgs) => {
  const priceFeedWallet = new NodeWallet(priceFeedKP);
  const pythSolanaReceiver = new PythSolanaReceiver({
    connection: args.connection,
    wallet: priceFeedWallet,
  });
  return pythSolanaReceiver.getPriceFeedAccountAddress(0, SOL_PRICE_FEED_ID);
};

export const makeCreatePoolTxn = async (args: CreatePoolArgs) => {
  const program = getProgram(args);
  const mint = getMintPDA(args.token.symbol);
  const metadataPDA = getMetadataPDA(mint);
  const creator = args.wallet.publicKey;
  const transaction = await program.methods
    .initializePool(args.token.symbol, args.token.name, args.token.uri)
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
  const priceFeedAccount = getPriceFeedAccount(args);
  const buyer = args.wallet.publicKey;
  const transaction = await program.methods
    .buy(args.symbol, new anchor.BN(args.amount))
    .accounts({
      buyer: buyer,
      priceUpdate: priceFeedAccount,
    })
    .transaction();
  const latestBlock = await args.connection.getLatestBlockhash();
  transaction.feePayer = buyer;
  transaction.recentBlockhash = latestBlock.blockhash;
  return transaction;
};

export const makeSellTokenTxn = async (args: TokenTransactionArgs) => {
  const program = getProgram(args);
  const seller = args.wallet.publicKey;
  const transaction = await program.methods
    .sell(args.symbol, new anchor.BN(args.amount))
    .accounts({
      seller,
    })
    .transaction();
  const latestBlock = await args.connection.getLatestBlockhash();
  transaction.feePayer = seller;
  transaction.recentBlockhash = latestBlock.blockhash;
  return transaction;
};
