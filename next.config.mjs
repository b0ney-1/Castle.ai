/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@mui/icons-material"],
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
