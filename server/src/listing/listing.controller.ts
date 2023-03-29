import { Controller, Get, Query } from '@nestjs/common';
import { ListingService } from './listing.service';

export class getListingParam {
  market: string;
}

@Controller()
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Get('listing')
  getList(@Query()param:getListingParam) {    
    return this.listingService.getList(param);
  }

  @Get('allListings')
  getAllLists() {    
    return this.listingService.getAllLists();
  }
}
