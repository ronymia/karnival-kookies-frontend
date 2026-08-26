/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/Products/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "karnival-kookies-backend.onrender.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "backend.karnivalkookies.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
