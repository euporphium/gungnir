import { pgTable, serial, text, uuid } from 'drizzle-orm/pg-core';

// Import and re-export auth tables from auth-schema.ts
import { user, account, verification } from './auth-schema';
export { user, account, verification };

type GameId = number & { __brand: 'game_id' };
export const game = pgTable('game', {
  id: serial('id').$type<GameId>().primaryKey(),
  key: uuid('key').notNull().unique(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});
