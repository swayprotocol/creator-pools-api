import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contract, utils } from 'ethers';
import moment from 'moment';
import { Stake } from './entities/stake.entity';
import { CreateStakeDto } from './dto/create-stake.dto';
import { PlanService } from '../plan/plan.service';
import { TopStakedPools } from './dto/topStakedPools.dto';
import { Pool } from 'src/pool/entities/pool.entity';
import { StakingContract } from 'src/shared/StakingContract';
import { CreatePoolDto } from 'src/pool/dto/create-pool.dto';
import { PoolService } from 'src/pool/pool.service';

@Injectable()
export class StakeService {
  constructor(
    @InjectModel('Stake') private readonly stakeModel: Model<Stake>,
    @InjectModel('AggregatedPool') private readonly aggregatedPool: Model<TopStakedPools>,
    private readonly contract: StakingContract,
    private readonly planService: PlanService,
    private readonly poolService: PoolService,
  ){
    this.initialListeners(this.contract.getStakingContract())
  }

  async create(createStakeDto: CreateStakeDto): Promise<Stake> {
    const plan = await this.planService.findOne(createStakeDto.plan);
    const stake = new this.stakeModel({
      plan: createStakeDto.plan,
      pool: createStakeDto.pool,
      stakedAt: new Date(),
      stakedUntil: moment().add(plan.lockMonths,'months').toDate(),
      amount: createStakeDto.amount,
      wallet: createStakeDto.wallet,
      hash: createStakeDto.hash,
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
    // const populated = await this.stakeModel.populate(pools, { path: 'pool', model: 'Pool' })
    // return populated
  }

  async latestStakes(latest: number): Promise<Stake[]> {
    return await this.stakeModel.find({ collected: false }).sort({stakedAt: -1}).limit(latest);
  }

  async highestPositions(latest: number): Promise<Stake[]> {
    return await this.stakeModel.find({ collected: false }).sort({amount: -1}).limit(latest);
  }

  async initialListeners(contract: Promise<Contract>) {
    const stakingContract = await contract;

    stakingContract.on('Staked', async (poolHandle, sender, amount, planIndex, receipt) => {
      console.log('Staked')
      let pool = await this.poolService.findOneByHandle(poolHandle);
      let plan = await this.planService.findOneByBlockchainIndex(planIndex);
      const stakedAmount = parseFloat(utils.formatEther(amount));

      // CREATE POOL
      if (!pool) {
        console.log(`Pool created: ${poolHandle}`)
        const poolDto: CreatePoolDto = {
          creator: poolHandle,
          startTime: new Date(),
          hash: receipt.transactionHash
        }
        pool = await this.poolService.create(poolDto);
      }

      const stakeDto: CreateStakeDto = {
        plan: plan._id,
        pool: pool._id,
        amount: stakedAmount,
        stakedAt: new Date(),
        stakedUntil: moment().add(plan.lockMonths, 'months').toDate(),
        wallet: sender,
        hash: receipt.transactionHash,
      };

      await this.create(stakeDto);
    })
  }
}
