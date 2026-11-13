/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@mui/icons-material"],
  images: {
    domains: ["metaschool.so"],
  },
  async headers() {
    return [
      {
        // Send UTF-8 in the Content-Type header for HTML pages, matching
        // the <meta charset="utf-8"> that Next.js emits first in <head>.
        source: "/((?!_next/|api/).*\\.html|[^.]*)",
        headers: [
          { key: "Content-Type", value: "text/html; charset=utf-8" },
        ],
      },
    ];
  },
};

export default nextConfig;
