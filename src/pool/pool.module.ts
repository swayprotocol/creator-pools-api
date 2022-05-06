import { Module } from '@nestjs/common';
import { PoolService } from './pool.service';
import { PoolController } from './pool.controller';
import { poolSchema } from './entities/pool.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StakingContract } from 'src/shared/StakingContract';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Pool', schema: poolSchema}])],
  controllers: [PoolController],
  providers: [PoolService, StakingContract],
  exports: [PoolService]
})
export class PoolModule {}
