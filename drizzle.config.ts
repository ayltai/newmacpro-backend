import type { Config, } from 'drizzle-kit';

export default {
    schema : [
        './src/data/schemas/bundles.ts',
        './src/data/schemas/packages.ts',
    ],
    out    : './db-migrations',
} satisfies Config;
