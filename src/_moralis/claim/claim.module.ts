import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoralisClaimService } from './claim.service';
import { MoralisClaimController } from './claim.controller';
import { claimSchema } from './entities/claim.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Reward', schema: claimSchema, collection: 'Rewards'}], 'moralisDb'),
  ],
  controllers: [MoralisClaimController],
  providers: [MoralisClaimService],
  exports: [MoralisClaimService]
})
export class MoralisClaimModule {}
