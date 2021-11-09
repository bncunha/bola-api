import ENTITITES from "./models";
import * as dotenv from 'dotenv';
import * as fs from 'fs';

const envConfig = dotenv.parse(fs.readFileSync('.env'));

const env = {
  url: process.env.CLEARDB_DATABASE_URL || envConfig.CLEARDB_DATABASE_URL,
  host: process.env.DATABASE_HOST || envConfig.DATABASE_HOST,
  port: process.env.DATABASE_PORT || envConfig.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME || envConfig.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD || envConfig.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE || envConfig.DATABASE_DATABASE,
}


const dynamicConfig = process.env.NODE_ENV == 'production' ? {
  url: env.url,
} : {
  host:  env.host,
  port: Number(env.port),
  username:  env.username,
  password:  env.password,
};

const connectionOptions = {...dynamicConfig,
  ...{
    type: 'mysql',
    timezone: 'Z',
    entities: ENTITITES,
    synchronize: false,
    database: env.database,
    migrations: ['dist/migration/*.js'],
    cli: {
      migrationsDir: 'src/migration'
    },
  }
}

export = connectionOptions;