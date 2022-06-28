import { Injectable } from '@nestjs/common';
import { utils } from 'ethers';
import Moralis from 'moralis/node';
import { ClaimService } from './claim/claim.service';
import { PlanService } from './plan/plan.service';
import { PoolService } from './pool/pool.service';
import { StakeService } from './stake/stake.service';
import { UnstakeService } from './unstake/unstake.service';
import { MoralisPoolService } from './_moralis/pool/pool.service';
import { MoralisStakeService } from './_moralis/stake/stake.service';
import { MoralisClaimService } from './_moralis/claim/claim.service';
import { MoralisUnstakeService } from './_moralis/unstake/unstake.service';
import { 
  MORALIS_APP_ID, 
  MORALIS_MASTER_KEY, 
  MORALIS_SERVER_URL } from './config';

import './shared/configs/productionConfig.json';
import './shared/abis/production/staking-abi.json';
import './shared/abis/production/token-abi.json';
import './shared/configs/stagingConfig.json';
import './shared/abis/staging/staking-abi.json';
import './shared/abis/staging/token-abi.json';
import { MORALIS_APP_ID, MORALIS_MATER_KEY, MORALIS_SERVER_URL } from './config';

@Injectable()
export class AppService {

  constructor(
    private readonly planService: PlanService,
    private readonly poolService: PoolService,
    private readonly claimService: ClaimService,
    private readonly stakeService: StakeService,
    private readonly unstakeService: UnstakeService,
    private readonly moralisPoolService: MoralisPoolService,
    private readonly moralisStakeService: MoralisStakeService,
    private readonly moralisClaimService: MoralisClaimService,
    private readonly moralisUnstakeService: MoralisUnstakeService
  ){
    this.startMoralis();
  }

  async startMoralis() {
    await Moralis.start({
      serverUrl: MORALIS_SERVER_URL,
      appId: MORALIS_APP_ID,
      masterKey: MORALIS_MASTER_KEY
    })

    const poolQuery = new Moralis.Query('Pools')
    const poolSub = await poolQuery.subscribe()

    const stakeQuery = new Moralis.Query('Stakes')
    const stakeSub = await stakeQuery.subscribe() 

    const claimQuery = new Moralis.Query('Claims')
    const claimSub = await claimQuery.subscribe()

    const unstakeQuery = new Moralis.Query('Unstakes')
    const unstakeSub = await unstakeQuery.subscribe()

    poolSub.on('update', async cursor => {
      const pool = cursor.attributes
      const exists = await this.poolService.findByHash(pool.transaction_hash)
      if (!exists) {
        try {
          await this.poolService.create({
            creator: pool.poolHandle,
            startTime: pool.block_timestamp,
            hash: pool.transaction_hash,
          })
        } catch {
          console.log('Error inserting new pool')
        }
      }
    })

    stakeSub.on('update', async cursor => {
      const stake = cursor.attributes
      const exists = await this.stakeService.findByHash(stake.transaction_hash)
      if (!exists) {
        try {
          const pool = await this.poolService.findOneByHandle(stake.poolHandle)
          await this.stakeService.create({
            pool: pool._id,
            amount: parseFloat(utils.formatEther(stake.amount)),
            stakedAt: stake.block_timestamp,
            wallet: stake.sender,
            hash: stake.transaction_hash,
            plan: undefined
          })
        } catch {
          console.log('Error inserting new stake')
        }
      }
    })

    claimSub.on('update', async cursor => {
      const claim = cursor.attributes
      const exists = await this.claimService.findByHash(claim.transaction_hash)
      if (!exists) {
        try {
          const pool = await this.poolService.findOneByHandle(claim.poolHandle)
          await this.claimService.create({
            wallet: claim.recipient,
            pool: pool,
            amount: parseFloat(utils.formatEther(claim.amount)),
            claimDate: claim.block_timestamp,
            hash: claim.transaction_hash,
            unstaked: false
          })
        } catch {
          console.log('Error inserting new claim')
        }
      }
    })

    unstakeSub.on('update', async cursor => {
      const unstake = cursor.attributes
      const exists = await this.unstakeService.findByHash(unstake.transaction_hash)
      if (!exists) {
        try {
          const pool = await this.poolService.findOneByHandle(unstake.poolHandle)
          const stakes = await this.stakeService.findUncollected(unstake.recipient, pool);
          const stakeIDs = stakes.map(stake => {return stake._id});
          await this.stakeService.collect(stakeIDs);
          await this.claimService.findAndCollect(unstake.recipient, pool._id);
          await this.unstakeService.create({
            wallet: unstake.recipient,
            hash: unstake.transaction_hash,
            pool: pool,
            unstakeDate: unstake.block_timestamp,
            amount: parseFloat(utils.formatEther(unstake.amount)),
          })
        } catch {
          console.log('Error inserting new unstake')
        }
      }
    })
  }

  async syncDatabse(fromDate: Date) {
    console.log(`Sync started ${new Date()}`)
    await this.syncPools(fromDate)
    await this.syncStakes(fromDate)
    await this.syncClaims(fromDate)
    await this.syncUnstake(fromDate)
    console.log(`Sync finished ${new Date()}`)
  }

  async syncPools(fromDate: Date) {
    const pools = await this.poolService.findAllAfter(fromDate)
    const poolsHashes = pools.map(pool => { return pool.hash })

    const moralisPools = await this.moralisPoolService.findMissing(poolsHashes, fromDate);

    for await (const pool of moralisPools) {
      await this.poolService.create({
        creator: pool.poolHandle,
        startTime: pool.block_timestamp,
        hash: pool.transaction_hash
      })
    }
    console.log(`Pools added: ${moralisPools.length}`)
  }

  async syncStakes(fromDate: Date) {
    const stakes = await this.stakeService.findAllAfter(fromDate)
    const stakesHashes = stakes.map(stake => { return stake.hash })

    const moralisStakes = await this.moralisStakeService.findMissing(stakesHashes, fromDate);

    const plansArray = await this.planService.findAll();
    const plans = Object.assign({}, ...plansArray.map((x) => ({[x.blockchainIndex]: x._id})));
    const poolsArray = await this.poolService.findAll();
    const pools = Object.assign({}, ...poolsArray.map((x) => ({[x.creator]: x._id})));

    for await (const stake of moralisStakes) {
      const plan = plans[stake.planId]

      await this.stakeService.create({
        plan: plan,
        pool: pools[stake.poolHandle],
        amount: parseFloat(utils.formatEther(stake.amount)),
        stakedAt: stake.block_timestamp,
        wallet: stake.sender,
        hash: stake.transaction_hash
      })
    }
    console.log(`Stakes added: ${moralisStakes.length}`)
  }

  async syncClaims(fromDate: Date) {
    const claims = await this.claimService.findAllAfter(fromDate)
    const claimsHashes = claims.map(claim => { return claim.hash })

    const moralisClaims = await this.moralisClaimService.findMissing(claimsHashes, fromDate)

    const poolsArray = await this.poolService.findAll();
    const pools = Object.assign({}, ...poolsArray.map((x) => ({[x.creator]: x._id})));

    for await (const claim of moralisClaims) {
      await this.claimService.create({
        wallet: claim.recipient,
        pool: pools[claim.poolHandle],
        amount: parseFloat(utils.formatEther(claim.amount)),
        claimDate: claim.block_timestamp,
        hash: claim.transaction_hash,
        unstaked: false
      })
    }
    console.log(`Claims added: ${moralisClaims.length}`)
  }

  async syncUnstake(fromDate: Date) {
    const unstakes = await this.unstakeService.findAllAfter(fromDate)
    const unstakesHashes = unstakes.map(unstake => { return unstake.hash })

    const moralisUnstakes = await this.moralisUnstakeService.findMissing(unstakesHashes, fromDate)

    const poolsArray = await this.poolService.findAll();
    const pools = Object.assign({}, ...poolsArray.map((x) => ({[x.creator]: x._id})));

    for await (const unstake of moralisUnstakes) {
      const pool = pools[unstake.poolHandle]
      
      const stakes = await this.stakeService.findUncollected(unstake.recipient, pool);
      const stakeIDs = stakes.map(stake => {return stake._id});
      await this.stakeService.collect(stakeIDs);
      await this.claimService.findAndCollect(unstake.recipient, pool._id);
      
      await this.unstakeService.create({
        wallet: unstake.recipient,
        hash: unstake.transaction_hash,
        pool: pool,
        unstakeDate: unstake.block_timestamp,
        amount: parseFloat(utils.formatEther(unstake.amount)),
      })
    }
    console.log(`Unstakes added: ${moralisUnstakes.length}`)
  }

  async getConfig(name: string): Promise<NodeRequire> {
    try {
      const config = await require(`./shared/configs/${name}Config.json`)
      return config
    } catch (error) {
      return null
    }
  }

  async getStakingAbi(name: string): Promise<NodeRequire> {
    try {
      const abi = await require(`./shared/abis/${name}/staking-abi.json`)
      return abi
    } catch (error) {
      return null
    }
  }

  async getTokenAbi(name: string): Promise<NodeRequire> {
    try {
      const abi = await require(`./shared/abis/${name}/token-abi.json`)
      return abi
    } catch (error) {
      return null
    }
  }

  getHealth(): Date {
    return new Date();
  }
}
