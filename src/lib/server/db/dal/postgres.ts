import 'server-only';
import { db } from '../pg';
import type { Database } from '../pg';

// NOTE: Auth-related tables (user, account, verification) are managed by Better Auth
// and should not be accessed directly through this DAL. Use Better Auth's API instead.

// This file is ready for your application-specific tables.
// Example structure for when you add your own tables:

/*
// Type definitions for your app tables
export type InsertYourTable = typeof yourTable.$inferInsert;
export type SelectYourTable = typeof yourTable.$inferSelect;

// Your table DAL functions
export const yourTableDAL = {
  async findById(id: string): Promise<SelectYourTable | undefined> {
    const result = await db.select().from(yourTable).where(eq(yourTable.id, id)).limit(1);
    return result[0];
  },

  async create(data: InsertYourTable): Promise<SelectYourTable> {
    const result = await db.insert(yourTable).values(data).returning();
    return result[0];
  },

  // Add more methods as needed...
};
*/

// Export database instance for direct queries when needed
export { db };
