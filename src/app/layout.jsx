import { Forum, Work_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Loading from "@/components/loading";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

// const forum = Forum({ weight: "400", subsets: ["latin"], display: "swap" });
// const workSans = Work_Sans({ weight: "400", subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Shade & Co.",
  description: "Generated by create next app",
};

export default function RootLayout ({ children }) {
  return (
    <SessionProvider>
      <html lang="en">
        <head>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
          <link href="./globals.css" rel="stylesheet" />
        </head>
        <body
          className={`${forum.className} ${workSans.className} antialiased`}
          suppressHydrationWarning={true} >
          <Suspense fallback={<Loading />}>
            <Navbar />
            <div className="mt-[99px]">{children}
              <Toaster richColors position="bottom-right" />
              <Footer />
            </div>
          </Suspense>
        </body>
      </html>
    </SessionProvider>
  );
}
