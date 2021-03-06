import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import MODULES from './modules';
import { AuthModule } from './security/auth/auth.module';
import { JwtAuthGuard } from './security/auth/jwt-auth.guard';
import * as connectionOptions from './ormconfig';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(connectionOptions as any),
    AuthModule,
    ScheduleModule.forRoot(),
    JobsModule,
    ...MODULES,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard  },
  ],
})
export class AppModule {}
