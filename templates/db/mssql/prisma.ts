import { PrismaMssql } from "@prisma/adapter-mssql";
import { getPrisma } from "@/lib/prisma-base";

export const prisma = getPrisma(() => {
  const connectionString = process.env.DATABASE_URL!;

  // 필요 시 설정 가능
  // const config = {
  //   server: 'localhost',
  //   port: 1433,
  //   database: 'mydb',
  //   user: 'sa',
  //   password: 'mypassword',
  //   options: {
  //     encrypt: true, // Use this if you're on Windows Azure
  //     trustServerCertificate: true, // Use this if you're using self-signed certificates
  //   },
  // }

  return new PrismaMssql(connectionString);
});