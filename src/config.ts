import dotenv from 'dotenv';

dotenv.config();

export const { 
  MONGO_URL,
  WEB3_HTTP_PROVIDER,
  STAKING_CONTRACT_ADDRESS,
  SWAY_TOKEN_ADDRESS
} = process.env;
