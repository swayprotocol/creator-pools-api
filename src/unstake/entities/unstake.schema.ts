import mongoose from 'mongoose';
import { Unstake } from './unstake.entity';

export const unstakeSchema = new mongoose.Schema<Unstake>({
  wallet: {
    type: String,
  },
  hash: {
    type: String,
  },
  unclaimDate: {
    type: Date,
  },
  pool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pool'
  },
  amount: {
    type: Number,
  }
})