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
    "\n  fragment Token on Token {\n    id\n    createdAt\n    updatedAt\n    name\n    symbol\n    uri\n    decimals\n    supply\n    address\n    latestPurchasePrice\n    image\n    description\n  }\n": types.TokenFragmentDoc,
    "\n  fragment Pool on Pool {\n    id\n    createdAt\n    updatedAt\n    creator\n    tokenId\n    address\n    token {\n      ...Token\n    }\n  }\n  \n": types.PoolFragmentDoc,
    "\n  mutation createPoolFromTxn($txn: String!) {\n    createPoolFromTxn(txn: $txn) {\n      ...Pool\n    }\n  }\n  \n": types.CreatePoolFromTxnDocument,
    "\n  mutation updatePoolFromTxn($txn: String!) {\n    updatePoolFromTxn(txn: $txn) {\n      ...Pool\n    }\n  }\n  \n": types.UpdatePoolFromTxnDocument,
    "\n  query getPools {\n    getPools {\n      ...Pool\n    }\n  }\n  \n": types.GetPoolsDocument,
    "\n  query getTokenMetaPresignedUrl($mintAddress: String!, $fileType: String!, $assetType: FileUploadType!) {\n    getTokenMetaPresignedUrl(\n      mintAddress: $mintAddress\n      fileType: $fileType\n      assetType: $assetType\n    ) {\n      key\n      url\n    }\n  }\n": types.GetTokenMetaPresignedUrlDocument,
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
export function gql(source: "\n  fragment Token on Token {\n    id\n    createdAt\n    updatedAt\n    name\n    symbol\n    uri\n    decimals\n    supply\n    address\n    latestPurchasePrice\n    image\n    description\n  }\n"): (typeof documents)["\n  fragment Token on Token {\n    id\n    createdAt\n    updatedAt\n    name\n    symbol\n    uri\n    decimals\n    supply\n    address\n    latestPurchasePrice\n    image\n    description\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment Pool on Pool {\n    id\n    createdAt\n    updatedAt\n    creator\n    tokenId\n    address\n    token {\n      ...Token\n    }\n  }\n  \n"): (typeof documents)["\n  fragment Pool on Pool {\n    id\n    createdAt\n    updatedAt\n    creator\n    tokenId\n    address\n    token {\n      ...Token\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createPoolFromTxn($txn: String!) {\n    createPoolFromTxn(txn: $txn) {\n      ...Pool\n    }\n  }\n  \n"): (typeof documents)["\n  mutation createPoolFromTxn($txn: String!) {\n    createPoolFromTxn(txn: $txn) {\n      ...Pool\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation updatePoolFromTxn($txn: String!) {\n    updatePoolFromTxn(txn: $txn) {\n      ...Pool\n    }\n  }\n  \n"): (typeof documents)["\n  mutation updatePoolFromTxn($txn: String!) {\n    updatePoolFromTxn(txn: $txn) {\n      ...Pool\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getPools {\n    getPools {\n      ...Pool\n    }\n  }\n  \n"): (typeof documents)["\n  query getPools {\n    getPools {\n      ...Pool\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getTokenMetaPresignedUrl($mintAddress: String!, $fileType: String!, $assetType: FileUploadType!) {\n    getTokenMetaPresignedUrl(\n      mintAddress: $mintAddress\n      fileType: $fileType\n      assetType: $assetType\n    ) {\n      key\n      url\n    }\n  }\n"): (typeof documents)["\n  query getTokenMetaPresignedUrl($mintAddress: String!, $fileType: String!, $assetType: FileUploadType!) {\n    getTokenMetaPresignedUrl(\n      mintAddress: $mintAddress\n      fileType: $fileType\n      assetType: $assetType\n    ) {\n      key\n      url\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;