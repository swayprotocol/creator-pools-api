import { IsBoolean, IsDate, IsNumber, IsObject, IsString } from 'class-validator';
import { Pool } from '../../pool/entities/pool.entity';

export class CreateClaimDto {
  @IsString()
  wallet: string;
  
  @IsObject()
  pool: Pool;

  @IsNumber()
  amount: number;

  @IsDate()
  claimDate: Date;
  
  @IsString()
  hash: string;
  
  @IsBoolean()
  unstaked: boolean;
}
