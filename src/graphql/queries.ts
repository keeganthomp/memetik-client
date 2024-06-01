import { gql } from '@apollo/client';
import { POOL, TOKEN } from './fragments';

export const GET_POOLS = gql`
  query getPools {
    getPools {
      ...Pool
    }
  }
  ${POOL}
`;

export const GET_TOKEN_META_PRESIGNED_URL = gql`
  query getTokenMetaPresignedUrl(
    $mintAddress: String!
    $fileType: String!
    $assetType: FileUploadType!
  ) {
    getTokenMetaPresignedUrl(
      mintAddress: $mintAddress
      fileType: $fileType
      assetType: $assetType
    ) {
      key
      url
    }
  }
`;

export const GET_POOL = gql`
  query getPool($address: String, $id: Int, $contractAddress: String) {
    getPool(address: $address, id: $id, contractAddress: $contractAddress) {
      ...Pool
      token {
        ...Token
        holders
      }
    }
  }
  ${POOL}
  ${TOKEN}
`;

export const GET_TOKEN = gql`
  query getToken($contractAddress: String!) {
    getToken(contractAddress: $contractAddress) {
      ...Token
    }
  }
  ${TOKEN}
`;
