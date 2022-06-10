import moment from 'moment';
import mongoose from 'mongoose';
import { getStakingAPY } from '../../helpers/getStakingAPY';
import { CONFIG } from '../../config';
import { Stake } from './stake.entity';
const APY: number = getStakingAPY(CONFIG)

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
  const hours = Math.abs(moment(this.collected ? this.collectedDate : this.stakedAt).diff(moment(),'hours'))
  return (this.amount * (APY/100) * (hours/8760))
})
