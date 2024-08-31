import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider, useAuth } from "@/contexts/authContext";
import Layout from "@/components/navigation/layout";
const inter = Inter({ subsets: ["latin"] });
import { PublicEnvScript } from 'next-runtime-env';

export const metadata: Metadata = {
  title: "CFP Dashboard",
  description: "263rd Combat Communications Squadron CFP Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <PublicEnvScript />
      </head>
      <AuthProvider>
        <body className={inter.className}>
          <Layout>{children}</Layout>
        </body>
      </AuthProvider>
    </html>
  );
}
