import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import moment from 'moment';
import { Stake } from './entities/stake.entity';
import { CreateStakeDto } from './dto/create-stake.dto';
import { PlanService } from '../plan/plan.service';
import { TopStakedPools } from './dto/topStakedPools.dto';
import { Pool } from '../pool/entities/pool.entity';
import { PoolService } from '../pool/pool.service';
import { ActiveStakesPool } from './entities/activeStakesPool';

@Injectable()
export class StakeService {
  constructor(
    @InjectModel('Stake') private readonly stakeModel: Model<Stake>,
    @InjectModel('AggregatedPool') private readonly aggregatedPool: Model<TopStakedPools>,
    private readonly planService: PlanService,
    private readonly poolService: PoolService,
  ){}

  async create(createStakeDto: CreateStakeDto): Promise<Stake> {
    const plan = await this.planService.findOne(createStakeDto.plan);
    const stake = new this.stakeModel({
      plan: createStakeDto.plan,
      pool: createStakeDto.pool,
      stakedAt: createStakeDto.stakedAt,
      stakedUntil: plan ? moment(createStakeDto.stakedAt).add(plan.lockMonths,'M').toDate() : null,
      amount: createStakeDto.amount,
      wallet: createStakeDto.wallet,
      hash: createStakeDto.hash,
    });
    return await stake.save();
  }

  async findAllAfter(after: Date): Promise<Stake[]> {
    const stakes = await this.stakeModel.find({ stakedAt: { $gte: after } });
    return stakes;
  }

  async findAll(): Promise<Stake[]> {
    const stakes = await this.stakeModel.find();
    return stakes;
  }

  async findOne(id: string): Promise<Stake> {
    const stake = await this.stakeModel.findOne({ _id: id })
    return stake;
  }

  async findUncollected(wallet: string, pool: Pool): Promise<Stake[]> {
    const stakes = await this.stakeModel.find({
      wallet,
      pool,
      collected: false,
    })
    return stakes;
  }

  async findStakedUntil(wallet: string, pool: Pool): Promise<Stake[]> {
    const stakes = await this.stakeModel.find({
      wallet,
      pool,
      stakedUntil: { $gt: new Date() }
    })
    return stakes;
  }

  async collect(ids: string[]) {
    await this.stakeModel.updateMany({
      _id: { $in: ids }
    },{
      collected: true
    });
  }

  async chanelDistribution() {
    const totalStaked = await this.totalCurrentlyStaked()
    const stakes: Stake[] = await this.stakeModel.find({
      collected: false,
    }).populate('pool')

    const distribution = {}

    for (const stake of stakes) {
      const poolSplit = stake.pool.creator.split('-')
      if (poolSplit.length == 2) {
        const chanel = poolSplit[0]
        if (distribution[chanel]) distribution[chanel] += stake.amount
        else distribution[chanel] = stake.amount
      }
    }

    const distributionArray = []
    for (const chanel in distribution) {
      distributionArray.push({chanel, distribution: (distribution[chanel]/totalStaked). toFixed(3)})
    }

    return distributionArray
  }

  async activeStakes(wallet: string): Promise<Stake[]> {
    const currentDate = new Date()
    const stakes = this.stakeModel.find({
      wallet,
      stakedAt: {$lte: currentDate},
      collected: false,
    }).populate('plan').populate('pool')
    return stakes
  }

  async activeStakesPool(poolName: string, wallet: string): Promise<ActiveStakesPool> {
    const pool = await this.poolService.findOneByHandle(poolName)

    let stakes: Stake[] = await this.stakeModel.find(
    wallet ? {
      wallet,
      pool,
      collected: false
    }:{
      pool,
      collected: false
    }).populate('plan')

    let members = []
    let averageAPY = 0
    let totalAmount = 0
    let totalFarmed = 0

    stakes.map(stake => {
      if(!members.includes(stake.wallet)) members.push(stake.wallet)
      totalAmount += stake.amount
      averageAPY += stake.plan?.apy
      totalFarmed += stake.farmed
    })
    averageAPY = averageAPY / stakes.length

    return {
      social: poolName.split('-')[0],
      poolHandle: poolName.split('-')[1],
      totalAmount,
      totalFarmed,
      averageAPY,
      members,
      numberOfStakes: stakes.length,
      pool,
      stakes,
    }
  }

  async topCreatorPools(): Promise<TopStakedPools[]> {
    const pools: TopStakedPools[] = await this.stakeModel.aggregate([
      {
        '$match': {
          'collected': false
        }
      },
      {
        '$group': {
          '_id': '$pool', 
          'totalAmount': {
            '$sum': '$amount'
          }
        }
      }, {
        '$sort': {
          'totalAmount': -1
        }
      }, {
        '$project': {
          '_id': 0, 
          'pool': '$_id', 
          'totalAmount': '$totalAmount'
        }
      }
    ])
    const populated: TopStakedPools[] = await this.aggregatedPool.populate(pools, { path: 'pool', model: 'Pool' });
    return populated;
  }

  async latestStakes(latest: number): Promise<Stake[]> {
    return await this.stakeModel
      .find({ collected: false })
      .sort({stakedAt: -1})
      .limit(latest)
      .populate('plan')
      .populate('pool');
  }

  async highestPositions(latest: number): Promise<Stake[]> {
    return await this.stakeModel
      .find({ collected: false })
      .sort({amount: -1})
      .limit(latest)
      .populate('plan')
      .populate('pool');
  }

  async totalCurrentlyStaked(): Promise<number> {
    const total = await this.stakeModel.aggregate([
      {
        '$match': {
          'collected': false
        }
      },
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

  async totalStaked(): Promise<number> {
    const total = await this.stakeModel.aggregate([
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
