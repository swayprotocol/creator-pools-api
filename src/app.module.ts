import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MONGO_URL } from './config';
import { PlanModule } from './plan/plan.module';
import { PoolModule } from './pool/pool.module';

const database = MongooseModule.forRoot(MONGO_URL);

@Module({
  imports: [database, PlanModule, PoolModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
