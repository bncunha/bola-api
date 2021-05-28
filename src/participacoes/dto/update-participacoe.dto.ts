import { PartialType } from '@nestjs/mapped-types';
import { CreateParticipacoeDto } from './create-participacoe.dto';

export class UpdateParticipacoeDto extends PartialType(CreateParticipacoeDto) {}
