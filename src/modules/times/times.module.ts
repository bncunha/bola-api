import { Module } from '@nestjs/common';
import { TimesService } from './times.service';
import { TimesController } from './times.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Time } from 'src/models/Time';

@Module({
  imports: [TypeOrmModule.forFeature([Time])],
  controllers: [TimesController],
  providers: [TimesService],
  exports: [TimesService]
})
export class TimesModule {}
