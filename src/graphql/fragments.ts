import { gql } from '@apollo/client';

export const TOKEN = gql`
  fragment Token on Token {
    id
    createdAt
    updatedAt
    name
    symbol
    uri
    decimals
    supply
    address
    latestPurchasePrice
    image
    description
    marketCap
  }
`;

export const COMMENT = gql`
  fragment Comment on Comment {
    id
    createdAt
    updatedAt
    poolId
    text
    creator
  }
`;

export const POOL = gql`
  fragment Pool on Pool {
    id
    createdAt
    updatedAt
    creator
    address
    tokenAddress
    token {
      ...Token
    }
    comments {
      ...Comment
    }
  }
  ${TOKEN}
  ${COMMENT}
`;
