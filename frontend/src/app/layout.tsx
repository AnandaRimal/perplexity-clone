import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ["latin"],
  variable: '--font-merriweather'
});

export const metadata: Metadata = {
  title: "Perplexity Clone",
  description: "A search engine powered by Gemini",
};

import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${merriweather.variable} font-sans antialiased bg-zinc-900 text-zinc-100`}>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
