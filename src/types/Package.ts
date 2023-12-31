export type Package = {
    id                : string,
    displayName       : string,
    description?      : string,
    version?          : string,
    license?          : string,
    logoUrls?         : string[],
    screenshotUrls?   : string[],
    provider?         : string,
    website?          : string,
    monthlyDownloads? : number,
    userRating?       : number,
    userRatingCount?  : number,
    advisoryRating?   : string,
    price?            : string,
    source            : 'Homebrew/cask' | 'Homebrew/core' | 'App Store' | 'Tweak',
    value?            : string,
};
