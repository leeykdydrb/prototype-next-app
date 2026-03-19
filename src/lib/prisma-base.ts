import { PrismaClient, Prisma } from "~prisma/client";
import type { SqlDriverAdapterFactory } from "@prisma/driver-adapter-utils";

type GlobalWithPrisma = typeof globalThis & {
  prisma?: PrismaClient;
};

const globalForPrisma = globalThis as GlobalWithPrisma;

/**
 * 실제 PrismaClient를 생성하는 베이스 함수
 * - adapter: SqlDriverAdapterFactory 인스턴스
 */
function createPrismaClientWithAdapter(adapter: SqlDriverAdapterFactory) {
  const options: Prisma.PrismaClientOptions = {
    adapter,
    log: process.env.NODE_ENV === "development" 
      ? ["query", "error", "warn"] 
      : ["error"],
    errorFormat: "pretty",
  };
  
  return new PrismaClient(options);
}

/**
 * 각 DB별 prisma.ts에서 adapterFactory만 넘기면
 * 공통적으로 globalThis 캐싱 + PrismaClient 생성 처리
 */
export function getPrisma(adapterFactory: () => SqlDriverAdapterFactory) {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("❌ DATABASE_URL 환경 변수가 설정되어 있지 않습니다.");
  }

  // production에서는 매번 새 클라이언트 생성 (globalThis 안 씀)
  if (process.env.NODE_ENV === "production") {
    const adapter = adapterFactory();
    return createPrismaClientWithAdapter(adapter);
  }

  // development에서는 globalThis에 1번만 만들어서 재사용
  if (!globalForPrisma.prisma) {
    const adapter = adapterFactory();
    globalForPrisma.prisma = createPrismaClientWithAdapter(adapter);
  }

  return globalForPrisma.prisma;
}
