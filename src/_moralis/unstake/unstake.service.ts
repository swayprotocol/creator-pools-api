import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Unstake } from './entities/unstake.entity';

@Injectable()
export class MoralisUnstakeService {

  constructor(
    @InjectModel('Unstake') private readonly unstakeModel: Model<Unstake>,
  ){}

  async findAll(): Promise<Unstake[]> {
    const unstakes = await this.unstakeModel.find()
    return unstakes
  }

  async findOne(transactionHash: string): Promise<Unstake> {
    const unstake = await this.unstakeModel.findOne({ transaction_hash: transactionHash })
    return unstake
  }

  async findMissing(transactionHashes: string[]): Promise<Unstake[]> {
    const unstakes = await this.unstakeModel.find({
      transaction_hash: { $nin: transactionHashes }
    })
    return unstakes
  }

}
