import { kv, } from '@vercel/kv';

import { Cart, } from '@/types';

export const POST = async (request : Request) => {
    const cart : Cart = await request.json();

    await kv.hset(cart.id, cart);

    return new Response('Created', {
        status : 201,
    });
};
