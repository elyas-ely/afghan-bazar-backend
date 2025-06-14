import {
  pgTable,
  varchar,
  serial,
  integer,
  unique,
  index,
} from 'drizzle-orm/pg-core'
import { users } from './users'
import { products } from './products'
import { timestamps } from '../columns.helpers'

// VIEWED PRODUCTS TABLE
export const viewed_products = pgTable(
  'viewed_products',
  {
    id: serial('id').primaryKey(),
    user_id: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),

    product_id: integer('product_id')
      .notNull()
      .references(() => products.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),

    ...timestamps,
  },
  (table) => ({
    idxUser: index('idx_viewed_products_user_id').on(table.user_id),
    idxProduct: index('idx_viewed_products_product_id').on(table.product_id),
    uniqueUserProduct: unique().on(table.user_id, table.product_id),
  })
)
