import { config as configEnv } from 'dotenv';

export interface Config {
  db: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  redis: {
    host: string;
    port: number;
  };
  auth: {
    secret: string;
  };
}

const configs: {
  development: Config;
  test: Config;
  production: Config;
} = {
  development: {
    db: {
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USER_NAME,
      password: process.env.DB_USER_PASSWORD,
      database: 'capstone_project',
    },
    redis: {
      host: 'localhost',
      port: 6379,
    },
    auth: {
      secret: 'some-dev-secret',
    },
  },
  test: {
    db: {
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USER_NAME,
      password: process.env.DB_USER_PASSWORD,
      database: 'capstone_project',
    },
    redis: {
      host: 'localhost',
      port: 6379,
    },
    auth: {
      secret: 'some-dev-secret',
    },
  },
  production: {
    db: {
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USER_NAME,
      password: process.env.DB_USER_PASSWORD,
      database: 'capstone_project',
    },
    redis: {
      host: 'localhost',
      port: 6379,
    },
    auth: {
      secret: 'some-dev-secret',
    },
  },
};

const getConfig = (): Config => {
  configEnv();

  if (!process.env.NODE_ENV) {
    throw new Error(
      'Env parameter NODE_ENV must be specified! Possible values are "development", "test", "production"',
    );
  }

  const env = process.env.NODE_ENV as 'development';

  if (!configs[env]) {
    throw new Error('Unsupported NODE_ENV value was provided! Possible values are "development", "test", "production"');
  }

  configs.development.db.username = process.env.DB_USER_NAME;
  configs.development.db.password = process.env.DB_USER_PASSWORD;

  configs.production.db.username = process.env.DB_USER_NAME;
  configs.production.db.password = process.env.DB_USER_PASSWORD;

  return configs[env];
};

export const config = getConfig();
