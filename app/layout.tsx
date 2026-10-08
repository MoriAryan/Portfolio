import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://moriaryan.com"),
  title: "Mori Aryan | Software Systems & Deep Learning Researcher",
  description:
    "Undergraduate CSE at SVNIT Surat. Machine learning researcher on ISRO-sponsored hyperspectral imaging, and developer of full-stack production systems.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Mori Aryan | Software Systems & Deep Learning Researcher",
    description:
      "Undergraduate CSE at SVNIT Surat. Machine learning researcher on ISRO-sponsored hyperspectral imaging, and developer of full-stack production systems.",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1000,
        height: 1000,
        alt: "Mori Aryan Insignia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mori Aryan | Software Systems & Deep Learning Researcher",
    description:
      "Undergraduate CSE at SVNIT Surat. Machine learning researcher on ISRO-sponsored hyperspectral imaging.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#08080a] text-slate-200`}
      >
        {children}
      </body>
    </html>
  );
}
