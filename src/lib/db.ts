// Re-export the database connection and types for convenience
export { db, type Database } from './pg';
export { redis } from './redis';
export * from '../db/schema';
