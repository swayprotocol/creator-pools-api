import {
  IsInt,
  Min,
  IsDateString,
} from 'class-validator';
export class CreatePlanDto {
  @IsInt()
  @Min(0,{
    message: 'Apy must be positive number'
  })
  apy: number;
  
  @IsDateString()
  availableUntil: Date;
  
  @IsInt()
  @Min(0,{
    message: 'LockMonths must be positive number'
  })
  lockMonths: number;
}
