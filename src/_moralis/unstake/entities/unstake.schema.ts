import mongoose from 'mongoose';
import { Unstake } from './unstake.entity';

export const unstakeSchema = new mongoose.Schema<Unstake>({
  log_index: Number,
  transaction_hash: String,
  _created_at: Date,
  _updated_at: Date,
  address: String,
  amount: String,
  amount_decimal: Number,
  block_hash: String,
  block_number: Number,
  block_timestamp: Date,
  confirmed: Boolean,
  poolHandle: String,
  recipient: String,
  transaction_index: Number
})