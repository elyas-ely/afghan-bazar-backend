import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core'
import { timestamps } from '../columns.helpers'
import { users } from './users'
import { products } from './products'
import { index, unique } from 'drizzle-orm/pg-core'

export const saves = pgTable(
  'saves',
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
    uniqueUserProduct: unique().on(table.user_id, table.product_id),
    idxUser: index('idx_saves_user_id').on(table.user_id),
    idxProduct: index('idx_saves_product_id').on(table.product_id),
  })
)
