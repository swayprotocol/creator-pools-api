import { IsString, IsObject, IsDate, IsNumber } from 'class-validator';
import { Pool } from '../../pool/entities/pool.entity';

export class CreateUnstakeDto {
  @IsString()
  wallet: string;

  @IsString()
  hash: string;

  @IsObject()
  pool: Pool;

  @IsDate()
  unclaimDate: Date;

  @IsNumber()
  amount: Number;
  
}
