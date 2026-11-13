/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@mui/icons-material"],
  images: {
    domains: ["metaschool.so"],
  },
  async headers() {
    return [
      {
        // Cache heavy static media so repeat visits don't re-download it
        source: "/:file(.*\\.(?:gif|png|webp|avif|jpg|jpeg|woff|woff2))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
