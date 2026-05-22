/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from Spoonacular's CDN
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.spoonacular.com",
        pathname: "/recipes/**",
      },
    ],
  },
};

module.exports = nextConfig;
