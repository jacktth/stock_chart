import { Controller, Get, Query } from '@nestjs/common';
import { UserDataService } from './user-data.service';
import { CreateUserDatumDto } from './dto/create-user-datum.dto';
import { UpdateUserDatumDto } from './dto/update-user-datum.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('user-data')
export class UserDataController {
  constructor(private readonly userDataService: UserDataService) {}

  @Get('clips')
  @ApiQuery({
    name: 'categories',
    required: false,
    example: "you could add ['Example record'] while in query's parameter, if you try it out here,only need to input Example record or leave it empty",
    description:
      'Return all selected stock data which saved in the categories. You can select the specific category to query. If no any categories name provided (empty input), return the selected stock data from all categories.',
  })
  @ApiQuery({
    name: 'apiKey',
    required: true,
    description: 'Your Api key',
  })
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
  @ApiQuery({
    name: 'apiKey',
    required: true,
    description: "Return all categories' name",
  })
  findAllCategories(@Query('apiKey') query: string) {
    return this.userDataService.findAllCategories(query);
  }
}
