import mongoose from 'mongoose';
import { Pool } from './pool.entity';

export const poolSchema = new mongoose.Schema<Pool>({
  creator: {
    type: String,
  },
  startTime: {
    type: Number,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  numberOfStakes: {
    type: Number,
    default: 0,
  },
});
