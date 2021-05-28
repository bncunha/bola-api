import { Test, TestingModule } from '@nestjs/testing';
import { ParticipacoesController } from './participacoes.controller';
import { ParticipacoesService } from './participacoes.service';

describe('ParticipacoesController', () => {
  let controller: ParticipacoesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParticipacoesController],
      providers: [ParticipacoesService],
    }).compile();

    controller = module.get<ParticipacoesController>(ParticipacoesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
