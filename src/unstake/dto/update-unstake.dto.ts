import { PartialType } from '@nestjs/mapped-types';
import { CreateUnstakeDto } from './create-unstake.dto';

export class UpdateUnstakeDto extends PartialType(CreateUnstakeDto) {}
