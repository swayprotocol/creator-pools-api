import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePlanDto } from './dto/create-plan.dto';
import { Model } from 'mongoose';
import { Plan } from './entities/plan.entity';

@Injectable()
export class PlanService {

  constructor(@InjectModel('Plan') private readonly planModel: Model<Plan>){}

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

  async update(id: string, updatePlanDto: CreatePlanDto): Promise<Plan> {
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
}
