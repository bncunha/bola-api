import { Test, TestingModule } from '@nestjs/testing';
import { PalpitesController } from './palpites.controller';
import { PalpitesService } from './palpites.service';

describe('PalpitesController', () => {
  let controller: PalpitesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PalpitesController],
      providers: [PalpitesService],
    }).compile();

    controller = module.get<PalpitesController>(PalpitesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
