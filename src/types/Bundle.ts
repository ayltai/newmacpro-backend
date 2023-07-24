import { Package, } from './Package';

export type Bundle = {
    id           : string,
    displayName  : string,
    description? : string,
    iconId?      : string,
    isPrivate    : boolean,
    viewCount    : number,
    createdBy    : string,
    createdAt    : string,
    updatedAt    : string,
    packages     : Package[],
};
