import { HttpModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ApiFootball } from './api-football';

@Module({
  imports: [HttpModule],
  providers: [ApiFootball]
})
export class ApiFootballModule {}
