import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClaimDto } from './dto/create-claim.dto';
import { Claim } from './entities/claim.entity';


@Injectable()
export class ClaimService {

  constructor(
    @InjectModel('Claim') private readonly claimModel: Model<Claim>,
  ) {}

  async create(createClaimDto: CreateClaimDto): Promise<Claim> {
    const claim = new this.claimModel(createClaimDto);
    await claim.save();
    return claim;
  }

  async findAllAfter(after: Date): Promise<Claim[]> {
    const claims = await this.claimModel.find({ claimDate: { $gte: after } });
    return claims;
  }

  async findAll(): Promise<Claim[]> {
    const claims = await this.claimModel.find();
    return claims;
  }

  async findOne(id: string): Promise<Claim> {
    const claim = await this.claimModel.findOne({ _id: id });
    return claim;
  }

  async findAndCollect(wallet: string, poolId: string): Promise<Claim[]> {
    const claims = await this.claimModel.find({
      wallet: wallet.toLowerCase(),
      pool: poolId,
      unstaked: false,
    });

    const claimIDs = claims.map(claim => {return claim._id});
    await this.claimModel.updateMany({
      _id: { $in: claimIDs}
    },{
      unstaked: true,
    })

    return claims;
  }

  async totalClaimed(): Promise<number> {
    const total = await this.claimModel.aggregate([
      {
        '$group': {
          _id: null,
          'totalAmount': {
            '$sum': '$amount'
          }
        }
      }, {
        '$project': {
          '_id': 0,
          'totalAmount': '$totalAmount'
        }
      }
    ])

    if (total.length > 0) return total[0].totalAmount
    return 0
  }
}
