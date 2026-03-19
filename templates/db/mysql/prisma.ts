// mysql, mariadb 공통
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { getPrisma } from "@/lib/prisma-base";

export const prisma = getPrisma(() => {
  const connectionString = process.env.DATABASE_URL!;

  // 필요 시 설정 가능
  // const adapter = new PrismaMariaDb({
  //   host: "localhost",
  //   port: 3306,
  //   connectionLimit: 5
  // })

  return new PrismaMariaDb(connectionString);
});
