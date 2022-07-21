import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pool } from './entities/pool.entity';

@Injectable()
export class MoralisPoolService {

  constructor(
    @InjectModel('Pool', 'primary_connection') private readonly poolModel: Model<Pool>,
  ){}

  async findAll(): Promise<Pool[]> {
    const pools = await this.poolModel.find();
    return pools;
  }

  async findOne(hash: string): Promise<Pool> {
    const pool = await this.poolModel.findOne({ transaction_hash: hash })
    return pool
  }

  async findMissing(transactionHashes: string[], after: Date): Promise<Pool[]> {
    const pools = await this.poolModel.find({
      transaction_hash: { $nin: transactionHashes },
      block_timestamp: { $gte: after }
    })
    return pools
  }
}
