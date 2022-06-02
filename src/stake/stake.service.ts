import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import moment from 'moment';
import { Stake } from './entities/stake.entity';
import { CreateStakeDto } from './dto/create-stake.dto';
import { TopStakedPools } from './dto/topStakedPools.dto';
import { Pool } from '../pool/entities/pool.entity';
import { PoolService } from '../pool/pool.service';
import { ActiveStakesPool, TokenDetails } from './entities/activeStakesPool';
import { getTokenPrice } from '../helpers/getTokenPrice';
import { getTokenConfig } from '../helpers/getTokenConfig';
import { APY, CONFIG } from '../config';
@Injectable()
export class StakeService {
  constructor(
    @InjectModel('Stake') private readonly stakeModel: Model<Stake>,
    @InjectModel('AggregatedPool') private readonly aggregatedPool: Model<TopStakedPools>,
    private readonly poolService: PoolService,
  ){}

  async create(createStakeDto: CreateStakeDto): Promise<Stake> {
    const stake = new this.stakeModel(createStakeDto);
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

  async activeStakes(wallet: string): Promise<Stake[]> {
    const currentDate = new Date()
    const stakes = this.stakeModel.find({
      wallet,
      stakedAt: {$lte: currentDate},
      collected: false,
    }).populate('pool')
    return stakes
  }

  async activeStakesPools(wallet: string): Promise<ActiveStakesPool[]>{
    const activeStakesPools: ActiveStakesPool[] = []
    const stakedPools = await this.stakeModel.aggregate([
      {
        $match: {
          collected: false,
          wallet: { $regex: wallet, $options: 'i' }
        }
      },
      {
        $group: {
          _id: '$pool'
        }
      }
    ])

    for await(const poolId of stakedPools) {
      const pool = await this.poolService.findOne(poolId._id)
      const activeStakesPool = await this.activeStakesPool(pool.creator, wallet)
      activeStakesPools.push(activeStakesPool)
    }

    return activeStakesPools
  }

  async activeStakesPool(poolName: string, wallet: string): Promise<ActiveStakesPool> {
    const pool = await this.poolService.findOneByHandle(poolName)

    let stakes: Stake[] = await this.stakeModel.find({
      pool,
      collected: false
    })

    let members = []

    const token0: TokenDetails = {
      stakesCount: 0,
      totalAmount: 0,
      averageAPY: 0,
      totalFarmed: 0,
      walletTotalAmount: 0,
      walletAverageAPY: 0,
      walletFarmed: 0,
      walletStakesCount: 0
    }

    const token1: TokenDetails = {
      stakesCount: 0,
      totalAmount: 0,
      averageAPY: 0,
      totalFarmed: 0,
      walletTotalAmount: 0,
      walletAverageAPY: 0,
      walletFarmed: 0,
      walletStakesCount: 0
    }

    stakes.map(stake => {
      if(!members.includes(stake.wallet)) members.push(stake.wallet)
      if (stake.token === '0') {
        token0.stakesCount += 1
        token0.totalAmount += stake.amount
        token0.averageAPY += parseFloat(APY)
        token0.totalFarmed += stake.farmed
      } else {
        token1.stakesCount += 1
        token1.totalAmount += stake.amount
        token1.averageAPY += parseFloat(APY)
        token1.totalFarmed += stake.farmed
      }

      if(stake.wallet === wallet) {
        if (stake.token === '0') {
          token0.walletTotalAmount += stake.amount
          token0.walletAverageAPY = parseFloat(APY)
          token0.walletFarmed += stake.farmed
          token0.walletStakesCount += 1
        } else {
          token1.walletTotalAmount += stake.amount
          token1.walletAverageAPY = parseFloat(APY)
          token1.walletFarmed += stake.farmed
          token1.walletStakesCount += 1
        }
      }
    })
    token0.averageAPY = token0.averageAPY / token0.stakesCount
    token1.averageAPY = token1.averageAPY / token1.stakesCount
    token0.walletAverageAPY = token0.walletAverageAPY / token0.walletStakesCount
    token1.walletAverageAPY = token1.walletAverageAPY / token1.walletStakesCount

    return {
      token0,
      token1,
      poolHandle: pool.creator,
      members,
      numberOfStakes: stakes.length,
      pool,
      stakes,
    }
  }

  async topCreatorPools(): Promise<TopStakedPools[]> {

    const pools: TopStakedPools[] = await this.stakeModel.aggregate([
      {
        $match: {
          collected: false
        }
      },
      {
        $group: {
          _id: { 
            pool: '$pool',
            token: '$token',
          },
          totalAmount: {
            $sum: '$amount'
          }
        }
      }, {
        $sort: {
          totalAmount: -1
        }
      }, {
        $project: {
          _id: 0, 
          pool: '$_id.pool',
          token: '$_id.token', 
          totalAmount: '$totalAmount',
        }
      }
    ])

    const config = await getTokenConfig(CONFIG)
    const token01Price = await getTokenPrice(config[0].coingecko_coin_ticker)
    const token02Price = await getTokenPrice(config[1].coingecko_coin_ticker)

    for (const pool of pools) {
      pool.tokenPrice = pool.token === '0' ? token01Price : token02Price  
      pool.totalPrice = pool.tokenPrice * pool.totalAmount
    }
    const populated: TopStakedPools[] = await this.aggregatedPool.populate(pools, { path: 'pool', model: 'Pool' });
    return populated;
  }

  async latestStakes(latest: number): Promise<Stake[]> {
    return await this.stakeModel
      .find({ collected: false })
      .sort({stakedAt: -1})
      .limit(latest)
      .populate('pool');
  }

  async highestPositions(latest: number): Promise<Stake[]> {
    return await this.stakeModel
      .find({ collected: false })
      .sort({amount: -1})
      .limit(latest)
      .populate('pool')
  }

  async totalCurrentlyStaked(): Promise<{token:string, totalAmount:number, totalUsd:number}[] | []> {
    const total = await this.stakeModel.aggregate([
      {
        $match: {
          collected: false
        }
      },
      {
        $group: {
          _id: '$token',
          totalAmount: {
            $sum: '$amount'
          }
        }
      },{
        $project: {
          _id: 0,
          token: '$_id',
          totalAmount: '$totalAmount',
        }
      }
    ])

    if (total.length > 0) {
      // Get configure
      const tokenConfig = await getTokenConfig(CONFIG)

      // Get price by configure coingecko tick
      const token0Price = await getTokenPrice(tokenConfig[0].coingecko_coin_ticker)
      const token1Price = await getTokenPrice(tokenConfig[1].coingecko_coin_ticker)

      // Calculate price by blockchain token index and coingecko token price
      for (const token of total) {
        if(token.token === '0') token.totalUsd = token.totalAmount * token0Price
        if(token.token === '1') token.totalUsd = token.totalAmount * token1Price
      }
      return total
    }
    return []
  }

  async totalStaked(): Promise<{token:string, totalAmount:number, totalUsd:number}[] | []> {
    const total: {token:string, totalAmount:number, totalUsd:number}[] = await this.stakeModel.aggregate([
      {
        $group: {
          _id: '$token',
          totalAmount: {
            $sum: '$amount'
          }
        }
      },{
        $project: {
          _id: 0,
          token: '$_id',
          totalAmount: '$totalAmount',
        }
      }
    ])
    
    if (total.length > 0) {
      // Get configure
      const tokenConfig = await getTokenConfig(CONFIG)

      // Get price by configure coingecko tick
      const token0Price = await getTokenPrice(tokenConfig[0].coingecko_coin_ticker)
      const token1Price = await getTokenPrice(tokenConfig[1].coingecko_coin_ticker)

      // Calculate price by blockchain token index and coingecko token price
      for (const token of total) {
        if(token.token === '0') token.totalUsd = token.totalAmount * token0Price
        if(token.token === '1') token.totalUsd = token.totalAmount * token1Price
      }
      return total
    }
    return []
  }
}
