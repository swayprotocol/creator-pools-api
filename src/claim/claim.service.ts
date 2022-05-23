import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contract, utils } from 'ethers';
import { StakingContract } from 'src/shared/StakingContract';
import { CreateClaimDto } from './dto/create-claim.dto';
import { Claim } from './entities/claim.entity';
import { PoolService } from 'src/pool/pool.service';
import { UnstakeService } from 'src/unstake/unstake.service';


@Injectable()
export class ClaimService {

  constructor(
    @InjectModel('Claim') private readonly claimModel: Model<Claim>,
    private readonly contract: StakingContract,
    private readonly poolService: PoolService,
    private readonly unstakeService: UnstakeService,
  ) {
    this.initialListeners(this.contract.getStakingContract())
  }

  async create(createClaimDto: CreateClaimDto): Promise<Claim> {
    const claim = new this.claimModel(createClaimDto);
    await claim.save();
    return claim;
  }

  async findAll(): Promise<Claim[]> {
    const claims = await this.claimModel.find();
    return claims;
  }

  async findOne(id: string): Promise<Claim> {
    const claim = await this.claimModel.findOne({ _id: id });
    return claim;
  }

  async findAndCollect(wallet: string, poolId: string): Promise<Claim[]> {
    const claims = await this.claimModel.find({
      wallet,
      pool: poolId,
      unstaked: false,
    });

    const claimIDs = claims.map(claim => {return claim._id});
    await this.claimModel.updateMany({
      _id: { $in: claimIDs}
    },{
      unstaked: true,
    })

    return claims;
  }

  async initialListeners(contract: Promise<Contract>) {
    const stakingContract = await contract;

    stakingContract.on('Reward', async (poolHandle, recipient, amount, receipt) => {
      console.log('Reward claimed');
      const stakedAmount = parseFloat(utils.formatEther(amount));

      const pool = await this.poolService.findOneByHandle(poolHandle);

      // After unstake sometimes claim event happened after unstake event
      const unstake = await this.unstakeService.findByHash(receipt.transactionHash);

      const claim = await this.create({
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
  }

}
