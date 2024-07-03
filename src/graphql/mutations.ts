import { gql } from '@apollo/client';
import { POOL, COMMENT, USER } from './fragments';

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
      ...Pool
    }
  }
  ${POOL}
`;

export const ADD_COMMENT = gql`
  mutation addComment($poolId: Int!, $text: String!, $creator: String!) {
    addComment(poolId: $poolId, text: $text, creator: $creator) {
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
