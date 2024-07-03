/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** An arbitrary-precision integer */
  BigInt: { input: string; output: string; }
  /** DateTime with millisecond precision, represented as an ISO string */
  Date: { input: string; output: string; }
  JSON: { input: string; output: string; }
  /** Date as a Unix timestamp in seconds since the epoch */
  UnixTimestamp: { input: string; output: string; }
};

export type CandleStick = {
  __typename: 'CandleStick';
  close?: Maybe<Scalars['Float']['output']>;
  high?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  interval: TradeTimeInterval;
  low?: Maybe<Scalars['Float']['output']>;
  open?: Maybe<Scalars['Float']['output']>;
  symbol: Scalars['String']['output'];
  timestamp: Scalars['Date']['output'];
  volume?: Maybe<Scalars['BigInt']['output']>;
};

export type CandleStickPayload = {
  __typename: 'CandleStickPayload';
  FIFTEEN_MINUTES: Array<CandleStick>;
  FIVE_MINUTES: Array<CandleStick>;
  FOUR_HOURS: Array<CandleStick>;
  ONE_DAY: Array<CandleStick>;
  ONE_HOUR: Array<CandleStick>;
  ONE_MINUTE: Array<CandleStick>;
  ONE_SECOND: Array<CandleStick>;
  ONE_WEEK: Array<CandleStick>;
  THIRTY_MINUTES: Array<CandleStick>;
  THIRTY_SECONDS: Array<CandleStick>;
};

export type Comment = {
  __typename: 'Comment';
  createdAt: Scalars['Date']['output'];
  creator: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  poolId: Scalars['Int']['output'];
  text: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export enum FileUploadType {
  TokenImage = 'TOKEN_IMAGE',
  TokenMetadataJson = 'TOKEN_METADATA_JSON'
}

export type Mutation = {
  __typename: 'Mutation';
  addComment: Comment;
  authenticate?: Maybe<User>;
  createPool: Pool;
  recordTrade: Pool;
  syncProgramData: Scalars['Boolean']['output'];
};


export type MutationAddCommentArgs = {
  creator: Scalars['String']['input'];
  poolId: Scalars['Int']['input'];
  text: Scalars['String']['input'];
};


export type MutationCreatePoolArgs = {
  transaction: Scalars['String']['input'];
};


export type MutationRecordTradeArgs = {
  transaction: Scalars['String']['input'];
};

export type Pool = {
  __typename: 'Pool';
  comments: Array<Comment>;
  contractAddress: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  creator: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  maturityTime: Scalars['Date']['output'];
  token?: Maybe<Token>;
  updatedAt: Scalars['Date']['output'];
};

export type PresignedUrlResponse = {
  __typename: 'PresignedUrlResponse';
  key: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Query = {
  __typename: 'Query';
  getPool?: Maybe<Pool>;
  getPools: Array<Pool>;
  getProfile?: Maybe<User>;
  getToken?: Maybe<Token>;
  getTokenMetaPresignedUrl: PresignedUrlResponse;
  getTrades: TradesPayload;
};


export type QueryGetPoolArgs = {
  contractAddress?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetTokenArgs = {
  contractAddress?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetTokenMetaPresignedUrlArgs = {
  assetType: FileUploadType;
  fileType: Scalars['String']['input'];
  mintAddress: Scalars['String']['input'];
};


export type QueryGetTradesArgs = {
  symbol: Scalars['String']['input'];
};

export type Token = {
  __typename: 'Token';
  contractAddress: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  creator: Scalars['String']['output'];
  decimals: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  holders?: Maybe<Array<Scalars['String']['output']>>;
  id: Scalars['Int']['output'];
  image?: Maybe<Scalars['String']['output']>;
  latestPurchasePrice?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  pool?: Maybe<Pool>;
  poolId: Scalars['Int']['output'];
  supply: Scalars['BigInt']['output'];
  symbol: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  uri?: Maybe<Scalars['String']['output']>;
};

export type Trade = {
  __typename: 'Trade';
  id: Scalars['Int']['output'];
  price: Scalars['Float']['output'];
  quantity: Scalars['BigInt']['output'];
  symbol: Scalars['String']['output'];
  timestamp: Scalars['Date']['output'];
  trader: Scalars['String']['output'];
  type: TradeType;
};

export enum TradeTimeInterval {
  FifteenMinutes = 'FIFTEEN_MINUTES',
  FiveMinutes = 'FIVE_MINUTES',
  FourHours = 'FOUR_HOURS',
  OneDay = 'ONE_DAY',
  OneHour = 'ONE_HOUR',
  OneMinute = 'ONE_MINUTE',
  OneMonth = 'ONE_MONTH',
  OneSecond = 'ONE_SECOND',
  OneWeek = 'ONE_WEEK',
  ThirtyMinutes = 'THIRTY_MINUTES',
  ThirtySeconds = 'THIRTY_SECONDS'
}

export enum TradeType {
  Buy = 'BUY',
  Sell = 'SELL'
}

export type TradesPayload = {
  __typename: 'TradesPayload';
  candleSticks: CandleStickPayload;
  trades: Array<Trade>;
};

export type User = {
  __typename: 'User';
  bio?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  issuer?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  twitterHandle?: Maybe<Scalars['String']['output']>;
  twitterUserId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  username?: Maybe<Scalars['String']['output']>;
  wallet?: Maybe<Scalars['String']['output']>;
};

export type TokenFragment = { __typename: 'Token', id: number, createdAt: string, updatedAt: string, name: string, symbol: string, uri?: string | null, decimals: number, supply: string, contractAddress: string, latestPurchasePrice?: number | null, image?: string | null, description?: string | null } & { ' $fragmentName'?: 'TokenFragment' };

export type CommentFragment = { __typename: 'Comment', id: number, createdAt: string, updatedAt: string, text: string, poolId: number, creator: string } & { ' $fragmentName'?: 'CommentFragment' };

export type PoolFragment = { __typename: 'Pool', id: number, createdAt: string, updatedAt: string, creator: string, contractAddress: string, maturityTime: string, token?: (
    { __typename: 'Token' }
    & { ' $fragmentRefs'?: { 'TokenFragment': TokenFragment } }
  ) | null, comments: Array<(
    { __typename: 'Comment' }
    & { ' $fragmentRefs'?: { 'CommentFragment': CommentFragment } }
  )> } & { ' $fragmentName'?: 'PoolFragment' };

export type UserFragment = { __typename: 'User', id: number, createdAt: string, updatedAt: string, name?: string | null, email?: string | null, username?: string | null, bio?: string | null, wallet?: string | null, profilePicture?: string | null, twitterUserId?: string | null, twitterHandle?: string | null } & { ' $fragmentName'?: 'UserFragment' };

export type TradeFragment = { __typename: 'Trade', id: number, symbol: string, timestamp: string, price: number, quantity: string, trader: string, type: TradeType } & { ' $fragmentName'?: 'TradeFragment' };

export type CandleStickFragment = { __typename: 'CandleStick', id?: number | null, symbol: string, timestamp: string, open?: number | null, close?: number | null, high?: number | null, low?: number | null, volume?: string | null } & { ' $fragmentName'?: 'CandleStickFragment' };

export type CreatePoolMutationVariables = Exact<{
  transaction: Scalars['String']['input'];
}>;


export type CreatePoolMutation = { __typename: 'Mutation', createPool: (
    { __typename: 'Pool' }
    & { ' $fragmentRefs'?: { 'PoolFragment': PoolFragment } }
  ) };

export type RecordTradeMutationVariables = Exact<{
  transaction: Scalars['String']['input'];
}>;


export type RecordTradeMutation = { __typename: 'Mutation', recordTrade: (
    { __typename: 'Pool' }
    & { ' $fragmentRefs'?: { 'PoolFragment': PoolFragment } }
  ) };

export type AddCommentMutationVariables = Exact<{
  poolId: Scalars['Int']['input'];
  text: Scalars['String']['input'];
  creator: Scalars['String']['input'];
}>;


export type AddCommentMutation = { __typename: 'Mutation', addComment: (
    { __typename: 'Comment' }
    & { ' $fragmentRefs'?: { 'CommentFragment': CommentFragment } }
  ) };

export type AuthenticateMutationVariables = Exact<{ [key: string]: never; }>;


export type AuthenticateMutation = { __typename: 'Mutation', authenticate?: (
    { __typename: 'User' }
    & { ' $fragmentRefs'?: { 'UserFragment': UserFragment } }
  ) | null };

export type GetPoolsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPoolsQuery = { __typename: 'Query', getPools: Array<(
    { __typename: 'Pool' }
    & { ' $fragmentRefs'?: { 'PoolFragment': PoolFragment } }
  )> };

export type GetTokenMetaPresignedUrlQueryVariables = Exact<{
  mintAddress: Scalars['String']['input'];
  fileType: Scalars['String']['input'];
  assetType: FileUploadType;
}>;


export type GetTokenMetaPresignedUrlQuery = { __typename: 'Query', getTokenMetaPresignedUrl: { __typename: 'PresignedUrlResponse', key: string, url: string } };

export type GetPoolQueryVariables = Exact<{
  symbol?: InputMaybe<Scalars['String']['input']>;
  contractAddress?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetPoolQuery = { __typename: 'Query', getPool?: (
    { __typename: 'Pool', token?: (
      { __typename: 'Token', holders?: Array<string> | null }
      & { ' $fragmentRefs'?: { 'TokenFragment': TokenFragment } }
    ) | null }
    & { ' $fragmentRefs'?: { 'PoolFragment': PoolFragment } }
  ) | null };

export type GetTokenQueryVariables = Exact<{
  contractAddress: Scalars['String']['input'];
}>;


export type GetTokenQuery = { __typename: 'Query', getToken?: (
    { __typename: 'Token' }
    & { ' $fragmentRefs'?: { 'TokenFragment': TokenFragment } }
  ) | null };

export type GetProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProfileQuery = { __typename: 'Query', getProfile?: (
    { __typename: 'User' }
    & { ' $fragmentRefs'?: { 'UserFragment': UserFragment } }
  ) | null };

export type GetTradesQueryVariables = Exact<{
  symbol: Scalars['String']['input'];
}>;


export type GetTradesQuery = { __typename: 'Query', getTrades: { __typename: 'TradesPayload', trades: Array<(
      { __typename: 'Trade' }
      & { ' $fragmentRefs'?: { 'TradeFragment': TradeFragment } }
    )>, candleSticks: { __typename: 'CandleStickPayload', ONE_SECOND: Array<(
        { __typename: 'CandleStick' }
        & { ' $fragmentRefs'?: { 'CandleStickFragment': CandleStickFragment } }
      )>, THIRTY_SECONDS: Array<(
        { __typename: 'CandleStick' }
        & { ' $fragmentRefs'?: { 'CandleStickFragment': CandleStickFragment } }
      )>, ONE_MINUTE: Array<(
        { __typename: 'CandleStick' }
        & { ' $fragmentRefs'?: { 'CandleStickFragment': CandleStickFragment } }
      )>, FIVE_MINUTES: Array<(
        { __typename: 'CandleStick' }
        & { ' $fragmentRefs'?: { 'CandleStickFragment': CandleStickFragment } }
      )>, FIFTEEN_MINUTES: Array<(
        { __typename: 'CandleStick' }
        & { ' $fragmentRefs'?: { 'CandleStickFragment': CandleStickFragment } }
      )>, THIRTY_MINUTES: Array<(
        { __typename: 'CandleStick' }
        & { ' $fragmentRefs'?: { 'CandleStickFragment': CandleStickFragment } }
      )>, ONE_HOUR: Array<(
        { __typename: 'CandleStick' }
        & { ' $fragmentRefs'?: { 'CandleStickFragment': CandleStickFragment } }
      )>, FOUR_HOURS: Array<(
        { __typename: 'CandleStick' }
        & { ' $fragmentRefs'?: { 'CandleStickFragment': CandleStickFragment } }
      )>, ONE_DAY: Array<(
        { __typename: 'CandleStick' }
        & { ' $fragmentRefs'?: { 'CandleStickFragment': CandleStickFragment } }
      )>, ONE_WEEK: Array<(
        { __typename: 'CandleStick' }
        & { ' $fragmentRefs'?: { 'CandleStickFragment': CandleStickFragment } }
      )> } } };

export const TokenFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Token"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Token"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"uri"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"supply"}},{"kind":"Field","name":{"kind":"Name","value":"contractAddress"}},{"kind":"Field","name":{"kind":"Name","value":"latestPurchasePrice"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<TokenFragment, unknown>;
export const CommentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Comment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"poolId"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}}]}}]} as unknown as DocumentNode<CommentFragment, unknown>;
export const PoolFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pool"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"contractAddress"}},{"kind":"Field","name":{"kind":"Name","value":"maturityTime"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Token"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Comment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Token"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Token"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"uri"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"supply"}},{"kind":"Field","name":{"kind":"Name","value":"contractAddress"}},{"kind":"Field","name":{"kind":"Name","value":"latestPurchasePrice"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Comment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"poolId"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}}]}}]} as unknown as DocumentNode<PoolFragment, unknown>;
export const UserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"wallet"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}},{"kind":"Field","name":{"kind":"Name","value":"twitterUserId"}},{"kind":"Field","name":{"kind":"Name","value":"twitterHandle"}}]}}]} as unknown as DocumentNode<UserFragment, unknown>;
export const TradeFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Trade"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Trade"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"trader"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<TradeFragment, unknown>;
export const CandleStickFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CandleStick"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CandleStick"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"open"}},{"kind":"Field","name":{"kind":"Name","value":"close"}},{"kind":"Field","name":{"kind":"Name","value":"high"}},{"kind":"Field","name":{"kind":"Name","value":"low"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}}]}}]} as unknown as DocumentNode<CandleStickFragment, unknown>;
export const CreatePoolDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createPool"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"transaction"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPool"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"transaction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"transaction"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pool"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Token"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Token"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"uri"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"supply"}},{"kind":"Field","name":{"kind":"Name","value":"contractAddress"}},{"kind":"Field","name":{"kind":"Name","value":"latestPurchasePrice"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Comment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"poolId"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pool"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"contractAddress"}},{"kind":"Field","name":{"kind":"Name","value":"maturityTime"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Token"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Comment"}}]}}]}}]} as unknown as DocumentNode<CreatePoolMutation, CreatePoolMutationVariables>;
export const RecordTradeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"recordTrade"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"transaction"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordTrade"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"transaction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"transaction"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pool"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Token"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Token"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"uri"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"supply"}},{"kind":"Field","name":{"kind":"Name","value":"contractAddress"}},{"kind":"Field","name":{"kind":"Name","value":"latestPurchasePrice"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Comment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"poolId"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pool"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"contractAddress"}},{"kind":"Field","name":{"kind":"Name","value":"maturityTime"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Token"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Comment"}}]}}]}}]} as unknown as DocumentNode<RecordTradeMutation, RecordTradeMutationVariables>;
export const AddCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"poolId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"creator"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"poolId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"poolId"}}},{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}},{"kind":"Argument","name":{"kind":"Name","value":"creator"},"value":{"kind":"Variable","name":{"kind":"Name","value":"creator"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Comment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Comment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"poolId"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}}]}}]} as unknown as DocumentNode<AddCommentMutation, AddCommentMutationVariables>;
export const AuthenticateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"authenticate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authenticate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"User"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"wallet"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}},{"kind":"Field","name":{"kind":"Name","value":"twitterUserId"}},{"kind":"Field","name":{"kind":"Name","value":"twitterHandle"}}]}}]} as unknown as DocumentNode<AuthenticateMutation, AuthenticateMutationVariables>;
export const GetPoolsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPools"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPools"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pool"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Token"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Token"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"uri"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"supply"}},{"kind":"Field","name":{"kind":"Name","value":"contractAddress"}},{"kind":"Field","name":{"kind":"Name","value":"latestPurchasePrice"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Comment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"poolId"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pool"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"contractAddress"}},{"kind":"Field","name":{"kind":"Name","value":"maturityTime"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Token"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Comment"}}]}}]}}]} as unknown as DocumentNode<GetPoolsQuery, GetPoolsQueryVariables>;
export const GetTokenMetaPresignedUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTokenMetaPresignedUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mintAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assetType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FileUploadType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTokenMetaPresignedUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mintAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mintAddress"}}},{"kind":"Argument","name":{"kind":"Name","value":"fileType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileType"}}},{"kind":"Argument","name":{"kind":"Name","value":"assetType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assetType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<GetTokenMetaPresignedUrlQuery, GetTokenMetaPresignedUrlQueryVariables>;
export const GetPoolDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPool"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"symbol"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contractAddress"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPool"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"symbol"},"value":{"kind":"Variable","name":{"kind":"Name","value":"symbol"}}},{"kind":"Argument","name":{"kind":"Name","value":"contractAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contractAddress"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pool"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Token"}},{"kind":"Field","name":{"kind":"Name","value":"holders"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Token"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Token"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"uri"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"supply"}},{"kind":"Field","name":{"kind":"Name","value":"contractAddress"}},{"kind":"Field","name":{"kind":"Name","value":"latestPurchasePrice"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Comment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"poolId"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pool"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"contractAddress"}},{"kind":"Field","name":{"kind":"Name","value":"maturityTime"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Token"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Comment"}}]}}]}}]} as unknown as DocumentNode<GetPoolQuery, GetPoolQueryVariables>;
export const GetTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contractAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"contractAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contractAddress"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Token"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Token"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Token"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"uri"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"supply"}},{"kind":"Field","name":{"kind":"Name","value":"contractAddress"}},{"kind":"Field","name":{"kind":"Name","value":"latestPurchasePrice"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<GetTokenQuery, GetTokenQueryVariables>;
export const GetProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"User"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"wallet"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}},{"kind":"Field","name":{"kind":"Name","value":"twitterUserId"}},{"kind":"Field","name":{"kind":"Name","value":"twitterHandle"}}]}}]} as unknown as DocumentNode<GetProfileQuery, GetProfileQueryVariables>;
export const GetTradesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTrades"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"symbol"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTrades"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"symbol"},"value":{"kind":"Variable","name":{"kind":"Name","value":"symbol"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trades"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Trade"}}]}},{"kind":"Field","name":{"kind":"Name","value":"candleSticks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ONE_SECOND"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CandleStick"}}]}},{"kind":"Field","name":{"kind":"Name","value":"THIRTY_SECONDS"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CandleStick"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ONE_MINUTE"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CandleStick"}}]}},{"kind":"Field","name":{"kind":"Name","value":"FIVE_MINUTES"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CandleStick"}}]}},{"kind":"Field","name":{"kind":"Name","value":"FIFTEEN_MINUTES"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CandleStick"}}]}},{"kind":"Field","name":{"kind":"Name","value":"THIRTY_MINUTES"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CandleStick"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ONE_HOUR"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CandleStick"}}]}},{"kind":"Field","name":{"kind":"Name","value":"FOUR_HOURS"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CandleStick"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ONE_DAY"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CandleStick"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ONE_WEEK"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CandleStick"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Trade"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Trade"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"trader"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CandleStick"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CandleStick"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"open"}},{"kind":"Field","name":{"kind":"Name","value":"close"}},{"kind":"Field","name":{"kind":"Name","value":"high"}},{"kind":"Field","name":{"kind":"Name","value":"low"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}}]}}]} as unknown as DocumentNode<GetTradesQuery, GetTradesQueryVariables>;