import { gql } from '@apollo/client';
import { POOL } from './fragments';

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
  query getPool($address: String, $id: Int) {
    getPool(address: $address, id: $id) {
      ...Pool
    }
  }
  ${POOL}
`;

export const GET_POOL_BY_TOKEN = gql`
  query getPoolByToken($contractAddress: String!) {
    getPoolByToken(contractAddress: $contractAddress) {
      ...Pool
    }
  }
  ${POOL}
`;
