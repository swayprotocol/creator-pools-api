import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Stake } from './entities/stake.entity';

@Injectable()
export class MoralisStakeService {

  constructor(
    @InjectModel('Stake') private readonly stakeModel: Model<Stake>,
  ){}

  async findAll(): Promise<Stake[]> {
    const stakes = await this.stakeModel.find();
    return stakes;
  }

  async findOne(hash: string): Promise<Stake> {
    const stake = await this.stakeModel.findOne({ transaction_hash: hash });
    return stake;
  }

  async findMissing(transactionHashes: string[]): Promise<Stake[]> {
    const stakes = await this.stakeModel.find({
      transaction_hash: { $nin: transactionHashes }
    })
    return stakes
  }

 
}
