import { Module } from '@nestjs/common';
import { UnstakeService } from './unstake.service';
import { UnstakeController } from './unstake.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { unstakeSchema } from './entities/unstake.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Unstake', schema: unstakeSchema}], 'ourDb')
  ],
  controllers: [UnstakeController],
  providers: [UnstakeService],
  exports: [UnstakeService],
})
export class UnstakeModule {}
