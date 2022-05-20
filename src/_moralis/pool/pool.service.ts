import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { Pool } from './entities/pool.entity';

@Injectable()
export class PoolService {

  constructor(
    @InjectModel('Pool') private readonly poolModel: Model<Pool>,
  ){}

  create(createPoolDto: CreatePoolDto) {
    return 'This action adds a new pool';
  }

  async findAll(): Promise<Pool[]> {

    console.log(this.poolModel)
    const pools = await this.poolModel.find();
    return pools;
  }

  findOne(id: number) {
    return `This action returns a #${id} pool`;
  }

  update(id: number, updatePoolDto: UpdatePoolDto) {
    return `This action updates a #${id} pool`;
  }

  remove(id: number) {
    return `This action removes a #${id} pool`;
  }
}
