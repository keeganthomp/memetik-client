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
  query getTokenMetaPresignedUrl($mintAddress: String!, $fileType: String!, $assetType: FileUploadType!) {
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
