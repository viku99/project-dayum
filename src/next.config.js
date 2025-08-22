/** @type {import('next').NextConfig} */
const isExport = process.env.EXPORT_MODE === "true";

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,

  images: {
    // use optimized images normally, but disable when statically exporting
    unoptimized: isExport,
    domains: ["firebasestorage.googleapis.com"],
  },

  ...(isExport
    ? {
        output: "export",
        distDir: "out",
      }
    : {}),
};

module.exports = nextConfig;
