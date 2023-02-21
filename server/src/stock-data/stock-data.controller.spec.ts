import { Test, TestingModule } from '@nestjs/testing';
import { StockDataController } from './stock-data.controller';

describe('StockDataController', () => {
  let controller: StockDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockDataController],
    }).compile();

    controller = module.get<StockDataController>(StockDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
