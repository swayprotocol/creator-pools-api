import moment from 'moment';
import mongoose from 'mongoose';
import { APY } from '../../config';
import { Stake } from './stake.entity';

export const stakeSchema = new mongoose.Schema<Stake>({
  pool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pool',
  },
  stakedAt: {
    type: Date,
  },
  token: {
    type: String,
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
  collectedDate: {
    type: Date,
    default: null
  },
  hash: {
    type: String,
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

stakeSchema.virtual('farmed').get(function() {
  const days = Math.abs(moment(this.collected ? this.collectedDate : this.stakedAt).diff(moment(),'days'))
  return (this.amount * (parseFloat(APY)/100) * (days/365))
})
