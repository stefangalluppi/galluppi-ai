import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "GALLUPPI.AI — AI Systems Architecture",
  description: "AI Systems Architecture. Telehealth Infrastructure. Strategic Leverage.",
  keywords: ["AI", "Systems Architecture", "Telehealth", "OpenClaw", "AiDoc", "Stardust"],
  authors: [{ name: "Stefan Galluppi" }],
  openGraph: {
    title: "GALLUPPI.AI",
    description: "AI Systems Architecture. Telehealth Infrastructure. Strategic Leverage.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
