import { Module } from '@nestjs/common';
import { StakeService } from './stake.service';
import { StakeController } from './stake.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { stakeSchema } from './entities/stake.schema';
import { PoolModule } from '../pool/pool.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Stake', schema: stakeSchema}],'ourDb'),
    PoolModule,
  ],
  controllers: [StakeController],
  providers: [StakeService],
  exports: [StakeService],
})
export class StakeModule {}
