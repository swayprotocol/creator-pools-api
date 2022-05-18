import mongoose from 'mongoose';
import { TopStakedPools } from 'src/stake/dto/topStakedPools.dto';

export const aggregatedPoolSchema = new mongoose.Schema<TopStakedPools>({
  pool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pool',
  },
  totalAmount: {
    type: Number,
  }
});