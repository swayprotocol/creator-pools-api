import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stake } from './entities/stake.entity';
import { CreateStakeDto } from './dto/create-stake.dto';
import { Pool } from '../pool/entities/pool.entity';
import { PoolService } from '../pool/pool.service';
import { ActiveStakesPool, Token, TokenDetails, TokenOverview, TopStakedPool } from './entities/helper.interfaces';
import { getTokenPrice } from '../helpers/getTokenPrice';
import { getTokenConfig } from '../helpers/getTokenConfig';
import { APY, CONFIG } from '../config';
@Injectable()
export class StakeService {
  constructor(
    @InjectModel('Stake') private readonly stakeModel: Model<Stake>,
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

  async collect(ids: string[], collectedDate: Date) {
    await this.stakeModel.updateMany({
      _id: { $in: ids }
    },{
      collected: true,
      collectedDate
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

  async activeStakesRewards(token: string): Promise<number> {
    const stakes = await this.stakeModel.find({
      collected: false,
      token
    })
    
    let total: number = 0
    for (const stake of stakes) {
      total += stake.farmed
    }
    return total
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

  async topCreatorPools(): Promise<TopStakedPool[]> {
    let pools = {}
    let stakes: Stake[] = await this.stakeModel.find({collected: false}).populate('pool')
    const config = await getTokenConfig(CONFIG)
    const token0Price = await getTokenPrice(config[0].coingecko_coin_ticker)
    const token1Price = await getTokenPrice(config[1].coingecko_coin_ticker)

    for (const stake of stakes) {
      // If pool doesn't exist in dict
      if(!pools[stake.pool.creator]){
        const token0: Token = {
          name: stake.token,
          price: stake.token === config[0].name_in_contract ? token0Price : token1Price,
          totalAmount: stake.amount,
        }
        const token1: Token = {
          name: stake.token === config[0].name_in_contract ? config[1].name_in_contract : config[0].name_in_contract,
          price: stake.token === config[0].name_in_contract ? token1Price : token0Price,
          totalAmount: 0,
        }
        const pool: TopStakedPool = {
          pool: stake.pool,
          tokens: token0.name === config[0].name_in_contract ? [token0,token1] : [token1,token0]
        }
        pools[stake.pool.creator] = pool
      } else {
        // Pool already created
        // Token alredy in tokens array
        let token = pools[stake.pool.creator].tokens.find(token => token.name === stake.token)
        if (token) {
          token.totalAmount += stake.amount
        }
      }
    }
    const poolsArray: TopStakedPool[] = Object.values(pools)
    poolsArray.sort((a, b) => {
      let totalUsdA = 0
      let totalUsdB = 0

      for (const token of a.tokens) {
        totalUsdA = token.price * token.totalAmount
      }

      for (const token of b.tokens) {
        totalUsdB = token.price * token.totalAmount
      }

      return totalUsdB - totalUsdA
    })
    return poolsArray
  }

  async latestStakes(latest: number): Promise<Stake[]> {
    return await this.stakeModel
      .find({ collected: false })
      .sort({stakedAt: -1})
      .limit(latest)
      .populate('pool');
  }

  async highestPositions(latest: number): Promise<Stake[]> {
    const config = await getTokenConfig(CONFIG)
    const token0Price = await getTokenPrice(config[0].coingecko_coin_ticker)
    const token1Price = await getTokenPrice(config[1].coingecko_coin_ticker)
    const stakes = await this.stakeModel.find({ collected: false }).populate('pool')
    stakes.sort((a, b) => {
      let totalUsdA = a.amount * (a.token === config[0].name_in_contract ? token0Price : token1Price)
      let totalUsdB = b.amount * (b.token === config[0].name_in_contract ? token0Price : token1Price)
      return totalUsdB - totalUsdA
    })
    // If latest is smaller than length we return full array else we split it
    latest = stakes.length > latest ? latest : stakes.length
    return stakes.splice(0,latest)
  }

  async totalCurrentlyStaked(): Promise<{token:string, totalStaked:number}[] | []> {
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
          totalStaked: '$totalAmount',
        }
      }
    ])

    return total
  }

  async totalCurrentlyFarmed() {
    const stakes = await this.stakeModel.find({collected: false})
    const totalFarmedByToken = {}
    for (const stake of stakes) {
      if (!totalFarmedByToken[stake.token]) totalFarmedByToken[stake.token] = stake.farmed
      totalFarmedByToken[stake.token] += stake.farmed
    }
    return totalFarmedByToken
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
        if(token.token === tokenConfig[0].name_in_contract) token.totalUsd = token.totalAmount * token0Price
        if(token.token === tokenConfig[1].name_in_contract) token.totalUsd = token.totalAmount * token1Price
      }
      return total
    }
    return []
  }

  async overview(): Promise<TokenOverview[]> {
    const totalCurrentlyFarmed = await this.totalCurrentlyFarmed()
    const totalCurrentlyStaked = await this.totalCurrentlyStaked()
    const tokenOverviews: TokenOverview[] = []

    for (let token of totalCurrentlyStaked) {
      const tokenOverview: TokenOverview = {
        token: token.token,
        totalStaked: token.totalStaked,
        APY: parseInt(APY),
        totalFarmed: await this.activeStakesRewards(token.token) + totalCurrentlyFarmed[token.token]
      }
      tokenOverviews.push(tokenOverview)
    }

    return tokenOverviews
  }

  async tokensPrice() {
    const config = await getTokenConfig(CONFIG)
    const token0Price = await getTokenPrice(config[0].coingecko_coin_ticker)
    const token1Price = await getTokenPrice(config[1].coingecko_coin_ticker)
    return [
      {
        token: config[0].name_in_contract,
        price: token0Price
      },{
        token: config[1].name_in_contract,
        price: token1Price
      }
    ]
  }

}
