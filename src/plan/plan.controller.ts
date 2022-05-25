import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { ApiTags } from '@nestjs/swagger';
import { ValidateMongoId } from './../validators/MongoId';
import { Plan } from './entities/plan.entity';

@ApiTags('plan')
@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  create(@Body() createPlanDto: CreatePlanDto): Promise<Plan> {
    return this.planService.create(createPlanDto);
  }

  @Get()
  findAll(): Promise<Plan[]> {
    return this.planService.findAll();
  }

  @Get('/onBlockchain')
  getPlansBC(@Query('name') name: string): Promise<Plan[]>{
    return this.planService.getPlansBc(name);
  }

  @Get('/active')
  getActive(): Promise<Plan[]> {
    return this.planService.getActive()
  }

  @Get('/maxApy')
  getMaxApy(): Promise<Plan> {
    return this.planService.getMaxApy()
  }

  @Get(':id')
  findOne(@Param('id', ValidateMongoId) id: string): Promise<Plan> {
    return this.planService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id',  ValidateMongoId) id: string): Promise<Plan> {
    return this.planService.remove(id);
  }

}

