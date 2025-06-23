import { integer, pgTable, serial } from 'drizzle-orm/pg-core'
import { numeric } from 'drizzle-orm/pg-core'
import { orders } from './orders'
import { products } from './products'
import { timestamps } from '../columns.helpers'

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  product_id: integer('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  ...timestamps,
})
