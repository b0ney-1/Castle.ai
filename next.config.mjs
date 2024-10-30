/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@mui/icons-material"],
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    domains: ["metaschool.so"],
  },
};

export default nextConfig;
