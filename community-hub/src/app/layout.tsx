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
  themeColor: "#070B14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "BuildSpace — Great Ideas Deserve Great Teams",
  description: "The digital campus for developers, students, and creators. Share ideas, discover hackathons, form squads, collaborate in real-time rooms, manage tasks, and build the future together.",
  keywords: [
    "developer community",
    "hackathons",
    "project management",
    "realtime collaboration",
    "Kanban board",
    "presentation library",
    "tech campus",
    "team matchmaking",
    "student builders"
  ],
  authors: [{ name: "BuildSpace Team" }],
  openGraph: {
    title: "BuildSpace — Great Ideas Deserve Great Teams",
    description: "The digital campus for developers, students, and creators. Share ideas, discover hackathons, form squads, and collaborate in real-time rooms.",
    type: "website",
    siteName: "BuildSpace",
  },
  twitter: {
    card: "summary_large_image",
    title: "BuildSpace — Great Ideas Deserve Great Teams",
    description: "Digital campus for developer collaboration, hackathons, and real-time team building.",
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
      <body className="min-h-full flex flex-col bg-[#070B14] text-[#F8FAFC] selection:bg-[#00F0FF]/25 selection:text-[#00F0FF]">
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
