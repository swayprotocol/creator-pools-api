import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Stake } from './entities/stake.entity';

@Injectable()
export class MoralisStakeService {

  constructor(
    @InjectModel('Stake', 'primary_connection') private readonly stakeModel: Model<Stake>,
  ){}

  async findAll(): Promise<Stake[]> {
    const stakes = await this.stakeModel.find();
    return stakes;
  }

  async findOne(transactionHash: string): Promise<Stake> {
    const stake = await this.stakeModel.findOne({ transaction_hash: transactionHash });
    return stake;
  }

  async findMissing(transactionHashes: string[], after: Date): Promise<Stake[]> {
    const stakes = await this.stakeModel.find({
      transaction_hash: { $nin: transactionHashes },
      block_timestamp: { $gte: after }
    })
    return stakes
  }


}
