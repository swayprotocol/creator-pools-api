import { IsArray, IsBoolean, IsDate, IsNumber, IsObject, IsString } from 'class-validator';
import { Pool } from '../../pool/entities/pool.entity';
import { Stake } from '../../stake/entities/stake.entity';

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

  stakes: Stake[];
  
  @IsBoolean()
  unstaked: boolean;
}
