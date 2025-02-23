/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  eslint: {
    dirs: ["src"],
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000", // Add the port if your server runs on a specific port
        pathname: "/Products/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000", // Add the port if your server runs on a specific port
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "karnival-kookies-backend.onrender.com",
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
