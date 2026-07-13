import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Sora } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = Sora({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Metric Contract Studio",
    template: "%s · Metric Contract Studio",
  },
  description:
    "Create, validate, score and export business metric contracts for analytics engineering governance.",
  metadataBase: new URL("https://metric-contract-studio.vercel.app"),
  openGraph: {
    title: "Metric Contract Studio",
    description:
      "Turn ambiguous KPIs into validated, scored, exportable metric contracts.",
    url: "https://metric-contract-studio.vercel.app",
    siteName: "Metric Contract Studio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
