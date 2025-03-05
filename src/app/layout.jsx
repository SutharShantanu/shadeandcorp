import { Forum, Work_Sans } from "next/font/google";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import ClientLayout from "./clientLayout";

const forum = Forum({ weight: "400", subsets: ["latin"], display: "swap" });
const workSans = Work_Sans({ weight: "400", subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Shade & Co.",
  description: "Generated by create next app",
};

export default function RootLayout ({ children }) {
  return (
    <SessionProvider>
      <html lang="en">
        <Head>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
          <link href="./globals.css" rel="stylesheet" />
        </Head>
        <body className={`${forum.className} ${workSans.className} antialiased`} suppressHydrationWarning>
          <ClientLayout>{children}</ClientLayout>
        </body>
      </html>
    </SessionProvider>
  );
}
