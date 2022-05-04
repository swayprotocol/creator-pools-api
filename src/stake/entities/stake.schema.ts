import mongoose from 'mongoose';
import { Stake } from './stake.entity';

export const stakeSchema = new mongoose.Schema<Stake>({
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
  },
  pool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pool',
  },
  stakedAt: {
    type: Date,
  },
  stakedUntil: {
    type: Date,
  },
  amount: {
    type: Number,
  },
  wallet: {
    type: String,
  }
})