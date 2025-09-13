import 'server-only';
import { eq, count } from 'drizzle-orm';
import { db } from '../pg';
import type { Database } from '../pg';
import { game } from '../schema';

// NOTE: Auth-related tables (user, account, verification) are managed by Better Auth
// and should not be accessed directly through this DAL. Use Better Auth's API instead.

// Type definitions for game table
export type InsertGame = typeof game.$inferInsert;
export type SelectGame = typeof game.$inferSelect;

// Game table DAL functions
export const gameDAL = {
  async findById(id: number): Promise<SelectGame | undefined> {
    const result = await db
      .select()
      .from(game)
      .where(eq(game.id, id as SelectGame['id']))
      .limit(1);
    return result[0];
  },

  async findByKey(key: string): Promise<SelectGame | undefined> {
    const result = await db
      .select()
      .from(game)
      .where(eq(game.key, key))
      .limit(1);
    return result[0];
  },

  async create(data: InsertGame): Promise<SelectGame> {
    const result = await db.insert(game).values(data).returning();
    return result[0];
  },

  async update(
    id: number,
    data: Partial<InsertGame>,
  ): Promise<SelectGame | undefined> {
    const result = await db
      .update(game)
      .set(data)
      .where(eq(game.id, id as SelectGame['id']))
      .returning();
    return result[0];
  },

  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(game)
      .where(eq(game.id, id as SelectGame['id']));
    return (result.rowCount ?? 0) > 0;
  },

  async list(limit = 50, offset = 0): Promise<SelectGame[]> {
    return db.select().from(game).limit(limit).offset(offset);
  },

  async findByUserId(
    userId: string,
    limit = 50,
    offset = 0,
  ): Promise<SelectGame[]> {
    return db
      .select()
      .from(game)
      .where(eq(game.userId, userId))
      .limit(limit)
      .offset(offset);
  },

  async countByUserId(userId: string): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(game)
      .where(eq(game.userId, userId));
    return result[0].count;
  },
};

// Export database instance for direct queries when needed
export { db };
