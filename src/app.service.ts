import { Injectable } from '@nestjs/common';
import { utils } from 'ethers';
import { ClaimService } from './claim/claim.service';
import { PoolService } from './pool/pool.service';
import { StakeService } from './stake/stake.service';
import { UnstakeService } from './unstake/unstake.service';
import { MoralisPoolService } from './_moralis/pool/pool.service';
import { MoralisStakeService } from './_moralis/stake/stake.service';
import { MoralisClaimService } from './_moralis/claim/claim.service';
import { MoralisUnstakeService } from './_moralis/unstake/unstake.service';

import './shared/abis/dualPools/staking-abi.json'
import './shared/abis/production/staking-abi.json'
import './shared/abis/staging/staking-abi.json'

import './shared/abis/dualPools/token-abi.json'
import './shared/abis/production/token-abi.json'
import './shared/abis/staging/token-abi.json'

import './shared/configs/dualPoolsConfig.json'
import './shared/configs/productionConfig.json'
import './shared/configs/stagingConfig.json'

@Injectable()
export class AppService {

  constructor(
    private readonly poolService: PoolService,
    private readonly claimService: ClaimService,
    private readonly stakeService: StakeService,
    private readonly unstakeService: UnstakeService,
    private readonly moralisPoolService: MoralisPoolService,
    private readonly moralisStakeService: MoralisStakeService,
    private readonly moralisClaimService: MoralisClaimService,
    private readonly moralisUnstakeService: MoralisUnstakeService
  ){}


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

    const poolsArray = await this.poolService.findAll();
    const pools = Object.assign({}, ...poolsArray.map((x) => ({[x.creator]: x._id})));

    for await (const stake of moralisStakes) {

      await this.stakeService.create({
        pool: pools[stake.poolHandle],
        amount: parseFloat(utils.formatEther(stake.amount)),
        stakedAt: stake.block_timestamp,
        wallet: stake.sender,
        hash: stake.transaction_hash,
        token: stake.token
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
        amount: parseFloat(utils.formatEther(claim.swayAmount)),
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
      await this.stakeService.collect(stakeIDs, unstake.block_timestamp);
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
