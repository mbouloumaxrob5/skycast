import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ServiceWorkerRegistration } from "@/components/providers/ServiceWorkerRegistration";
import { I18nProvider } from "@/components/providers/I18nProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false, // Monospace rarely needed immediately
});

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "SkyCast - L'assistant météo intelligent",
    template: "%s | SkyCast",
  },
  description: "Application météo moderne avec géolocalisation, prévisions 5 jours et thèmes adaptatifs. Consultez la météo en temps réel partout dans le monde.",
  keywords: ["météo", "weather", "prévisions", "forecast", "géolocalisation", "temperature", "pluie", "soleil"],
  authors: [{ name: "SkyCast" }],
  creator: "SkyCast",
  publisher: "SkyCast",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: "en_US",
    url: "https://skycast.app",
    siteName: "SkyCast",
    title: "SkyCast - L'assistant météo intelligent",
    description: "Application météo moderne avec géolocalisation et prévisions 5 jours",
    images: [
      {
        url: "/icons/icon.svg",
        width: 512,
        height: 512,
        alt: "SkyCast Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SkyCast - L'assistant météo intelligent",
    description: "Application météo moderne avec géolocalisation et prévisions 5 jours",
    images: ["/icons/icon.svg"],
    creator: "@skycast",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SkyCast",
    startupImage: "/icons/icon.svg",
  },
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    apple: [
      { url: "/icons/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    shortcut: { url: "/icons/icon.svg" },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://skycast.app",
    languages: {
      "fr": "https://skycast.app",
      "en": "https://skycast.app/en",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider>
          <QueryProvider>
            <ServiceWorkerRegistration />
            {children}
          </QueryProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
