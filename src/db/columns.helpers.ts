import { timestamp } from 'drizzle-orm/pg-core'

// columns.helpers.ts
export const timestamps = {
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
}
