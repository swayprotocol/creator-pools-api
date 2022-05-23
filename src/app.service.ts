import { Injectable } from '@nestjs/common';
import { Contract, utils } from 'ethers';
import moment from 'moment';
import { ClaimService } from './claim/claim.service';
import { PlanService } from './plan/plan.service';
import { PoolService } from './pool/pool.service';
import { StakeService } from './stake/stake.service';
import { StakingContract } from './shared/StakingContract';
import { UnstakeService } from './unstake/unstake.service';
import { CreatePoolDto } from './pool/dto/create-pool.dto';
import { CreateStakeDto } from './stake/dto/create-stake.dto';
import { MoralisPoolService } from './_moralis/pool/pool.service';
import { MoralisStakeService } from './_moralis/stake/stake.service';
import { MoralisClaimService } from './_moralis/claim/claim.service';
import { MoralisUnstakeService } from './_moralis/unstake/unstake.service';

@Injectable()
export class AppService {

  constructor(
    private readonly contract: StakingContract,
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
    this.initialListeners(this.contract.getStakingContract())
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

      await this.stakeService.create(stakeDto);
    })

    stakingContract.on('Reward', async (poolHandle, recipient, amount, receipt) => {
      console.log('Reward claimed');
      const stakedAmount = parseFloat(utils.formatEther(amount));

      const pool = await this.poolService.findOneByHandle(poolHandle);

      // After unstake sometimes claim event happened after unstake event
      const unstake = await this.unstakeService.findByHash(receipt.transactionHash);

      const claim = await this.claimService.create({
        wallet: recipient,
        pool: pool,
        amount: stakedAmount,
        claimDate: new Date(),
        hash: receipt.transactionHash,
        unstaked: (unstake ? true : false)
      });

      if (unstake) {
        await this.unstakeService.pushClaim(unstake._id, claim);
      }
    })

    stakingContract.on('Unstaked', async (poolHandle, recipient, amount, receipt) => {
      console.log('Unstaked');

      const pool = await this.poolService.findOneByHandle(poolHandle);
      const stakes = await this.stakeService.findStakedUntil(recipient, pool);
      const stakeIDs = stakes.map(stake => {return stake._id});
      await this.stakeService.collect(stakeIDs);
      await this.claimService.findAndCollect(recipient, pool._id);

      await this.unstakeService.create({
        wallet: recipient,
        hash: receipt.transactionHash,
        pool: pool,
        unclaimDate: new Date(),
        amount: parseFloat(utils.formatEther(amount)),
      });
    })
  }

  async syncDatabse() {
    await this.syncPools()
    await this.syncStakes()
    await this.syncClaims()
    await this.syncUnstake()
  }

  async syncPools() {
    const pools = await this.poolService.findAll()
    const poolsHashes = pools.map(pool => { return pool.hash })

    const moralisPools = await this.moralisPoolService.findMissing(poolsHashes);

    for await (const pool of moralisPools) {
      await this.poolService.create({
        creator: pool.poolHandle,
        startTime: pool.block_timestamp,
        hash: pool.transaction_hash
      })
    }
    console.log(`Pools added: ${moralisPools.length}`)
  }

  async syncStakes() {
    const stakes = await this.stakeService.findAll()
    const stakesHashes = stakes.map(stake => { return stake.hash })

    const moralisStakes = await this.moralisStakeService.findMissing(stakesHashes);

    const plansArray = await this.planService.findAll();
    const plans = Object.assign({}, ...plansArray.map((x) => ({[x.blockchainIndex]: x._id})));
    const poolsArray = await this.poolService.findAll();
    const pools = Object.assign({}, ...poolsArray.map((x) => ({[x.creator]: x._id})));

    for await (const stake of moralisStakes) {
      const stakedAt = moment(stake.block_timestamp);
      const plan = plans[stake.planId]

      await this.stakeService.create({
        plan: plan,
        pool: pools[stake.poolHandle],
        amount: parseFloat(utils.formatEther(stake.amount)),
        stakedAt: stakedAt.toDate(),
        stakedUntil: stakedAt.add(plan.lockMonths,'M').toDate(),
        wallet: stake.sender,
        hash: stake.transaction_hash
      })
    }
    console.log(`Stakes added: ${moralisStakes.length}`)
  }

  async syncClaims() {
    const claims = await this.claimService.findAll()
    const claimsHashes = claims.map(claim => { return claim.hash })

    const moralisClaims = await this.moralisClaimService.findMissing(claimsHashes)

    const poolsArray = await this.poolService.findAll();
    const pools = Object.assign({}, ...poolsArray.map((x) => ({[x.creator]: x._id})));

    for await (const claim of moralisClaims) {
      await this.claimService.create({
        wallet: claim.recipient,
        pool: pools[claim.poolHandle],
        amount: parseFloat(utils.formatEther(claim.amount)),
        claimDate: moment(claim.block_timestamp).toDate(),
        hash: claim.transaction_hash,
        unstaked: false
      })
    }
    console.log(`Claims added: ${moralisClaims.length}`)
  }

  async syncUnstake() {
    const unstakes = await this.unstakeService.findAll()
    const unstakesHashes = unstakes.map(unstake => { return unstake.hash })

    const moralisUnstakes = await this.moralisUnstakeService.findMissing(unstakesHashes)

    const poolsArray = await this.poolService.findAll();
    const pools = Object.assign({}, ...poolsArray.map((x) => ({[x.creator]: x._id})));

    for await (const unstake of moralisUnstakes) {
      const pool = pools[unstake.poolHandle]
      
      const stakes = await this.stakeService.findStakedUntil(unstake.recipient, pool);
      const stakeIDs = stakes.map(stake => {return stake._id});
      await this.stakeService.collect(stakeIDs);
      await this.claimService.findAndCollect(unstake.recipient, pool._id);
      
      await this.unstakeService.create({
        wallet: unstake.recipient,
        hash: unstake.transaction_hash,
        pool: pool,
        unclaimDate: moment(unstake.block_timestamp).toDate(),
        amount: parseFloat(utils.formatEther(unstake.amount)),
      })
    }
    console.log(`Unstakes added: ${moralisUnstakes.length}`)
  }

  getHealth(): Date {
    return new Date();
  }
}
