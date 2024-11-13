import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { OurStoreProvider } from "./ourProvider";
import Footer from "@/components/self/footer";
import { AppQueryProvider } from "./QueryProvider";
import { Toaster } from "@/components/ui/toaster";
import DataProvider from "./DataProvider";
import Navbar from "@/components/Navbar";

// 👇 import local font
import localFont from "next/font/local";

//👇 Configure our local font object
// import a from ""
const myFont = localFont({ src: "../ourfont/DenimINKWDTRIAL-Light.otf" });

// const fontSans = FontSans({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

export const metadata: Metadata = {
  title: "Orbii app | Orbii", // Remplace par ton nom
  description:
    "Découvrer la liste de nos business partenaires , devenez vous même partenaire  et bénéficiez d'une expérience de shopping améliorée !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("", myFont.className)}>
        <AppQueryProvider>
          <OurStoreProvider>
            <DataProvider>
              <div className="flex flex-col min-h-screen ">
                <Navbar />
                {children}

                <Footer />
              </div>
            </DataProvider>
          </OurStoreProvider>
          <Toaster />
        </AppQueryProvider>
      </body>
    </html>
  );
}
