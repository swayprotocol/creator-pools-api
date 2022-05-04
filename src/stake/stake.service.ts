import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stake } from './entities/stake.entity';
import { CreateStakeDto } from './dto/create-stake.dto';

@Injectable()
export class StakeService {
  constructor(@InjectModel('Stake') private readonly stakeModel: Model<Stake>){}

  async create(createStakeDto: CreateStakeDto): Promise<Stake> {
    const stake = new this.stakeModel({
      plan: createStakeDto.planId,
      pool: createStakeDto.poolId,
      stakedAt: new Date(),
      stakedUntil: new Date(), // TODO Find plan by id and get locket monts
      amount: createStakeDto.amount,
      wallet: createStakeDto.wallet
    });
    return await stake.save();
  }

  async findAll(): Promise<Stake[]> {
    const stakes = await this.stakeModel.find();
    return stakes;
  }

  async findOne(id: string): Promise<Stake> {
    const stake = await this.stakeModel.findOne({ _id: id })
    return stake;
  }

  async update(id: string, updateStakeDto: CreateStakeDto): Promise<Stake> {
    const stake = await this.stakeModel.findOneAndUpdate(
      { _id: id },
      updateStakeDto,
      { new: true }
    );
    return stake;
  }

  async remove(id: string): Promise<Stake> {
    const stake = await this.stakeModel.findOneAndDelete({ _id: id })
    return stake;
  }
}
