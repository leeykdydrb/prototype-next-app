import { PrismaPg } from "@prisma/adapter-pg";
import { getPrisma } from "@/lib/prisma-base";

export const prisma = getPrisma(() => {
  const connectionString = process.env.DATABASE_URL!;
  return new PrismaPg({ connectionString });
});
