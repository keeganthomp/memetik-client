import { gql } from '@apollo/client';
import { POOL } from './fragments';

export const CREATE_POOL_FROM_TXN = gql`
  mutation createPoolFromTxn($txn: String!) {
    createPoolFromTxn(txn: $txn) {
      ...Pool
    }
  }
  ${POOL}
`;

export const UPDATE_POOL_FROM_TXN = gql`
  mutation updatePoolFromTxn($txn: String!) {
    updatePoolFromTxn(txn: $txn) {
      ...Pool
    }
  }
  ${POOL}
`;
