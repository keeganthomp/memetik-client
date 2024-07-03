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
    contractAddress
    latestPurchasePrice
    image
    description
  }
`;

export const COMMENT = gql`
  fragment Comment on Comment {
    id
    createdAt
    updatedAt
    text
    poolId
    creator
  }
`;

export const POOL = gql`
  fragment Pool on Pool {
    id
    createdAt
    updatedAt
    creator
    contractAddress
    maturityTime
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

export const USER = gql`
  fragment User on User {
    id
    createdAt
    updatedAt
    name
    email
    username
    bio
    wallet
    profilePicture
    twitterUserId
    twitterHandle
  }
`;

export const TRADE = gql`
  fragment Trade on Trade {
    id
    symbol
    timestamp
    price
    quantity
    trader
    type
  }
`;

export const CANDLE_STICK = gql`
  fragment CandleStick on CandleStick {
    id
    symbol
    timestamp
    open
    close
    high
    low
    volume
  }
`;
