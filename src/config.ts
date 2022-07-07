import dotenv from 'dotenv';

dotenv.config();

export const { 
  MONGO_URL,
  MORALIS_URL,
  MORALIS_APP_ID,
  MORALIS_MASTER_KEY,
  MORALIS_SERVER_URL,
  CONFIG
} = process.env;
