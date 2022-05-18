import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePlanDto } from './dto/create-plan.dto';
import { Model } from 'mongoose';
import { Plan } from './entities/plan.entity';
import { Contract, utils } from 'ethers';
import { StakingContract } from '../shared/StakingContract';

@Injectable()
export class PlanService {

  constructor(
    @InjectModel('Plan') private readonly planModel: Model<Plan>,
    private readonly contract: StakingContract
  ) {}

  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    const plan = new this.planModel(createPlanDto)
    await plan.save();
    return plan;
  }

  async findAll(): Promise<Plan[]> {
    const plans = await this.planModel.find();
    return plans;
  }

  async findOne(id: string): Promise<Plan> {
    const plan = await this.planModel.findOne({_id: id});
    return plan;
  }

  async findOneByBlockchainIndex(index: number): Promise<Plan> {
    const plan = await this.planModel.findOne({ blockchainIndex: index });
    return plan;
  }

  async update(id: string, updatePlanDto: CreatePlanDto): Promise<Plan> {
    const stakingContract: Contract = await this.contract.getStakingContract();
    const result = await stakingContract.changePlan(0,12,111,100000);
    await result.wait()
    const plan = await this.planModel.findOneAndUpdate(
      { _id: id },
      updatePlanDto,
      { new: true }
    );
    return plan;
  }

  async remove(id: string): Promise<Plan> {
    const plan = await this.planModel.findOneAndRemove({_id: id})
    return plan;
  }

  async getPlansBc(): Promise<Plan[]> {
    
    const stakingContract: Contract = await this.contract.getStakingContract();
    const plans = await this.planModel.find();

    return Promise.all(plans.map(plan => {
      return stakingContract.plans(plan.blockchainIndex).then(res => ({
        planId: plan.blockchainIndex,
        apy: res.apy,
        availableUntil: new Date(+utils.formatUnits(res.availableUntil, 0) * 1000),
        lockMonths: res.lockMonths
      }));
    }));
  }

}

