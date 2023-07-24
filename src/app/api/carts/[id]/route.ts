import { promises, } from 'fs';
import path from 'path';
import { kv, } from '@vercel/kv';
import { render, } from 'ejs';

import type { Cart, } from '@/types';

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

    const cart : Cart | null = await kv.hgetall(params.id);

    if (cart) {
        const template = (await promises.readFile(path.join(process.cwd(), 'public/data/install.sh.ejs'))).toString();

        const script = render(template, {
            items : cart.packages,
        });

        return new Response(script);
    }

    return new Response(`Not found - ${params.id}`, {
        status : 404,
    });
};
