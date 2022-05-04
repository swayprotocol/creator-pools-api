import { Module } from '@nestjs/common';
import { StakeService } from './stake.service';
import { StakeController } from './stake.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { stakeSchema } from './entities/stake.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Stake', schema: stakeSchema}])],
  controllers: [StakeController],
  providers: [StakeService]
})
export class StakeModule {}
