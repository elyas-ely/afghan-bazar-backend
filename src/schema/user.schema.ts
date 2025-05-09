import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
