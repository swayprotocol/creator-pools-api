import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { Pool } from './entities/pool.entity';

@Injectable()
export class MoralisPoolService {

  constructor(
    @InjectModel('Pool') private readonly poolModel: Model<Pool>,
  ){}

  async findAll(): Promise<Pool[]> {
    const pools = await this.poolModel.find();
    return pools;
  }

  async findOne(hash: string): Promise<Pool> {
    const pool = await this.poolModel.findOne({ transaction_hash: hash })
    return pool
  }

  async findMissing(transactionHashes: string[]): Promise<Pool[]> {
    const pools = await this.poolModel.find({
      transaction_hash: { $nin: transactionHashes }
    })
    return pools
  }
}
