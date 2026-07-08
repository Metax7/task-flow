import type { NextConfig } from "next";
import { withGTConfig } from "gt-next/config";

const nextConfig: NextConfig = {
  cacheComponents: true,
};

export default withGTConfig(nextConfig, {
  getLocalePath: "./getLocale.ts",
  getRegionPath: "./getRegion.ts",
});
