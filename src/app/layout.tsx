import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import { WalletContextProvider } from "@/contexts/WalletContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { WalletBrowserBanner } from "@/components/wallet/WalletBrowserBanner";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/config/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Solana",
    "DEX",
    "meme coin",
    "SPL token",
    "launchpad",
    "crypto exchange",
    "liquidity pool",
    "pump fun",
    "Navorix",
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#08080f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      {/* Script que roda ANTES do React — limpa estado corrompido da carteira */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              // Remove parâmetros de erro do Phantom da URL
              var url = new URL(window.location.href);
              if (url.searchParams.has('errorCode') || url.searchParams.has('errorMessage')) {
                url.searchParams.delete('errorCode');
                url.searchParams.delete('errorMessage');
                window.history.replaceState({}, '', url.pathname + (url.search || ''));
              }
              // Limpa estado corrompido do wallet-adapter no localStorage
              var keysToRemove = [];
              for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key && (
                  key === 'walletName' ||
                  key.startsWith('wallet-') ||
                  key.startsWith('phantom') ||
                  key.startsWith('solflare') ||
                  key.startsWith('backpack')
                )) {
                  keysToRemove.push(key);
                }
              }
              // Só limpa se há errorCode na URL (estado corrompido)
              if (window.location.search.includes('errorCode')) {
                keysToRemove.forEach(function(k) { localStorage.removeItem(k); });
              }
            } catch(e) {}
          })();
        `}} />
      </head>
      <body className="min-h-dvh flex flex-col bg-[var(--background)] text-[var(--foreground)] antialiased">
        <ErrorBoundary>
          <WalletContextProvider>
            <Navbar />

            <main className="flex-1 pt-16">
              {children}
            </main>

            <Footer />
            <WalletBrowserBanner />

            <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--surface-2)",
                border: "1px solid var(--border-strong)",
                color: "var(--text-primary)",
              },
            }}
          />
          </WalletContextProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
