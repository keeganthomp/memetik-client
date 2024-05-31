import 'dotenv/config';
import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.VITE_GRAPHQL_URL as string,
  documents: [
    'src/graphql/queries.ts',
    'src/graphql/mutations.ts',
    'src/graphql/fragments.ts',
  ],
  emitLegacyCommonJSImports: false,
  generates: {
    './src/graphql/__generated__/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
      config: {
        nonOptionalTypename: true,
        flattenGeneratedTypes: true,
        flattenGeneratedTypesIncludeFragments: true,
        scalars: {
          JSON: 'string',
          Date: 'string',
          BigInt: 'string',
          UnixTimestamp: 'string',
        },
      },
    },
  },
};

export default config;
