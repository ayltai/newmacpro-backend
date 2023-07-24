import { headers, } from 'next/headers';

import { validateHeader, } from '@/utils/validations';

type EnrichedHeader = {
    signedIn : boolean,
    userId?  : string,
};

export const enrichHeader : () => Promise<EnrichedHeader> = async () => {
    const requestHeaders = headers();

    const authorization : string | null = requestHeaders.get('Authorization');

    const signedIn = await validateHeader(authorization);

    return {
        signedIn : Boolean(signedIn),
        userId   : signedIn ? signedIn.email as string : undefined,
    };
};
