import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AIKHAN :: Systems · Reconstruction · Intent",
  description: "municipal ai · film · systems · change. one man versus systemic decay. rebuilding through logic and light.",
  keywords: ["aikhan", "municipal ai", "systems", "reconstruction", "technology", "film", "kyrgyz", "bishkek"],
  authors: [{ name: "Aikhan" }],
  openGraph: {
    title: "AIKHAN",
    description: "reconstructing systems through computation and intent",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${jetbrainsMono.variable} antialiased bg-black`}>
        {children}
      </body>
    </html>
  );
}
