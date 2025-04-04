import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Example font, change if needed
import "./globals.css";
// Removed UploadThing imports

const inter = Inter({

  variable: "--font-sans", // Assign to --font-sans CSS variable
  subsets: ["latin"],
});


export const dynamic = "force-dynamic"; // Keep if needed, otherwise consider removing

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
        {/* Removed NextSSRPlugin */}
        {children}
      </body>
    </html>
  );
}

