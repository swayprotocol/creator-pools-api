import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contract, utils } from 'ethers';
import moment from 'moment';
import { Stake } from './entities/stake.entity';
import { CreateStakeDto } from './dto/create-stake.dto';
import { StakingContract } from '../shared/StakingContract';
import { PlanService } from '../plan/plan.service';
import { PoolService } from '../pool/pool.service';
import { CreatePoolDto } from '../pool/dto/create-pool.dto';
import { ClaimService } from '../claim/claim.service';
import { UnstakeService } from '../unstake/unstake.service';

@Injectable()
export class StakeService {
  constructor(
    @InjectModel('Stake') private readonly stakeModel: Model<Stake>,
    private readonly contract: StakingContract,
    private readonly planService: PlanService,
    private readonly poolService: PoolService,
    private readonly claimService: ClaimService,
    private readonly unstakeService: UnstakeService,
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

    stakingContract.on('Reward', async (poolHandle, recipient, amount, receipt) => {
      console.log('Reward claimed');
      const stakedAmount = parseFloat(utils.formatEther(amount));

      const pool = await this.poolService.findOneByHandle(poolHandle);
      const stakes = await this.stakeModel.find({
        wallet: recipient,
        pool: pool,
        collected: false,
      })

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
      const stakes = await this.stakeModel.find({
        pool: pool,
        wallet: recipient,
        stakedUntil: { $gt: new Date() }
      });
      const stakeIDs = stakes.map(stake => {return stake._id});
      await this.stakeModel.updateMany({
        _id: { $in: stakeIDs }
      },{
        collected: true
      });

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
}
