import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Claim } from '../claim/entities/claim.entity';
import { CreateUnstakeDto } from './dto/create-unstake.dto';
import { Unstake } from './entities/unstake.entity';

@Injectable()
export class UnstakeService {
  constructor(
    @InjectModel('Unstake') private readonly unstakeModel: Model<Unstake>,
  ){}
  async create(createUnstakeDto: CreateUnstakeDto): Promise<Unstake> {
    const unstake = new this.unstakeModel(createUnstakeDto);
    return await unstake.save();
  }

  async findAll(): Promise<Unstake[]> {
    const unstakes = await this.unstakeModel.find();
    return unstakes;
  }

  async findOne(id: string): Promise<Unstake> {
    const unstake = await this.unstakeModel.findOne({ _id: id })
    return unstake;
  }

  async findByHash(hash: string): Promise<Unstake> {
    const unstake = await this.unstakeModel.findOne({ hash });
    return unstake;
  }

  async pushClaim(id: string, claim: Claim): Promise<Unstake> {
    const unstake = await this.unstakeModel.findOneAndUpdate({
        _id: id
      },{
        $push: { claims: claim }
      },
      { new: true }
    )
    return unstake;
  }
}
