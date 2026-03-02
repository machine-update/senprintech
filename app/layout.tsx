import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import CookieConsent from "@/components/shared/CookieConsent";
import AppNavigation from "@/components/shared/AppNavigation";
import Providers from "@/components/shared/Providers";
import "./styles.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://senprintech.com"),
  title: {
    default: "SenPrinTech | Impression et personnalisation premium",
    template: "%s | SenPrinTech",
  },
  description:
    "Personnalisez vos vetements, objets et supports graphiques avec une experience e-commerce premium. Production rapide, qualite controlee, livraison suivie.",
  openGraph: {
    title: "SenPrinTech",
    description:
      "Plateforme premium de personnalisation et impression pour particuliers et entreprises.",
    type: "website",
    locale: "fr_FR",
    siteName: "SenPrinTech",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          background: "#f8fafc",
          color: "#0f172a",
          fontFamily: "\"Manrope\", \"Avenir Next\", \"Segoe UI\", sans-serif",
          letterSpacing: "0.01em",
        }}
      >
        <Providers>
          <Suspense fallback={null}>
            <AppNavigation />
          </Suspense>

          {children}

          <footer style={{ borderTop: "1px solid #e2e8f0", marginTop: 44, background: "#fff" }}>
            <div
              style={{
                maxWidth: 1180,
                margin: "0 auto",
                padding: "22px 20px",
                color: "#475569",
                fontSize: 13,
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <span>SenPrinTech • 🇸🇳 Dakar - Senegal • Production & logistique internationale</span>
              <span style={{ display: "flex", gap: 10 }}>
                <Link href="/contact" style={{ color: "#475569", textDecoration: "none" }}>
                  Contact
                </Link>
                <Link href="/help" style={{ color: "#475569", textDecoration: "none" }}>
                  Aide
                </Link>
                <Link href="/legal" style={{ color: "#475569", textDecoration: "none" }}>
                  CGU / Confidentialite
                </Link>
              </span>
            </div>
          </footer>
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
