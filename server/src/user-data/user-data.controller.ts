import { Controller, Get, Query } from '@nestjs/common';
import { UserDataService } from './user-data.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('user-data')
export class UserDataController {
  constructor(private readonly userDataService: UserDataService) {}

  @Get('clips')
  // @ApiQuery({
  //   name: 'Categories',
  //   required: false,
  //   example: 'Example record',
  //   description:
  //     'Return all selected stock data which saved in your categories. You can select the specific category to query. If no any categories name provided (empty input), return the stock data from all categories.',
  // })
  // @ApiQuery({
  //   name: 'apiKey',
  //   required: true,
  //   description: 'Your Api key',
  // })
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
