import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Antonie—Gabriel Belu | Systems Programmer",
  description: "I design software where architecture becomes tangible.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} h-full antialiased scroll-smooth scroll-pt-32`}
    >
      <body className="min-h-full flex flex-col font-mono text-sm leading-relaxed selection:bg-accent-teal selection:text-background">
        {children}
      </body>
    </html>
  );
}
