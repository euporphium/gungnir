import 'server-only';
import { redis } from '../redis';

// NOTE: Better Auth uses Redis directly for secondaryStorage (auth sessions, tokens, etc.)
// This DAL is for application-specific Redis usage (caching, rate limiting, custom sessions)

// Cache DAL functions
export const cacheDAL = {
  async get(key: string): Promise<string | null> {
    try {
      return await redis.get(key);
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  },

  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    try {
      if (ttlSeconds) {
        await redis.set(key, value, { EX: ttlSeconds });
      } else {
        await redis.set(key, value);
      }
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  },

  async delete(key: string): Promise<boolean> {
    try {
      const result = await redis.del(key);
      return result > 0;
    } catch (error) {
      console.error('Redis DELETE error:', error);
      return false;
    }
  },

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result > 0;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  },

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    try {
      const result = await redis.expire(key, ttlSeconds);
      return result > 0;
    } catch (error) {
      console.error('Redis EXPIRE error:', error);
      return false;
    }
  },
};

// Application-specific session/data DAL functions (not auth sessions - those are handled by Better Auth)
export const appDataDAL = {
  async getUserPreferences(userId: string): Promise<string | null> {
    return await cacheDAL.get(`user_prefs:${userId}`);
  },

  async setUserPreferences(
    userId: string,
    preferences: string,
    ttlSeconds = 86400,
  ): Promise<boolean> {
    return await cacheDAL.set(`user_prefs:${userId}`, preferences, ttlSeconds);
  },

  async deleteUserPreferences(userId: string): Promise<boolean> {
    return await cacheDAL.delete(`user_prefs:${userId}`);
  },
};

// Rate limiting DAL functions
export const rateLimitDAL = {
  async increment(key: string, windowSeconds = 60): Promise<number> {
    try {
      const pipeline = redis.multi();
      pipeline.incr(key);
      pipeline.expire(key, windowSeconds);
      const results = await pipeline.exec();

      if (
        Array.isArray(results) &&
        Array.isArray(results[0]) &&
        results[0][0] == null && // No error
        typeof results[0][1] === 'number'
      ) {
        return results[0][1];
      }
      throw new Error('Unexpected Redis pipeline response');
    } catch (error) {
      console.error('Redis rate limit error:', error);
      return 0;
    }
  },

  async get(key: string): Promise<number> {
    try {
      const result = await redis.get(key);
      return result ? Number.parseInt(result, 10) : 0;
    } catch (error) {
      console.error('Redis rate limit get error:', error);
      return 0;
    }
  },

  async reset(key: string): Promise<boolean> {
    return await cacheDAL.delete(key);
  },
};
