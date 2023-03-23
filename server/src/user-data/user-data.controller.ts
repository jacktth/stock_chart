import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserDataService } from './user-data.service';
import { CreateUserDatumDto } from './dto/create-user-datum.dto';
import { UpdateUserDatumDto } from './dto/update-user-datum.dto';
import {  ApiQuery } from '@nestjs/swagger';

@Controller('user-data')
export class UserDataController {
  constructor(private readonly userDataService: UserDataService) {}

  @Post()
  create(@Body() createUserDatumDto: CreateUserDatumDto) {
    return this.userDataService.create(createUserDatumDto);
  }

  @Get()
  findAll() {
    return this.userDataService.findAll();
  }

  @Get('categories')
  @ApiQuery({
    name: 'apiKey',
    required: true,
    description:
      'This is your Api key',
  })
  findAllCategories(@Query('apiKey') query: string) {
    console.log("query",query);
    
    return this.userDataService.findAllCategories(query);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDatumDto: UpdateUserDatumDto,
  ) {
    return this.userDataService.update(+id, updateUserDatumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userDataService.remove(+id);
  }
}

