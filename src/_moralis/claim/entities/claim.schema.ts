import mongoose from 'mongoose';
import { Claim } from './claim.entity';

export const claimSchema = new mongoose.Schema<Claim>({
  log_index: Number,
  transaction_hash: String,
  _created_at: Date,
  _updated_at: Date,
  address: String,
  swayAmount: String,
  swayAmount_decimal: Number,
  block_hash: Number,
  block_number: Number,
  block_timestamp: Date,
  confirmed: Boolean,
  poolHandle: String,
  recipient: String,
  transaction_index: Number,
})