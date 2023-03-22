import { Injectable } from '@nestjs/common';
import { CreateUserDatumDto } from './dto/create-user-datum.dto';
import { UpdateUserDatumDto } from './dto/update-user-datum.dto';

@Injectable()
export class UserDataService {
  create(createUserDatumDto: CreateUserDatumDto) {
    return 'This action adds a new userDatum';
  }

  findAll() {
    return `This action returns all userData`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userDatum`;
  }

  update(id: number, updateUserDatumDto: UpdateUserDatumDto) {
    return `This action updates a #${id} userDatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} userDatum`;
  }
}
