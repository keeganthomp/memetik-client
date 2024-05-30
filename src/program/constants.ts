import * as anchor from '@coral-xyz/anchor';

const METAPLEX_PROGRAM_ADDRESS = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';

export const programId = new anchor.web3.PublicKey(import.meta.env.VITE_PROGRAM_ID);

export const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(METAPLEX_PROGRAM_ADDRESS);
