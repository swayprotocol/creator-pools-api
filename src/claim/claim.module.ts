import { Module } from '@nestjs/common';
import { ClaimService } from './claim.service';
import { ClaimController } from './claim.controller';
import { claimSchema } from './entities/claim.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Claim', schema: claimSchema}], 'ourDb'),
  ],
  controllers: [ClaimController],
  providers: [ClaimService],
  exports: [ClaimService]
})
export class ClaimModule {}
