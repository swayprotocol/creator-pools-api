import { Module } from '@nestjs/common';
import { PoolService } from './pool.service';
import { PoolController } from './pool.controller';
import { poolSchema } from './entities/pool.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Pool', schema: poolSchema}], 'ourDb'),
  ],
  controllers: [PoolController],
  providers: [PoolService],
  exports: [PoolService]
})
export class PoolModule {}
