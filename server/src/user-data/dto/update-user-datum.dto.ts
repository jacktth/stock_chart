import { PartialType } from '@nestjs/swagger';
import { CreateUserDatumDto } from './create-user-datum.dto';

export class UpdateUserDatumDto extends PartialType(CreateUserDatumDto) {}
