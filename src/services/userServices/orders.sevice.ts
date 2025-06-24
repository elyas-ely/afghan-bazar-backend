import { desc, eq, sql } from 'drizzle-orm'
import { db } from '../../config/database'
import { orders } from '../../db/schema/orders'
import { addresses } from '../../db/schema/addresses'
import { products } from '../../db/schema/products'
import { reviews } from '../../db/schema/reviews'
import { saves } from '../../db/schema/saves'
import { orderItems } from '../../db/schema/order_items'

// =========================
// ====== GET ORDERS  =====
// =========================

export async function getUserOrders(userId: string) {
  const data = await db
    .select({
      order_id: orders.id,
      order_status: orders.order_status,
      payment_status: orders.payment_status,
      shipping_cost: orders.shipping_cost,
      total_price: orders.total_price,
      shipping_method: orders.shipping_method,
      tracking_number: orders.tracking_number,
      order_notes: orders.order_notes,
      expected_delivery_date: orders.expected_delivery_date,
      created_at: orders.created_at,
      updated_at: orders.updated_at,

      // Address
      address: {
        address_name: addresses.address_name,
        full_name: addresses.full_name,
        street_address: addresses.street_address,
        apartment: addresses.apartment,
        city: addresses.city,
        province: addresses.province,
        zip_code: addresses.zip_code,
        country: addresses.country,
        phone_number: addresses.phone_number,
      },

      // Product info via order_items
      product: {
        name: products.name,
        description: products.description,
        price: products.price,
        price_unit: products.price_unit,
        images: products.images,
        weights: products.weights,
        features: products.features,
        origin: products.origin,
        popular: products.popular,
        instructions: products.instructions,
        rating: sql<number>`COALESCE(ROUND(AVG(${reviews.rating})::numeric, 1), 0)`,
        is_saved: sql<boolean>`EXISTS (SELECT 1 FROM ${saves} WHERE ${saves.product_id} = ${products.id} AND ${saves.user_id} = ${userId})`,
      },

      quantity: orderItems.quantity,
      item_price: orderItems.price,
    })
    .from(orders)
    .where(eq(orders.user_id, userId))
    .innerJoin(addresses, eq(orders.shipping_address_id, addresses.id))
    .innerJoin(orderItems, eq(orderItems.order_id, orders.id))
    .innerJoin(products, eq(orderItems.product_id, products.id))
    .leftJoin(reviews, eq(reviews.product_id, products.id))
    .leftJoin(saves, eq(saves.product_id, products.id))
    .groupBy(orders.id, addresses.id, orderItems.id, products.id)
    .orderBy(desc(orders.created_at))

  return data
}
