import { gql } from '@apollo/client';
import { POOL, COMMENT, USER, TRADE } from './fragments';

export const CREATE_POOL = gql`
  mutation createPool($transaction: String!) {
    createPool(transaction: $transaction) {
      ...Pool
    }
  }
  ${POOL}
`;

export const RECORD_TRADE = gql`
  mutation recordTrade($transaction: String!) {
    recordTrade(transaction: $transaction) {
      ...Trade
    }
  }
  ${TRADE}
`;

export const ADD_COMMENT = gql`
  mutation addComment($ticker: String!, $text: String!, $creator: String!) {
    addComment(ticker: $ticker, text: $text, creator: $creator) {
      ...Comment
    }
  }
  ${COMMENT}
`;

export const AUTHENTICATE = gql`
  mutation authenticate {
    authenticate {
      ...User
    }
  }
  ${USER}
`;
