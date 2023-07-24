import { sql as postgres, } from '@vercel/postgres';
import { and, eq, sql, } from 'drizzle-orm';
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

export const GET = async (request : Request, {
    params,
} : {
    params : {
        id : string,
    },
}) => {
    if (!params.id) return new Response('Bad request', {
        status : 400,
    });

    await migrations();

    const { signedIn, userId, } = await enrichHeader();

    const result : BundleModel | undefined = await database.query.bundles.findFirst({
        where : signedIn ? and(eq(bundles.id, params.id), eq(bundles.createdBy, userId!)) : and(eq(bundles.isPrivate, false), eq(bundles.id, params.id)),
        with  : {
            packages : true,
        },
    });

    return result ? NextResponse.json({
        ...result,
        createdAt : result.createdAt.toISOString(),
        updatedAt : result.updatedAt.toISOString(),
    }) : new Response('Not found', {
        status : 404,
    });
};

export const PUT = async (request : Request) => {
    await migrations();

    const { signedIn, userId, } = await enrichHeader();

    if (!signedIn) return new Response('Unauthorized', {
        status : 401,
    });

    const newBundle : Bundle = await request.json();

    const bundle : BundleModel | undefined = await database.query.bundles.findFirst({
        where : and(eq(bundles.id, newBundle.id), eq(bundles.createdBy, userId!)),
    });

    if (!bundle) return new Response('Unauthorized', {
        status : 401,
    });

    await database.transaction(async transaction => {
        await transaction.delete(packages).where(eq(packages.bundleId, newBundle.id));

        await transaction.update(bundles).set({
            displayName : newBundle.displayName,
            description : newBundle.description,
            iconId      : newBundle.iconId,
            isPrivate   : newBundle.isPrivate,
            updatedAt   : sql`now()`,
        }).where(eq(bundles.id, newBundle.id));

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

    return new Response('OK');
};

export const DELETE = async (request : Request, {
    params,
} : {
    params : {
        id : string,
    },
}) => {
    if (!params.id) return new Response('Bad request', {
        status : 400,
    });

    await migrations();

    const { signedIn, userId, } = await enrichHeader();

    if (!signedIn) return new Response('Unauthorized', {
        status : 401,
    });

    const newBundle : Bundle = await request.json();

    const bundle : BundleModel | undefined = await database.query.bundles.findFirst({
        where : and(eq(bundles.id, newBundle.id), eq(bundles.createdBy, userId!)),
    });

    if (!bundle) return new Response('Unauthorized', {
        status : 401,
    });

    await database.delete(bundles).where(and(eq(bundles.id, params.id), eq(bundles.createdBy, userId!)));

    return new Response('OK');
};
