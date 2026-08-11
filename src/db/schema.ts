import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, doublePrecision, boolean } from 'drizzle-orm/pg-core';

// Users table linked to Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  fullName: text('full_name'),
  role: text('role').default('Opérateur Terrain'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Movements table storing HSE GPS tracking records
export const movements = pgTable('movements', {
  id: serial('id').primaryKey(),
  recordId: text('record_id').notNull().unique(), // e.g., REC-001 or GAS-123
  userId: integer('user_id').references(() => users.id),
  plant: text('plant').notNull(), // 'OGGAZ' | 'M\'SILA' | 'CILAS'
  agentId: text('agent_id').notNull(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  role: text('role').notNull(),
  phone: text('phone'),
  timeIn: text('time_in').notNull(),
  timeOut: text('time_out'),
  lat: doublePrecision('lat').notNull(),
  lon: doublePrecision('lon').notNull(),
  zone: text('zone').notNull(),
  observation: text('observation').notNull(),
  riskLevel: text('risk_level').notNull(), // 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH'
  helmetOk: boolean('helmet_ok').default(true),
  vestOk: boolean('vest_ok').default(true),
  bootsOk: boolean('boots_ok').default(true),
  gogglesOk: boolean('goggles_ok').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  movements: many(movements),
}));

export const movementsRelations = relations(movements, ({ one }) => ({
  author: one(users, {
    fields: [movements.userId],
    references: [users.id],
  }),
}));
