import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MONGO_URL } from './config';

const database = MongooseModule.forRoot(MONGO_URL);

@Module({
  imports: [database],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
