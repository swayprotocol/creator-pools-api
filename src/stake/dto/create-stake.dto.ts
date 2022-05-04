import { IsMongoId, IsNumber, IsString } from "class-validator";


export class CreateStakeDto {
  @IsMongoId()
  planId: string;
  
  @IsMongoId()
  poolId: string;

  @IsNumber()
  amount: number;

  @IsString()
  wallet: string;
}
