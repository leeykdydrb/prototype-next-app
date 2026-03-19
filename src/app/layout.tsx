import { auth } from "@/lib/auth-keycloak";
import ClientProviders from "@/lib/providers/ClientProviders";
import { ToastProvider } from "@/lib/providers/ToastProvider";
import type { Metadata } from "next";
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
  console.log('RootLayout');
  const session = await auth();
  return (
    <html lang="ko">
      <body>
        <ClientProviders session={session}>
          <ToastProvider />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
