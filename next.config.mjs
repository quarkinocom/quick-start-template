const imageSources = process.env.IMAGE_SOURCES || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...imageSources.split(",").map((source) => ({
        protocol: "https",
        hostname: source,
      })),
      // TODO - remove this
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
