er// // PRODUCTS TABLEp// export const products = pgTable(
//   'products',
//   {
//     id: serial('id').primaryKey(),
//     name: varchar('name', { length: 255 }).notNull(),
//     description: text('description').notNull(),
//     price: numeric('price', { precision: 10, scale: 2 }).notNull(),
//     popular: boolean('popular').default(false),
//     price_unit: varchar('price_unit', { length: 50 }),
//     weights: varchar('weights', { length: 10 }).array(),
//     features: text('features').array(),
//     origin: varchar('origin', { length: 100 }),
//     instructions: text('instructions'),
//     images: text('images')
//       .array()
//       .notNull()
//       .default(sql`ARRAY[]::text[]`),
//     category_id: integer('category_id')
//       .notNull()
//       .references(() => categories.id, {
//         onDelete: 'cascade',
//         onUpdate: 'cascade',
//       }),
//     created_at: timestamp('created_at').notNull().defaultNow(),
//     updated_at: timestamp('updated_at').notNull().defaultNow(),
//   },
//   (table) => ({
//     idxCategory: index('idx_products_category_id').on(table.category_id),
//     idxPopular: index('idx_products_popular').on(table.popular),
//     idxName: index('idx_products_name').on(table.name),
//   })
// ) 
// // REVIEWS TABLE
// export const reviews = pgTable(
//   'reviews',
//   {
//     id: serial('id').primaryKey(),
//     product_id: integer('product_id')
//       .notNull()
//       .references(() => products.id, {
//         onUpdate: 'cascade',
//         onDelete: 'cascade',
//       }),
//     user_id: varchar('user_id', { length: 255 })
//       .notNull()
//       .references(() => users.id, {
//         onUpdate: 'cascade',
//         onDelete: 'cascade',
//       }),
//     rating: numeric('rating', { precision: 2, scale: 1 }).notNull(),

//     images: text('images')
//       .array()
//       .notNull()
//       .default(sql`ARRAY[]::text[]`),
//     comment: text('comment').notNull(),
//     created_at: timestamp('created_at').notNull().defaultNow(),
//     updated_at: timestamp('updated_at').notNull().defaultNow(),
//   },
//   (table) => ({
//     uniqueUserProduct: unique().on(table.user_id, table.product_id),
//     idxProduct: index('idx_reviews_product_id').on(table.product_id),
//     idxUser: index('idx_reviews_user_id').on(table.user_id),
//   })
// )

 category_id: integer('category_id').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

// REVIEWS TABLE
export const reviews = pgTable(
  'reviews',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    product_id: integer('product_id')
      .notNull()
      .references(() => products.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    user_id: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    rating: numeric('rating', { precision: 2, scale: 1 }).notNull(),
    images: text('images')
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    comment: text('comment').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    uniqueUserProduct: unique().on(table.user_id, table.product_id),
  })
)

