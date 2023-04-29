import { Controller, Get, Query } from '@nestjs/common';
import { UserDataService } from './user-data.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('user-data')
export class UserDataController {
  constructor(private readonly userDataService: UserDataService) {}

  @Get('clips')
  findAllClips(
    @Query('apiKey') apiKey: string,
    @Query('categories') categories: string[],
  ) {
    return this.userDataService.findAllClips({
      apikey: apiKey,
      categories: categories,
    });
  }

  @Get('categories')
  findAllCategories(@Query('apiKey') query: string) {
    return this.userDataService.findAllCategories(query);
  }
}
