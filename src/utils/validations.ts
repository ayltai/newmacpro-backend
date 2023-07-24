import { createRemoteJWKSet, jwtVerify, } from 'jose';

const verifyToken = async (token : string) => {
    const JWKS = createRemoteJWKSet(new URL(`https://${process.env.AUTH0_DOMAIN!}/.well-known/jwks.json`));

    const { payload : user, } = await jwtVerify(token, JWKS, {
        issuer : `https://${process.env.AUTH0_DOMAIN!}/`,
    });

    return user;
};

export const validateHeader = async (header : string | null) => header ? await verifyToken(header.replace(/Bearer /, '')) : false;
