/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/whisper_web' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/whisper_web/' : '',
  /* config options here */
};

module.exports = nextConfig; 