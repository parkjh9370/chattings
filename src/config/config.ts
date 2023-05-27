import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
  ),
});

function required(key: string, defaultValue = ''): string {
  if (!process.env[key] && typeof defaultValue === 'undefined') {
    throw new Error('Missing required environment variable: ' + key);
  }
  return process.env[key] || defaultValue;
}

export const config = {
  NODE_ENV: required('NODE_ENV'),
  REDIS: {
    HOST: required('REDIS_HOST'),
  },
  MONGO: {
    HOST: required('MONGO_HOST'),
    USER: required('MONGO_USER'),
    PASSWORD: required('MONGO_PASSWORD'),
  },
};
