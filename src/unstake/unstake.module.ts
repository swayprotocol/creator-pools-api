import { forwardRef, Module } from '@nestjs/common';
import { UnstakeService } from './unstake.service';
import { UnstakeController } from './unstake.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { unstakeSchema } from './entities/unstake.schema';
import { PoolModule } from '../pool/pool.module';
import { ClaimModule } from '../claim/claim.module';
import { StakeModule } from '../stake/stake.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Unstake', schema: unstakeSchema}], 'ourDb'),
  ],
  controllers: [UnstakeController],
  providers: [UnstakeService],
  exports: [UnstakeService],
})
export class UnstakeModule {}
