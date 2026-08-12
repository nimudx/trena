import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the e2e production server build into its own directory instead of
  // `.next/`, which the `next dev` server (e.g. from `make dev`) already owns.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
};

export default nextConfig;
