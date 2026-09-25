import type { NextConfig } from "next";
import { IMAGE_HOSTS } from "./lib/imageHosts";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: IMAGE_HOSTS.map((hostname) => ({ protocol: "https", hostname })),
  },
};

export default nextConfig;
