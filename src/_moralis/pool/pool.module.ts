import { Module } from '@nestjs/common';
import { MoralisPoolService } from './pool.service';
import { MoralisPoolController } from './pool.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { poolSchema } from './entities/pool.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Pool', schema: poolSchema, collection: 'Pools'}], 'moralisDb'),
  ],
  controllers: [MoralisPoolController],
  providers: [MoralisPoolService],
  exports: [MoralisPoolService]
})
export class MoralisPoolModule {}
