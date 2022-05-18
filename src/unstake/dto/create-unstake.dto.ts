import { IsString, IsObject, IsDate } from 'class-validator';
import { Claim } from '../../claim/entities/claim.entity';
import { Pool } from '../..//pool/entities/pool.entity';
import { Stake } from '../..//stake/entities/stake.entity';

export class CreateUnstakeDto {
  @IsString()
  wallet: string;

  @IsString()
  hash: string;

  @IsObject()
  pool: Pool;

  @IsDate()
  unclaimDate: Date;
  
  stakes: Stake[];
  
  claims: Claim[];
}
