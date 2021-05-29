import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ENTITITES from './models';
import MODULES from './modules';
import { AuthModule } from './security/auth/auth.module';
import { JwtAuthGuard } from './security/auth/jwt-auth.guard';

const getTypeormCofng = (): any => process.env.NODE_ENV == 'production' ? {
  url: process.env.CLEARDB_DATABASE_URL,
} : {
  host:  process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username:  process.env.DATABASE_USERNAME,
  password:  process.env.DATABASE_PASSWORD,
}
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => Object.assign(getTypeormCofng(), {
        type: 'mysql',
        timezone: 'Z',
        entities: ENTITITES,
        synchronize: false,
        database: process.env.DATABASE_DATABASE,
      })
    }),
    AuthModule,
    ...MODULES,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard  },
  ],
})
export class AppModule {}
