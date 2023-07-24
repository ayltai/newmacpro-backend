import { InferModel, relations, sql, } from 'drizzle-orm';
import { boolean, index, integer, pgTable, timestamp, uuid, varchar, } from 'drizzle-orm/pg-core';

import { packages, } from './packages';

export const bundles = pgTable('bundles', {
    id          : uuid('id').notNull().primaryKey(),
    displayName : varchar('display_name').notNull(),
    description : varchar('description'),
    iconId      : varchar('icon_id', {
        length : 32,
    }),
    isPrivate   : boolean('is_private').notNull().default(false),
    viewCount   : integer('download_count').notNull().default(0),
    createdBy   : varchar('created_by', {
        length : 256,
    }).notNull(),
    createdAt   : timestamp('created_at').notNull().default(sql`now()`),
    updatedAt   : timestamp('updated_at').notNull().default(sql`now()`),
}, (table) => ({
    displayNameIdx : index('display_name_idx').on(table.displayName),
    descriptionIdx : index('description_idx').on(table.description),
    viewCountIdx   : index('view_count_idx').on(table.viewCount),
    createdByIdx   : index('created_by_idx').on(table.createdBy),
    updatedAtIdx   : index('updated_at_idx').on(table.updatedAt),
}));

export type BundleModel = InferModel<typeof bundles>;

export const bundlesRelations = relations(bundles, ({
    many,
}) => ({
    packages : many(packages),
}));
