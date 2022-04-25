import { IsString, Min } from "class-validator";

export class CreatePoolDto {
  @IsString()
  creator: string;
  
  @Min(0,{
    message: 'Start time must be positive number'
  })
  startTime: number;
  
  @Min(0,{
    message: 'Total amount must be positive number'
  })
  totalAmount: number;
  
  @Min(0,{
    message: 'Number of stakes must be positive number'
  })
  numberOfStakes: number;
}
