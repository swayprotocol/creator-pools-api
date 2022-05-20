import { IsDate, IsHash, IsString, Min } from 'class-validator';

export class CreatePoolDto {
  @IsString()
  creator: string;
  
  @IsDate()
  startTime: Date;

  @IsString()
  hash: string;
}
