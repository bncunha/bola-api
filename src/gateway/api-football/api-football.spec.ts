import { Test, TestingModule } from '@nestjs/testing';
import { ApiFootball } from './api-football';

describe('ApiFootball', () => {
  let provider: ApiFootball;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiFootball],
    }).compile();

    provider = module.get<ApiFootball>(ApiFootball);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
