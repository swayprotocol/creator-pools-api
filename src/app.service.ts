import { Injectable } from '@nestjs/common';
import { Contract, utils } from 'ethers';
import moment from 'moment';
import { ClaimService } from './claim/claim.service';
import { PlanService } from './plan/plan.service';
import { PoolService } from './pool/pool.service';
import { MoralisPoolService } from './_moralis/pool/pool.service';
import { StakeService } from './stake/stake.service';
import { StakingContract } from './shared/StakingContract';
import { UnstakeService } from './unstake/unstake.service';
import { CreatePoolDto } from './pool/dto/create-pool.dto';
import { CreateStakeDto } from './stake/dto/create-stake.dto';

@Injectable()
export class AppService {

  constructor(
    private readonly contract: StakingContract,
    private readonly planService: PlanService,
    private readonly poolService: PoolService,
    private readonly claimService: ClaimService,
    private readonly stakeService: StakeService,
    private readonly unstakeService: UnstakeService,
    private readonly moralisPoolService: MoralisPoolService
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
      const stakes = await this.stakeService.findUncollected(recipient, pool);

      // After unstake sometimes claim event happened after unstake event
      const unstake = await this.unstakeService.findByHash(receipt.transactionHash);

      const claim = await this.claimService.create({
        wallet: recipient,
        pool: pool,
        amount: stakedAmount,
        claimDate: new Date(),
        hash: receipt.transactionHash,
        stakes: stakes,
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

      const claims = await this.claimService.findAndCollect(recipient, pool._id);

      await this.unstakeService.create({
        wallet: recipient,
        hash: receipt.transactionHash,
        pool: pool,
        unclaimDate: new Date(),
        stakes: stakes,
        claims: claims
      });
    })
  }

  async syncDatabse() {
    await this.syncPools()
  }

  async syncPools() {
    const pools = await this.poolService.findAll();
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

  getHealth(): Date {
    return new Date();
  }
}
