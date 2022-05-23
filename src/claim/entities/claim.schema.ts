import mongoose from 'mongoose';
import { Claim } from './claim.entity';

export const claimSchema = new mongoose.Schema<Claim>({
  wallet: {
    type: String,
  },
  pool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pool',
  },
  amount: {
    type: Number,
  },
  claimDate: {
    type: Date,
  },
  hash: {
    type: String,
  },
  unstaked: {
    type: Boolean,
    default: false,
  },
})