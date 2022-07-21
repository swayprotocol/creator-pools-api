import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Claim } from './entities/claim.entity';

@Injectable()
export class MoralisClaimService {

  constructor(
    @InjectModel('Reward', 'primary_connection') private readonly claimModel: Model<Claim>,
  ){}

  async findAll(): Promise<Claim[]> {
    const claims = await this.claimModel.find()
    return claims
  }

  async findOne(transactionHash: string): Promise<Claim> {
    const claim = await this.claimModel.findOne({ transaction_hash: transactionHash })
    return claim
  }

  async findMissing(transactionHashes: string[], after): Promise<Claim[]> {
    const claims = await this.claimModel.find({
      transaction_hash: { $nin: transactionHashes },
      block_timestamp: { $gte: after }
    })
    return claims
  }

}
