import mongoose from 'mongoose';
import { Plan } from './plan.entity';

export const planSchema = new mongoose.Schema<Plan>({
  blockchainIndex: {
    type: Number,
  },
  apy: {
    type: Number,
  },
  availableUntil: {
    type: Date,
  },
  lockMonths: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
