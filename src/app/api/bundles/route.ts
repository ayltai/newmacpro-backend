import { sql as postgres, } from '@vercel/postgres';
import { desc, eq, or, } from 'drizzle-orm';
import { drizzle, } from 'drizzle-orm/vercel-postgres';
import { NextResponse, } from 'next/server';

import { migrations, } from '@/data';
import * as schema from '@/data/schemas';
import { BundleModel, bundles, packages, } from '@/data/schemas';
import type { Bundle, } from '@/types';
import { enrichHeader, } from '@/utils';

const database = drizzle(postgres, {
    schema,
});

export const GET = async () => {
    await migrations();

    const { signedIn, userId, } = await enrichHeader();

    const results : BundleModel[] = await database.query.bundles.findMany({
        where   : signedIn ? or(eq(bundles.isPrivate, false), eq(bundles.createdBy, userId!)) : eq(bundles.isPrivate, false),
        with    : {
            packages : true,
        },
        orderBy : [
            desc(bundles.viewCount),
        ],
    });

    return NextResponse.json(results.map(result => ({
        ...result,
        createdAt : result.createdAt.toISOString(),
        updatedAt : result.updatedAt.toISOString(),
    })));
};

export const POST = async (request : Request) => {
    await migrations();

    const { signedIn, userId, } = await enrichHeader();

    if (!signedIn) return new Response('Unauthorized', {
        status : 401,
    });

    const newBundle : Bundle = await request.json();

    await database.transaction(async transaction => {
        await transaction.insert(bundles).values({
            id          : newBundle.id,
            displayName : newBundle.displayName,
            description : newBundle.description,
            iconId      : newBundle.iconId,
            isPrivate   : newBundle.isPrivate,
            createdBy   : userId!,
        });

        await transaction.insert(packages).values(newBundle.packages.map(pkg => ({
            bundleId         : newBundle.id,
            id               : pkg.id,
            displayName      : pkg.displayName,
            description      : pkg.description,
            version          : pkg.version,
            license          : pkg.license,
            logoUrls         : pkg.logoUrls?.join('|'),
            screenshotUrls   : pkg.screenshotUrls?.join('|'),
            provider         : pkg.provider,
            website          : pkg.website,
            monthlyDownloads : pkg.monthlyDownloads,
            userRating       : pkg.userRating,
            userRatingCount  : pkg.userRatingCount,
            advisoryRating   : pkg.advisoryRating,
            price            : pkg.price,
            source           : pkg.source,
            value            : pkg.value,
        })));
    });

    return new Response('Created', {
        status : 201,
    });
};
