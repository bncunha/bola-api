import { HttpModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ApiFootball } from './api-football';

@Module({
  imports: [HttpModule],
  providers: [ApiFootball],
  exports: [ApiFootball]
})
export class ApiFootballModule {}
