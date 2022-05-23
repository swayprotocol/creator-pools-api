import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contract, utils } from 'ethers';
import { StakingContract } from '../shared/StakingContract';
import { Claim } from '../claim/entities/claim.entity';
import { CreateUnstakeDto } from './dto/create-unstake.dto';
import { Unstake } from './entities/unstake.entity';
import { PoolService } from '../pool/pool.service';
import { ClaimService } from '../claim/claim.service';
import { StakeService } from 'src/stake/stake.service';

@Injectable()
export class UnstakeService {
  constructor(
    @InjectModel('Unstake') private readonly unstakeModel: Model<Unstake>,
    private readonly contract: StakingContract,
    private readonly poolService: PoolService,
    @Inject(forwardRef(() => ClaimService))
    private readonly claimService: ClaimService,
    private readonly stakeService: StakeService,
  ){
    this.initialListeners(this.contract.getStakingContract())
  }

  async create(createUnstakeDto: CreateUnstakeDto): Promise<Unstake> {
    const unstake = new this.unstakeModel(createUnstakeDto);
    return await unstake.save();
  }

  async findAllAfter(after: Date): Promise<Unstake[]> {
    const unstakes = await this.unstakeModel.find({ unstakeDate: { $gte: after } });
    return unstakes;
  }

  async findAll(): Promise<Unstake[]> {
    const unstakes = await this.unstakeModel.find();
    return unstakes;
  }

  async findOne(id: string): Promise<Unstake> {
    const unstake = await this.unstakeModel.findOne({ _id: id })
    return unstake;
  }

  async findByHash(hash: string): Promise<Unstake> {
    const unstake = await this.unstakeModel.findOne({ hash });
    return unstake;
  }

  async pushClaim(id: string, claim: Claim): Promise<Unstake> {
    const unstake = await this.unstakeModel.findOneAndUpdate({
        _id: id
      },{
        $push: { claims: claim }
      },
      { new: true }
    )
    return unstake;
  }

  async initialListeners(contract: Promise<Contract>) {
    const stakingContract = await contract;
    
    stakingContract.on('Unstaked', async (poolHandle, recipient, amount, receipt) => {
      console.log('Unstaked');

      const pool = await this.poolService.findOneByHandle(poolHandle);
      const stakes = await this.stakeService.findStakedUntil(recipient, pool);
      const stakeIDs = stakes.map(stake => {return stake._id});
      await this.stakeService.collect(stakeIDs);
      await this.claimService.findAndCollect(recipient, pool._id);

      await this.create({
        wallet: recipient,
        hash: receipt.transactionHash,
        pool: pool,
        unstakeDate: new Date(),
        amount: parseFloat(utils.formatEther(amount)),
      });
    })
  }
}
