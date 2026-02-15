import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { desc, relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updateAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
})

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updateAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
})

export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
})

export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  comments: many(comments),
}))

export const productsRelations = relations(products, ({ one, many }) => ({
  user: one(users, {
    fields: [products.userId],
    references: [users.id],
  }),
  comments: many(comments),
}))

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [comments.productId],
    references: [products.id],
  }),
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert

export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert
