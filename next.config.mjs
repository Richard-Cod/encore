// import {withSentryConfig} from '@sentry/nextjs';
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: "127.0.0.1"
          },
          {
            protocol: 'https',
            hostname: `thirdbucketricha.s3.eu-north-1.amazonaws.com`
          },
          {
            protocol: 'https',
            hostname: `thirdbucketricha.s3.amazonaws.com`
          },


          
        ]
      }
};

export default nextConfig;
