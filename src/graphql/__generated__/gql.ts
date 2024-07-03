/* eslint-disable */
import * as types from './graphql.js';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  fragment Token on Token {\n    id\n    createdAt\n    updatedAt\n    name\n    symbol\n    uri\n    decimals\n    supply\n    contractAddress\n    latestPurchasePrice\n    image\n    description\n  }\n": types.TokenFragmentDoc,
    "\n  fragment Comment on Comment {\n    id\n    createdAt\n    updatedAt\n    text\n    poolId\n    creator\n  }\n": types.CommentFragmentDoc,
    "\n  fragment Pool on Pool {\n    id\n    createdAt\n    updatedAt\n    creator\n    contractAddress\n    maturityTime\n    token {\n      ...Token\n    }\n    comments {\n      ...Comment\n    }\n  }\n  \n  \n": types.PoolFragmentDoc,
    "\n  fragment User on User {\n    id\n    createdAt\n    updatedAt\n    name\n    email\n    username\n    bio\n    wallet\n    profilePicture\n    twitterUserId\n    twitterHandle\n  }\n": types.UserFragmentDoc,
    "\n  fragment Trade on Trade {\n    id\n    symbol\n    timestamp\n    price\n    quantity\n    trader\n    type\n  }\n": types.TradeFragmentDoc,
    "\n  fragment CandleStick on CandleStick {\n    id\n    symbol\n    timestamp\n    open\n    close\n    high\n    low\n    volume\n  }\n": types.CandleStickFragmentDoc,
    "\n  mutation createPool($transaction: String!) {\n    createPool(transaction: $transaction) {\n      ...Pool\n    }\n  }\n  \n": types.CreatePoolDocument,
    "\n  mutation recordTrade($transaction: String!) {\n    recordTrade(transaction: $transaction) {\n      ...Pool\n    }\n  }\n  \n": types.RecordTradeDocument,
    "\n  mutation addComment($poolId: Int!, $text: String!, $creator: String!) {\n    addComment(poolId: $poolId, text: $text, creator: $creator) {\n      ...Comment\n    }\n  }\n  \n": types.AddCommentDocument,
    "\n  mutation authenticate {\n    authenticate {\n      ...User\n    }\n  }\n  \n": types.AuthenticateDocument,
    "\n  query getPools {\n    getPools {\n      ...Pool\n    }\n  }\n  \n": types.GetPoolsDocument,
    "\n  query getTokenMetaPresignedUrl(\n    $mintAddress: String!\n    $fileType: String!\n    $assetType: FileUploadType!\n  ) {\n    getTokenMetaPresignedUrl(\n      mintAddress: $mintAddress\n      fileType: $fileType\n      assetType: $assetType\n    ) {\n      key\n      url\n    }\n  }\n": types.GetTokenMetaPresignedUrlDocument,
    "\n  query getPool($symbol: String, $contractAddress: String) {\n    getPool(symbol: $symbol, contractAddress: $contractAddress) {\n      ...Pool\n      token {\n        ...Token\n        holders\n      }\n    }\n  }\n  \n  \n": types.GetPoolDocument,
    "\n  query getToken($contractAddress: String!) {\n    getToken(contractAddress: $contractAddress) {\n      ...Token\n    }\n  }\n  \n": types.GetTokenDocument,
    "\n  query getProfile {\n    getProfile {\n      ...User\n    }\n  }\n  \n": types.GetProfileDocument,
    "\n  query getTrades($symbol: String!) {\n    getTrades(symbol: $symbol) {\n      trades {\n        ...Trade\n      }\n      candleSticks {\n        ONE_SECOND {\n          ...CandleStick\n        }\n        THIRTY_SECONDS {\n          ...CandleStick\n        }\n        ONE_MINUTE {\n          ...CandleStick\n        }\n        FIVE_MINUTES {\n          ...CandleStick\n        }\n        FIFTEEN_MINUTES {\n          ...CandleStick\n        }\n        THIRTY_MINUTES {\n          ...CandleStick\n        }\n        ONE_HOUR {\n          ...CandleStick\n        }\n        FOUR_HOURS {\n          ...CandleStick\n        }\n        ONE_DAY {\n          ...CandleStick\n        }\n        ONE_WEEK {\n          ...CandleStick\n        }\n      }\n    }\n  }\n  \n  \n": types.GetTradesDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment Token on Token {\n    id\n    createdAt\n    updatedAt\n    name\n    symbol\n    uri\n    decimals\n    supply\n    contractAddress\n    latestPurchasePrice\n    image\n    description\n  }\n"): (typeof documents)["\n  fragment Token on Token {\n    id\n    createdAt\n    updatedAt\n    name\n    symbol\n    uri\n    decimals\n    supply\n    contractAddress\n    latestPurchasePrice\n    image\n    description\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment Comment on Comment {\n    id\n    createdAt\n    updatedAt\n    text\n    poolId\n    creator\n  }\n"): (typeof documents)["\n  fragment Comment on Comment {\n    id\n    createdAt\n    updatedAt\n    text\n    poolId\n    creator\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment Pool on Pool {\n    id\n    createdAt\n    updatedAt\n    creator\n    contractAddress\n    maturityTime\n    token {\n      ...Token\n    }\n    comments {\n      ...Comment\n    }\n  }\n  \n  \n"): (typeof documents)["\n  fragment Pool on Pool {\n    id\n    createdAt\n    updatedAt\n    creator\n    contractAddress\n    maturityTime\n    token {\n      ...Token\n    }\n    comments {\n      ...Comment\n    }\n  }\n  \n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment User on User {\n    id\n    createdAt\n    updatedAt\n    name\n    email\n    username\n    bio\n    wallet\n    profilePicture\n    twitterUserId\n    twitterHandle\n  }\n"): (typeof documents)["\n  fragment User on User {\n    id\n    createdAt\n    updatedAt\n    name\n    email\n    username\n    bio\n    wallet\n    profilePicture\n    twitterUserId\n    twitterHandle\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment Trade on Trade {\n    id\n    symbol\n    timestamp\n    price\n    quantity\n    trader\n    type\n  }\n"): (typeof documents)["\n  fragment Trade on Trade {\n    id\n    symbol\n    timestamp\n    price\n    quantity\n    trader\n    type\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment CandleStick on CandleStick {\n    id\n    symbol\n    timestamp\n    open\n    close\n    high\n    low\n    volume\n  }\n"): (typeof documents)["\n  fragment CandleStick on CandleStick {\n    id\n    symbol\n    timestamp\n    open\n    close\n    high\n    low\n    volume\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createPool($transaction: String!) {\n    createPool(transaction: $transaction) {\n      ...Pool\n    }\n  }\n  \n"): (typeof documents)["\n  mutation createPool($transaction: String!) {\n    createPool(transaction: $transaction) {\n      ...Pool\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation recordTrade($transaction: String!) {\n    recordTrade(transaction: $transaction) {\n      ...Pool\n    }\n  }\n  \n"): (typeof documents)["\n  mutation recordTrade($transaction: String!) {\n    recordTrade(transaction: $transaction) {\n      ...Pool\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation addComment($poolId: Int!, $text: String!, $creator: String!) {\n    addComment(poolId: $poolId, text: $text, creator: $creator) {\n      ...Comment\n    }\n  }\n  \n"): (typeof documents)["\n  mutation addComment($poolId: Int!, $text: String!, $creator: String!) {\n    addComment(poolId: $poolId, text: $text, creator: $creator) {\n      ...Comment\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation authenticate {\n    authenticate {\n      ...User\n    }\n  }\n  \n"): (typeof documents)["\n  mutation authenticate {\n    authenticate {\n      ...User\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getPools {\n    getPools {\n      ...Pool\n    }\n  }\n  \n"): (typeof documents)["\n  query getPools {\n    getPools {\n      ...Pool\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getTokenMetaPresignedUrl(\n    $mintAddress: String!\n    $fileType: String!\n    $assetType: FileUploadType!\n  ) {\n    getTokenMetaPresignedUrl(\n      mintAddress: $mintAddress\n      fileType: $fileType\n      assetType: $assetType\n    ) {\n      key\n      url\n    }\n  }\n"): (typeof documents)["\n  query getTokenMetaPresignedUrl(\n    $mintAddress: String!\n    $fileType: String!\n    $assetType: FileUploadType!\n  ) {\n    getTokenMetaPresignedUrl(\n      mintAddress: $mintAddress\n      fileType: $fileType\n      assetType: $assetType\n    ) {\n      key\n      url\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getPool($symbol: String, $contractAddress: String) {\n    getPool(symbol: $symbol, contractAddress: $contractAddress) {\n      ...Pool\n      token {\n        ...Token\n        holders\n      }\n    }\n  }\n  \n  \n"): (typeof documents)["\n  query getPool($symbol: String, $contractAddress: String) {\n    getPool(symbol: $symbol, contractAddress: $contractAddress) {\n      ...Pool\n      token {\n        ...Token\n        holders\n      }\n    }\n  }\n  \n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getToken($contractAddress: String!) {\n    getToken(contractAddress: $contractAddress) {\n      ...Token\n    }\n  }\n  \n"): (typeof documents)["\n  query getToken($contractAddress: String!) {\n    getToken(contractAddress: $contractAddress) {\n      ...Token\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getProfile {\n    getProfile {\n      ...User\n    }\n  }\n  \n"): (typeof documents)["\n  query getProfile {\n    getProfile {\n      ...User\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getTrades($symbol: String!) {\n    getTrades(symbol: $symbol) {\n      trades {\n        ...Trade\n      }\n      candleSticks {\n        ONE_SECOND {\n          ...CandleStick\n        }\n        THIRTY_SECONDS {\n          ...CandleStick\n        }\n        ONE_MINUTE {\n          ...CandleStick\n        }\n        FIVE_MINUTES {\n          ...CandleStick\n        }\n        FIFTEEN_MINUTES {\n          ...CandleStick\n        }\n        THIRTY_MINUTES {\n          ...CandleStick\n        }\n        ONE_HOUR {\n          ...CandleStick\n        }\n        FOUR_HOURS {\n          ...CandleStick\n        }\n        ONE_DAY {\n          ...CandleStick\n        }\n        ONE_WEEK {\n          ...CandleStick\n        }\n      }\n    }\n  }\n  \n  \n"): (typeof documents)["\n  query getTrades($symbol: String!) {\n    getTrades(symbol: $symbol) {\n      trades {\n        ...Trade\n      }\n      candleSticks {\n        ONE_SECOND {\n          ...CandleStick\n        }\n        THIRTY_SECONDS {\n          ...CandleStick\n        }\n        ONE_MINUTE {\n          ...CandleStick\n        }\n        FIVE_MINUTES {\n          ...CandleStick\n        }\n        FIFTEEN_MINUTES {\n          ...CandleStick\n        }\n        THIRTY_MINUTES {\n          ...CandleStick\n        }\n        ONE_HOUR {\n          ...CandleStick\n        }\n        FOUR_HOURS {\n          ...CandleStick\n        }\n        ONE_DAY {\n          ...CandleStick\n        }\n        ONE_WEEK {\n          ...CandleStick\n        }\n      }\n    }\n  }\n  \n  \n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;