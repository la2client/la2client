import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ypfym9di6upxqhdq.public.blob.vercel-storage.com',
                port: '',
            },
        ],
    },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
