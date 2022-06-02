import { IsDate, IsMongoId, IsNumber, IsString } from 'class-validator';


export class CreateStakeDto {
  @IsMongoId()
  pool: string;

  @IsNumber()
  amount: number;
  
  @IsDate()
  stakedAt: Date;

  @IsString()
  wallet: string;

  @IsString()
  hash: string;
}
