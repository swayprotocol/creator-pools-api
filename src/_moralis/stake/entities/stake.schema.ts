import mongoose from 'mongoose';
import { Stake } from './stake.entity';

export const stakeSchema = new mongoose.Schema<Stake>({
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
  planId: Number,
  poolHandle: String,
  sender: String,
  transaction_index: Number,
});