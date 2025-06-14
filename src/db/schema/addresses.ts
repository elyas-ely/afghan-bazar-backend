import { pgTable, varchar, serial, boolean, index } from 'drizzle-orm/pg-core'
import { timestamps } from '../columns.helpers'
import { users } from './users'
import { unique } from 'drizzle-orm/pg-core'

export const addresses = pgTable(
  'addresses',
  {
    id: serial('id').primaryKey(),

    user_id: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),

    address_name: varchar('address_name', { length: 100 }).notNull(),
    full_name: varchar('full_name', { length: 100 }).notNull(),
    street_address: varchar('street_address', { length: 255 }).notNull(),
    apartment: varchar('apartment', { length: 50 }),
    city: varchar('city', { length: 100 }).notNull(),
    province: varchar('province', { length: 100 }).notNull(),
    zip_code: varchar('zip_code', { length: 20 }).notNull(),
    country: varchar('country', { length: 100 }).notNull(),
    phone_number: varchar('phone_number', { length: 20 }).notNull(),
    is_default: boolean('is_default').default(false).notNull(),
    ...timestamps,
  },
  (table) => ({
    userIdx: index('idx_addresses_user_id').on(table.user_id),
    uniqueUserAddress: unique().on(table.user_id, table.address_name),
  })
)
