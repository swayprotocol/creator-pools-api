import { Module } from '@nestjs/common';
import { MoralisStakeService } from './stake.service';
import { MoralisStakeController } from './stake.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { stakeSchema } from './entities/stake.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Stake', schema: stakeSchema, collection: 'Stakes'}], 'moralisDb'),
  ],
  controllers: [MoralisStakeController],
  providers: [MoralisStakeService],
  exports: [MoralisStakeService]
})
export class MoralisStakeModule {}
