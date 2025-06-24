import { pgTable, varchar, integer, numeric, serial } from 'drizzle-orm/pg-core'
import { users } from './users'
import { addresses } from './addresses'
import { timestamps } from '../columns.helpers'
import { timestamp } from 'drizzle-orm/pg-core'
import { index } from 'drizzle-orm/pg-core'
import { products } from './products'

export const orders = pgTable(
  'orders',
  {
    id: serial('id').primaryKey(),

    user_id: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),

    product_id: integer('product_id')
      .notNull()
      .references(() => products.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),

    order_status: varchar('order_status', { length: 50 }).notNull(),
    payment_status: varchar('payment_status', { length: 50 }).notNull(),

    shipping_address_id: integer('shipping_address_id')
      .notNull()
      .references(() => addresses.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),

    shipping_cost: numeric('shipping_cost', {
      precision: 10,
      scale: 2,
    }).notNull(),
    total_price: numeric('total_price', { precision: 10, scale: 2 }).notNull(),

    shipping_method: varchar('shipping_method', { length: 100 }),

    // Optional additions
    tracking_number: varchar('tracking_number', { length: 255 }),
    order_notes: varchar('order_notes', { length: 500 }),
    expected_delivery_date: timestamp('expected_delivery_date'),
    ...timestamps,
  },
  (orders) => ({
    userIdIndex: index('orders_user_id_idx').on(orders.user_id),
    statusIndex: index('orders_status_idx').on(orders.order_status),
    createdAtIndex: index('orders_created_at_idx').on(orders.created_at),
    shippingAddressIndex: index('orders_shipping_address_idx').on(
      orders.shipping_address_id
    ),
    productIdIndex: index('orders_product_id_idx').on(orders.product_id),
  })
)
