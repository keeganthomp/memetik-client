import { gql } from '@apollo/client';
import { POOL, TOKEN, USER, TRADE, CANDLE_STICK } from './fragments';

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
  query getPool($ticker: String!) {
    getPool(ticker: $ticker) {
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
  query getToken($ticker: String!) {
    getToken(ticker: $ticker) {
      ...Token
    }
  }
  ${TOKEN}
`;

export const GET_PROFILE = gql`
  query getProfile {
    getProfile {
      ...User
    }
  }
  ${USER}
`;

export const GET_TRADES = gql`
  query getTrades($ticker: String!) {
    getTrades(ticker: $ticker) {
      trades {
        ...Trade
      }
      candleSticks {
        ONE_SECOND {
          ...CandleStick
        }
        THIRTY_SECONDS {
          ...CandleStick
        }
        ONE_MINUTE {
          ...CandleStick
        }
        FIVE_MINUTES {
          ...CandleStick
        }
        FIFTEEN_MINUTES {
          ...CandleStick
        }
        THIRTY_MINUTES {
          ...CandleStick
        }
        ONE_HOUR {
          ...CandleStick
        }
        FOUR_HOURS {
          ...CandleStick
        }
        ONE_DAY {
          ...CandleStick
        }
        ONE_WEEK {
          ...CandleStick
        }
      }
    }
  }
  ${TRADE}
  ${CANDLE_STICK}
`;
