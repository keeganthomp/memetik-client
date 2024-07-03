import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getCachedAuthToken, getCachedOauthToken } from './localStorage';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL as string,
});

const authLink = setContext((_, { headers }) => {
  const cachedDidToken = getCachedAuthToken();
  const cachedOauthToken = getCachedOauthToken();
  return {
    headers: {
      ...headers,
      authorization: cachedDidToken,
      'oauth-token': cachedOauthToken,
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({}),
});

export default apolloClient;
