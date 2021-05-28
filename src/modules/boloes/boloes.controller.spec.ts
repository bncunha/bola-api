import { Test, TestingModule } from '@nestjs/testing';
import { BoloesController } from './boloes.controller';
import { BoloesService } from './boloes.service';

describe('BoloesController', () => {
  let controller: BoloesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoloesController],
      providers: [BoloesService],
    }).compile();

    controller = module.get<BoloesController>(BoloesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
