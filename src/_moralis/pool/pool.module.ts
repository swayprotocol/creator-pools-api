import { Module } from '@nestjs/common';
import { PoolService } from './pool.service';
import { PoolController } from './pool.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { poolSchema } from './entities/pool.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Pool', schema: poolSchema, collection: 'Pools'}], 'moralisDb'),
  ],
  controllers: [PoolController],
  providers: [PoolService],
  exports: [PoolService]
})
export class MoralisPoolModule {}
