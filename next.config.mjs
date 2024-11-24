/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000", // Add the port if your server runs on a specific port
        pathname: "/Products/**",
      },
      {
        protocol: "https",
        hostname: "pastry-shop-backend-production.up.railway.app",
        pathname: "/**", // Adjust the path as needed for your backend
      },
      {
        protocol: "https",
        hostname: "backend.karnivalkookies.com",
        pathname: "/**", // Adjust the path as needed for your backend
      },
    ],
  },
};

export default nextConfig;
