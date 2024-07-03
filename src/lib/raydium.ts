import {
  MARKET_STATE_LAYOUT_V3,
  AMM_V4,
  Raydium,
  TxVersion,
  USDCMint,
  DEVNET_PROGRAM_ID,
  ApiV3PoolInfoStandardItem,
  TokenAmount,
  toToken,
  Percent,
  AMM_STABLE,
} from '@raydium-io/raydium-sdk-v2';
import BN from 'bn.js';
import { Connection, PublicKey, clusterApiUrl, Keypair } from '@solana/web3.js';
import { getNetwork } from './utils';
import Decimal from 'decimal.js';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';

const VALID_PROGRAM_ID = new Set([
  AMM_V4.toBase58(),
  AMM_STABLE.toBase58(),
  DEVNET_PROGRAM_ID.AmmV4.toBase58(),
  DEVNET_PROGRAM_ID.AmmStable.toBase58(),
]);

const network = getNetwork();

export const connection = new Connection(clusterApiUrl(network)); //<YOUR_RPC_URL>
export const txVersion = TxVersion.V0; // or TxVersion.LEGACY

const isValidAmm = (id: string) => VALID_PROGRAM_ID.has(id);

// https://github.com/raydium-io/raydium-sdk-V2-demo/blob/master/src/config.ts.template
let raydium: Raydium | undefined;
export const initSdk = async (params?: { owner: PublicKey; loadToken?: boolean }) => {
  if (raydium) return raydium;
  raydium = await Raydium.load({
    owner: params?.owner,
    connection,
    cluster: network === 'mainnet-beta' ? 'mainnet' : 'devnet', // 'mainnet' | 'devnet'
    disableFeatureCheck: true,
    disableLoadToken: !params?.loadToken,
  });
  return raydium;
};

export const createMarket = async (mintAddress: string) => {
  const raydium = await initSdk();
  // check mint info here: https://api-v3.raydium.io/mint/list
  // or get mint info by api: await raydium.token.getTokenInfo('mint address')
  const baseMintPublicKey = new PublicKey(mintAddress);
  const baseMint = await raydium.token.getTokenInfo(mintAddress);
  const SOL = 'So11111111111111111111111111111111111111112';
  const solPk = new PublicKey(SOL);
  console.log('baseMint', baseMint);
  const { execute, extInfo, transactions } = await raydium.marketV2.create({
    baseInfo: {
      mint: baseMintPublicKey,
      decimals: 9,
    },
    quoteInfo: {
      mint: solPk,
      decimals: 9,
    },
    lotSize: 3,
    tickSize: 0.01,
    dexProgramId: DEVNET_PROGRAM_ID.OPENBOOK_MARKET, // devnet: DEVNET_PROGRAM_ID.OPENBOOK_MARKET
    txVersion,
    // optional: set up priority fee here
    // computeBudgetConfig: {
    //   units: 600000,
    //   microLamports: 100000000,
    // },
  });

  console.log(
    `create market total ${transactions.length} txs, market info: `,
    Object.keys(extInfo.address).reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: extInfo.address[cur as keyof typeof extInfo.address].toBase58(),
      }),
      {}
    )
  );

  const txIds = await execute({
    // set sequentially to true means tx will be sent when previous one confirmed
    sequentially: true,
  });

  console.log('create market txIds:', txIds);
};

// Must create a market before creating an AMM pool
export const createAmmPool = async (marketId: string) => {
  const raydium = await initSdk();
  const marketIdPubKey = new PublicKey(marketId);

  // if you are confirmed your market info, don't have to get market info from rpc below
  const marketBufferInfo = await raydium.connection.getAccountInfo(marketIdPubKey);
  const { baseMint, quoteMint } = MARKET_STATE_LAYOUT_V3.decode(marketBufferInfo!.data);

  // check mint info here: https://api-v3.raydium.io/mint/list
  // or get mint info by api: await raydium.token.getTokenInfo('mint address')
  const baseMintInfo = await raydium.token.getTokenInfo(baseMint);
  const quoteMintInfo = await raydium.token.getTokenInfo(quoteMint);

  const { execute, extInfo } = await raydium.liquidity.createPoolV4({
    programId: AMM_V4, // devnet: DEVNET_PROGRAM_ID.AmmV4
    marketInfo: {
      marketId: marketIdPubKey,
      programId: DEVNET_PROGRAM_ID.OPENBOOK_MARKET, // devnet: DEVNET_PROGRAM_ID.OPENBOOK_MARKET
    },
    baseMintInfo: {
      mint: baseMint,
      decimals: baseMintInfo.decimals, // if you know mint decimals here, can pass number directly
    },
    quoteMintInfo: {
      mint: quoteMint,
      decimals: quoteMintInfo.decimals, // if you know mint decimals here, can pass number directly
    },
    baseAmount: new BN(1000),
    quoteAmount: new BN(1000),
    startTime: new BN(0),
    ownerInfo: {
      useSOLBalance: true,
    },
    associatedOnly: false,
    txVersion,
    feeDestinationId: DEVNET_PROGRAM_ID.FEE_DESTINATION_ID, // devnet: DEVNET_PROGRAM_ID.FEE_DESTINATION_ID
    // optional: set up priority fee here
    // computeBudgetConfig: {
    //   units: 600000,
    //   microLamports: 10000000,
    // },
  });

  const { txId } = await execute();
  console.log(
    'amm pool created! txId: ',
    txId,
    ', poolKeys:',
    Object.keys(extInfo.address).reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: extInfo.address[cur as keyof typeof extInfo.address].toBase58(),
      }),
      {}
    )
  );
};

// Must create a pool before adding liquidity
export const addLiquidity = async () => {
  const raydium = await initSdk();
  // RAY-USDC pool
  // note: api doesn't support get devnet pool info
  const data = await raydium.api.fetchPoolById({
    ids: '6UmmUiYoBjSrhakAobJw8BvkmJtDVxaeBtbt7rxWo1mg',
  });
  const poolInfo = data[0] as ApiV3PoolInfoStandardItem;

  if (!isValidAmm(poolInfo.programId)) throw new Error('target pool is not AMM pool');

  const inputAmount = '1';

  const r = raydium.liquidity.computePairAmount({
    poolInfo,
    amount: inputAmount,
    baseIn: true,
    slippage: new Percent(1, 100), // 1%
  });

  const { execute } = await raydium.liquidity.addLiquidity({
    poolInfo,
    amountInA: new TokenAmount(
      toToken(poolInfo.mintA),
      new Decimal(inputAmount).mul(10 ** poolInfo.mintA.decimals).toFixed(0)
    ),
    amountInB: new TokenAmount(
      toToken(poolInfo.mintA),
      new Decimal(r.maxAnotherAmount.toExact()).mul(10 ** poolInfo.mintA.decimals).toFixed(0)
    ),
    fixedSide: 'a',
    txVersion,
    // optional: set up priority fee here
    // computeBudgetConfig: {
    //   units: 600000,
    //   microLamports: 100000000,
    // },
  });

  const { txId } = await execute();
  console.log('liquidity added:', { txId });
};