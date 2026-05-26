/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cathrine.co",
        pathname: "/_astro/**",
      },
    ],
  },
};

export default nextConfig;
