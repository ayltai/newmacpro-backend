/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode : true,
    headers         : async () => [
        {
            source  : '/(.*)',
            headers : [
                {
                    key   : 'Access-Control-Allow-Origin',
                    value : process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://newmac.pro',
                },
            ],
        },
    ],
};

module.exports = nextConfig;
