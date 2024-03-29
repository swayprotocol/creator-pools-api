import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePoolDto } from './dto/create-pool.dto';
import { Model } from 'mongoose';
import { Pool } from './entities/pool.entity';

@Injectable()
export class PoolService {

  constructor(
    @InjectModel(Pool.name) private readonly poolModel: Model<Pool>,
  ){}

  async create(createPoolDto: CreatePoolDto): Promise<Pool> {
    const pool = new this.poolModel(createPoolDto);
    return await pool.save();
  }

  async findAllAfter(date: Date): Promise<Pool[]> {
    const pools = await this.poolModel.find({ startTime: { $gte: date } })
    return pools
  }

  async findAll(): Promise<Pool[]> {
    const pools = await this.poolModel.find();
    return pools;
  }

  async findOne(id: string): Promise<Pool> {
    const pool = await this.poolModel.findOne({_id: id});
    return pool;
  }

  async findByHash(hash: string): Promise<Pool> {
    const pool = await this.poolModel.findOne({ hash })
    return pool;
  }

  async findOneByHandle(handle: string): Promise<Pool> {
    const plan = await this.poolModel.findOne({ creator: {$eq: handle}});
    return plan;
  }

  async updateByHandle(handle: string, updatePoolDto: CreatePoolDto): Promise<Pool> {
    const pool = await this.poolModel.findOneAndUpdate(
      { creator: handle },
      updatePoolDto,
      { new: true }
    );
    return pool;
  }
}
