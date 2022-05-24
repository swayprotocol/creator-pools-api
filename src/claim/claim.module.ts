import { Module } from '@nestjs/common';
import { ClaimService } from './claim.service';
import { ClaimController } from './claim.controller';
import { claimSchema } from './entities/claim.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PoolModule } from '../pool/pool.module';
import { UnstakeModule } from '../unstake/unstake.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Claim', schema: claimSchema}], 'ourDb'),
    PoolModule,
    UnstakeModule,
  ],
  controllers: [ClaimController],
  providers: [ClaimService],
  exports: [ClaimService]
})
export class ClaimModule {}
