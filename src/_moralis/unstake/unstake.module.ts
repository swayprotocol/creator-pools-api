import { Module } from '@nestjs/common';
import { MoralisUnstakeService } from './unstake.service';
import { MoralisUnstakeController } from './unstake.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { unstakeSchema } from './entities/unstake.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Unstake', schema: unstakeSchema, collection: 'Unstakes'}], 'moralisDb'),
  ],
  controllers: [MoralisUnstakeController],
  providers: [MoralisUnstakeService],
  exports: [MoralisUnstakeService]
})
export class MoralisUnstakeModule {}
