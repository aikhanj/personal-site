import type { Metadata } from "next";
import { JetBrains_Mono, IBM_Plex_Mono, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-share-tech-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "> khan/",
  description: "municipal ai · film · systems · change. one man versus systemic decay. rebuilding through logic and light.",
  keywords: ["aikhan", "municipal ai", "systems", "reconstruction", "technology", "film", "kyrgyz", "bishkek"],
  authors: [{ name: "Aikhan" }],
  openGraph: {
    title: "khan",
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
      <body className={`${jetbrainsMono.variable} ${ibmPlexMono.variable} ${shareTechMono.variable} antialiased`} style={{ backgroundColor: '#080808' }}>
        {children}
      </body>
    </html>
  );
}
