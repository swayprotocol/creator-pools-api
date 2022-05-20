import mongoose from 'mongoose';
import { Pool } from './pool.entity';

export const poolSchema = new mongoose.Schema<Pool>({
  log_index: Number,
  transaction_hash: String,
  _created_at: Date,
  _updated_at: Date,
  address: String,
  block_hash: String,
  block_number: Number,
  block_timestamp: Date,
  confirmed: Boolean,
  poolHandle: String,
  sender: String,
  transaction_index: Number,
});