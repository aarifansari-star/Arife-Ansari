import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(), // Owner reference
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(), // 'Games' or 'Websites'
  image: text('image').notNull(),
  url: text('url').notNull(),
  isNew: boolean('is_new').default(false).notNull(),
  visible: boolean('visible').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  owner: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
}));
