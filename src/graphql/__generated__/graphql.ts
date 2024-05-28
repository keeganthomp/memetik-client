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

export enum FileUploadType {
  TokenImage = 'TOKEN_IMAGE',
  TokenMetadataJson = 'TOKEN_METADATA_JSON'
}

export type Mutation = {
  __typename: 'Mutation';
  createPoolFromTxn: Pool;
  syncProgramData: Scalars['Boolean']['output'];
  updatePoolFromTxn: Pool;
};


export type MutationCreatePoolFromTxnArgs = {
  txn: Scalars['String']['input'];
};


export type MutationUpdatePoolFromTxnArgs = {
  txn: Scalars['String']['input'];
};

export type Pool = {
  __typename: 'Pool';
  address: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  creator: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  token: Token;
  tokenId: Scalars['Int']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type PresignedUrlResponse = {
  __typename: 'PresignedUrlResponse';
  key: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Query = {
  __typename: 'Query';
  getPools: Array<Pool>;
  getTokenMetaPresignedUrl: PresignedUrlResponse;
};


export type QueryGetTokenMetaPresignedUrlArgs = {
  assetType: FileUploadType;
  fileType: Scalars['String']['input'];
  mintAddress: Scalars['String']['input'];
};

export type Token = {
  __typename: 'Token';
  address: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  decimals: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  image?: Maybe<Scalars['String']['output']>;
  latestPurchasePrice?: Maybe<Scalars['BigInt']['output']>;
  name: Scalars['String']['output'];
  pool?: Maybe<Pool>;
  supply: Scalars['BigInt']['output'];
  symbol: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  uri?: Maybe<Scalars['String']['output']>;
};

export type TokenFragment = { __typename: 'Token', id: number, createdAt: string, updatedAt: string, name: string, symbol: string, uri?: string | null, decimals: number, supply: string, address: string, latestPurchasePrice?: string | null, image?: string | null, description?: string | null } & { ' $fragmentName'?: 'TokenFragment' };

export type PoolFragment = { __typename: 'Pool', id: number, createdAt: string, updatedAt: string, creator: string, tokenId: number, address: string, token: (
    { __typename: 'Token' }
    & { ' $fragmentRefs'?: { 'TokenFragment': TokenFragment } }
  ) } & { ' $fragmentName'?: 'PoolFragment' };

export type CreatePoolFromTxnMutationVariables = Exact<{
  txn: Scalars['String']['input'];
}>;


export type CreatePoolFromTxnMutation = { __typename: 'Mutation', createPoolFromTxn: (
    { __typename: 'Pool' }
    & { ' $fragmentRefs'?: { 'PoolFragment': PoolFragment } }
  ) };

export type UpdatePoolFromTxnMutationVariables = Exact<{
  txn: Scalars['String']['input'];
}>;


export type UpdatePoolFromTxnMutation = { __typename: 'Mutation', updatePoolFromTxn: (
    { __typename: 'Pool' }
    & { ' $fragmentRefs'?: { 'PoolFragment': PoolFragment } }
  ) };

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

export const TokenFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Token"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Token"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"uri"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"supply"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"latestPurchasePrice"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<TokenFragment, unknown>;
export const PoolFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pool"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Token"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Token"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Token"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"uri"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"supply"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"latestPurchasePrice"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<PoolFragment, unknown>;
export const CreatePoolFromTxnDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createPoolFromTxn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"txn"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPoolFromTxn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"txn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"txn"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pool"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Token"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Token"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"uri"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"supply"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"latestPurchasePrice"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pool"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Token"}}]}}]}}]} as unknown as DocumentNode<CreatePoolFromTxnMutation, CreatePoolFromTxnMutationVariables>;
export const UpdatePoolFromTxnDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updatePoolFromTxn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"txn"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePoolFromTxn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"txn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"txn"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pool"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Token"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Token"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"uri"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"supply"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"latestPurchasePrice"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pool"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Token"}}]}}]}}]} as unknown as DocumentNode<UpdatePoolFromTxnMutation, UpdatePoolFromTxnMutationVariables>;
export const GetPoolsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPools"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPools"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pool"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Token"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Token"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"uri"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"supply"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"latestPurchasePrice"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pool"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Token"}}]}}]}}]} as unknown as DocumentNode<GetPoolsQuery, GetPoolsQueryVariables>;
export const GetTokenMetaPresignedUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTokenMetaPresignedUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mintAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assetType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FileUploadType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTokenMetaPresignedUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mintAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mintAddress"}}},{"kind":"Argument","name":{"kind":"Name","value":"fileType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileType"}}},{"kind":"Argument","name":{"kind":"Name","value":"assetType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assetType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<GetTokenMetaPresignedUrlQuery, GetTokenMetaPresignedUrlQueryVariables>;