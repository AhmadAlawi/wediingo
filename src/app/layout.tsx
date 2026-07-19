import type { Metadata } from "next";
import localFont from "next/font/local";
import {
  Playfair_Display,
  Source_Serif_4,
  DM_Sans,
  Work_Sans,
  Montserrat,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Card theme fonts, sourced from the Stitch flagship design systems (2026-07-19).
const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair-display" });
const sourceSerif4 = Source_Serif_4({ subsets: ["latin"], variable: "--font-source-serif-4" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta-sans" });

const cardFontVariables = [
  playfairDisplay.variable,
  sourceSerif4.variable,
  dmSans.variable,
  workSans.variable,
  montserrat.variable,
  plusJakartaSans.variable,
].join(" ");

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wediingo.awnak.net";
const SITE_NAME = "Wediingo";
const SITE_DESCRIPTION =
  "Create and share beautiful digital wedding invitations — pick a template, personalize it with your story and photos, and share a link your guests will love.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Beautiful Digital Wedding Invitations`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Beautiful Digital Wedding Invitations`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Beautiful Digital Wedding Invitations`,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cardFontVariables} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
