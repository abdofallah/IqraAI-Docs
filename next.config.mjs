import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/:lang/:path*.md',
        destination: '/llms.md/docs/:lang/:path*',
      },
    ];
  },
};

export default withMDX(config);