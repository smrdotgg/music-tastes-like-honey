import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Example font, change if needed
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import "@uploadthing/react/styles.css";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";


//import { utapi } from "./uploadthing.ts";
const inter = Inter({

  variable: "--font-sans", // Assign to --font-sans CSS variable
  subsets: ["latin"],
});


// If you want a mono font as well:

/* const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
}); */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "A Special Performance",
  description: "Waiting for a beautiful melody.",
};

export default async function RootLayout({
  children,

}: Readonly<{
  children: React.ReactNode;

}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <NextSSRPlugin
          /**

           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.

           */

          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        {children}
      </body>
    </html>
  );
}

