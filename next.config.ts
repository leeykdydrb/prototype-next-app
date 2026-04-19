import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  output: 'standalone',
  // // Prisma 관련 패키지를 standalone 빌드에 포함
  // serverExternalPackages: [
  //   '@prisma/client',
  //   '@prisma/adapter-pg',
  // ],
  // // Prisma 생성 파일을 standalone 빌드에 포함
  // outputFileTracingIncludes: {
  //   '/**': ['./prisma/generated/**/*'],
  // },
};

export default withNextIntl(nextConfig);
