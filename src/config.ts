import dotenv from 'dotenv';

dotenv.config();

export const { 
  MONGO_URL,
  MORALIS_URL,
  MORALIS_APP_ID,
  MORALIS_MASTER_KEY,
  MORALIS_SERVER_URL,
  WEB3_HTTP_PROVIDER,
  STAKING_CONTRACT_ADDRESS,
  SWAY_TOKEN_ADDRESS,
  STAKING_ABI
} = process.env;
