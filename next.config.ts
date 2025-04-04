import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		serverComponentsHmrCache: false, // defaults to true
	},
	/* config options here */
};

export default nextConfig;
