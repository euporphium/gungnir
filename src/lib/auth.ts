import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { anonymous } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { db } from './pg';
import { redis } from './redis';

export const auth = betterAuth({
  advanced: {
    cookiePrefix: 'gungnir',
    useSecureCookies: true,
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  secondaryStorage: {
    get: async (key) => {
      return await redis.get(key);
    },
    set: async (key, value, ttl) => {
      if (ttl) await redis.set(key, value, { EX: ttl });
      else await redis.set(key, value);
    },
    delete: async (key) => {
      await redis.del(key);
    },
  },
  plugins: [anonymous(), nextCookies()],
});
