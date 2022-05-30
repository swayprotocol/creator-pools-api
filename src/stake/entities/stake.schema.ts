import moment from 'moment';
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
  },
  collected: {
    type: Boolean,
    default: false,
  },
  hash: {
    type: String,
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

stakeSchema.virtual('farmed').get(function() {
  const days = Math.abs(moment(this.stakedAt).diff(moment(),'days'))
  return (this.amount * (this.plan?.apy/100) * (days/365))
})