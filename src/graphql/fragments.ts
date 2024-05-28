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
  }
`;

export const POOL = gql`
  fragment Pool on Pool {
    id
    createdAt
    updatedAt
    creator
    tokenId
    address
    token {
      ...Token
    }
  }
  ${TOKEN}
`;
