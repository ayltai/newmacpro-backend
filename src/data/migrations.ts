import { sql as postgres, } from '@vercel/postgres';
import { drizzle, } from 'drizzle-orm/vercel-postgres';
import { migrate, } from 'drizzle-orm/vercel-postgres/migrator';

export const migrations = async () => {
    if (process.env.NODE_ENV === 'development') {
        const database = drizzle(postgres);

        await migrate(database, {
            migrationsFolder : 'db-migrations',
        });
    }
};
