import { routing } from "@/i18n/routing";
import { auth } from "@/lib/auth-keycloak";
import ClientProviders from "@/lib/providers/ClientProviders";
import { ToastProvider } from "@/lib/providers/ToastProvider";
import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "evelopment Framework",
  description: "Development Framework",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("RootLayout");
  const session = await auth();
  const headerList = await headers();
  const locale =
    headerList.get("x-next-intl-locale") ?? routing.defaultLocale;

  return (
    <html lang={locale}>
      <body>
        <ClientProviders session={session}>
          <ToastProvider />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
