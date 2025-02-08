import { Forum, Work_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Loading from "@/components/loading";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";

const forum = Forum({ weight: "400", subsets: ["latin"] });
const workSans = Work_Sans({ weight: "400", subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${forum.className} ${workSans.className} antialiased`}>
        <Suspense fallback={<Loading />}>
          <Navbar />
          {children}
          <Toaster richColors position="bottom-right" />
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
