import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { CommunityProvider } from "@/lib/community-context";
import { CommandPalette } from "@/components/ui/command-palette";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#080B10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://fiecommunity.dev'),
  title: "FIE COMMUNITY — Connect. Collaborate. Create.",
  description: "Join FIE Community: Where Ideas Find Their Team. Developers, students, innovators, and creators share ideas, discover hackathons, form squads, and build extraordinary projects together.",
  keywords: [
    "FIE COMMUNITY",
    "developer community",
    "hackathons",
    "project management",
    "realtime collaboration",
    "Kanban board",
    "presentation library",
    "team matchmaking",
    "student builders",
    "since 2026"
  ],
  authors: [{ name: "FIE Community Team" }],
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/brand/favicon-32.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "FIE COMMUNITY — Great Ideas. Stronger Teams. Endless Possibilities.",
    description: "The official collaboration platform where developers, students, innovators, and creators share ideas, find teammates, and build something extraordinary together.",
    type: "website",
    siteName: "FIE COMMUNITY",
    images: [
      {
        url: "/brand/fie-logo.png",
        width: 600,
        height: 480,
        alt: "FIE COMMUNITY — Since 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FIE COMMUNITY — Great Ideas. Stronger Teams. Endless Possibilities.",
    description: "Connect. Collaborate. Create. — Where Ideas Find Their Team.",
    images: ["/brand/fie-logo.png"],
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
      className={`${spaceGrotesk.variable} ${inter.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#080B10] text-[#F8FAFC] selection:bg-orange-500/25 selection:text-orange-400">
        <AuthProvider>
          <CommunityProvider>
            {children}
            <CommandPalette />
          </CommunityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
