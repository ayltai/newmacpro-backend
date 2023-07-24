import { InferModel, relations, } from 'drizzle-orm';
import { integer, pgEnum, pgTable, primaryKey, uuid, varchar, } from 'drizzle-orm/pg-core';

import { bundles, } from './bundles';

export const sourceEnum = pgEnum('source', [
    'Homebrew/cask',
    'Homebrew/core',
    'App Store',
    'Tweak',
]);

export const packages = pgTable('packages', {
    bundleId         : uuid('bundle_id').notNull().references(() => bundles.id, {
        onDelete : 'cascade',
        onUpdate : 'cascade',
    }),
    id               : varchar('id').notNull(),
    displayName      : varchar('display_name').notNull().default(''),
    description      : varchar('description'),
    version          : varchar('version', {
        length : 32,
    }),
    license          : varchar('license', {
        length : 128,
    }),
    logoUrls         : varchar('logo_urls'),
    screenshotUrls   : varchar('screenshot_urls'),
    provider         : varchar('provider', {
        length : 128,
    }),
    website          : varchar('website'),
    monthlyDownloads : integer('monthly_downloads').notNull().default(0),
    userRating       : integer('user_rating'),
    userRatingCount  : integer('user_rating_count').notNull().default(0),
    advisoryRating   : varchar('advisory_rating', {
        length : 32,
    }),
    price            : varchar('price', {
        length : 32,
    }),
    source           : sourceEnum('source').notNull(),
    value            : varchar('value', {
        length : 128,
    }),
}, (table) => ({
    pk : primaryKey(table.bundleId, table.id),
}));

export type PackageModel = InferModel<typeof packages>;

export const packagesRelations = relations(packages, ({
    one,
}) => ({
    bundle : one(bundles, {
        fields     : [
            packages.bundleId,
        ],
        references : [
            bundles.id,
        ],
    }),
}));
