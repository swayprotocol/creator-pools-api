import mongoose from 'mongoose';
import { Pool } from './pool.entity';

export const poolSchema = new mongoose.Schema<Pool>({
  creator: {
    type: String,
  },
  startTime: {
    type: Date,
    default: new Date(),
  },
});
