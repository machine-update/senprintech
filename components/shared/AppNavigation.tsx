"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useSmartBack } from "@/hooks/use-smart-back";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/search", label: "Recherche" },
  { href: "/design", label: "Personnaliser" },
  { href: "/business", label: "Entreprises" },
  { href: "/admin", label: "Admin" },
];

const labelMap: Record<string, string> = {
  catalogue: "Catalogue",
  search: "Recherche",
  design: "Personnaliser",
  business: "Entreprises",
  account: "Compte",
  admin: "Admin",
  cart: "Panier",
  checkout: "Paiement",
  products: "Catalogue",
  orders: "Commandes",
  contact: "Contact",
  help: "Aide",
  legal: "CGU / Confidentialite",
  connexion: "Connexion",
  inscription: "Inscription",
  "mot-de-passe-oublie": "Mot de passe oublie",
  "reinitialiser-mot-de-passe": "Reinitialiser le mot de passe",
};

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/design") return pathname === "/design";
  if (href === "/catalogue" && pathname.startsWith("/products/")) return true;
  if (href === "/account" && pathname.startsWith("/orders/")) return true;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function toBreadcrumb(pathname: string): Array<{ href: string; label: string }> {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return [];

  const crumbs: Array<{ href: string; label: string }> = [];
  let current = "";

  segments.forEach((segment, index) => {
    current += `/${segment}`;
    if (segment === "products") {
      crumbs.push({ href: "/catalogue", label: "Catalogue" });
      return;
    }

    let label = labelMap[segment] ?? segment;

    const prev = segments[index - 1];
    if (prev === "products" && !labelMap[segment]) label = "Produit";
    if (prev === "orders" && !labelMap[segment]) label = "Commande";

    crumbs.push({ href: current, label });
  });

  return crumbs;
}

export default function AppNavigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();
  const { goBack } = useSmartBack();
  const crumbs = useMemo(() => toBreadcrumb(pathname), [pathname]);
  const isLoggedIn = status === "authenticated" && !!session?.user;
  const accountHref = isLoggedIn ? "/account" : "/connexion";
  const accountLabel = isLoggedIn ? "Mon compte" : "Connexion / Inscription";

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div className="nav-shell">
          <Link href="/" style={{ textDecoration: "none", color: "#0f172a", fontWeight: 900, letterSpacing: 0.6, fontSize: 18 }}>
            SENPRINTECH
          </Link>

          <nav className="nav-desktop" aria-label="Navigation principale">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={isActive(pathname, item.href) ? activeNavLink : navLink}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={accountHref}
              style={isActive(pathname, "/account") || isActive(pathname, "/connexion") || isActive(pathname, "/inscription") ? activeNavLink : navLink}
            >
              {accountLabel}
            </Link>
            <Link href="/cart" style={cartButton} aria-label="Voir le panier">
              Panier
            </Link>
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                style={logoutButton}
                aria-label="Se deconnecter"
              >
                Deconnexion
              </button>
            ) : null}
          </nav>

          <button
            type="button"
            className="nav-mobile-toggle"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
            style={mobileButton}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {mobileOpen ? (
          <div className="nav-mobile-panel" role="menu">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={isActive(pathname, item.href) ? activeMobileLink : mobileLink}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={accountHref}
              onClick={() => setMobileOpen(false)}
              style={isActive(pathname, "/account") || isActive(pathname, "/connexion") || isActive(pathname, "/inscription") ? activeMobileLink : mobileLink}
            >
              {accountLabel}
            </Link>
            <Link href="/cart" onClick={() => setMobileOpen(false)} style={cartMobileButton}>
              Panier
            </Link>
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                style={logoutMobileButton}
              >
                Deconnexion
              </button>
            ) : null}
          </div>
        ) : null}
      </header>

      {pathname !== "/" ? (
        <section style={{ borderBottom: "1px solid #e2e8f0", background: "rgba(255,255,255,0.9)" }}>
          <div
            style={{
              maxWidth: 1120,
              margin: "0 auto",
              padding: "10px 20px",
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <button type="button" onClick={goBack} style={backButton} aria-label="Revenir a la page precedente">
              <ArrowLeft size={14} />
              Retour
            </button>

            <nav aria-label="Fil d'ariane" style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: 13 }}>
              <Link href="/" style={crumbLink}>
                Accueil
              </Link>
              {crumbs.map((crumb, index) => {
                const last = index === crumbs.length - 1;
                return (
                  <span key={`${crumb.href}-${crumb.label}`} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <ChevronRight size={13} />
                    {last ? (
                      <span style={{ color: "#334155", fontWeight: 700 }}>{crumb.label}</span>
                    ) : (
                      <Link href={crumb.href} style={crumbLink}>
                        {crumb.label}
                      </Link>
                    )}
                  </span>
                );
              })}
            </nav>
          </div>
        </section>
      ) : null}
    </>
  );
}

const navLink: React.CSSProperties = {
  color: "#334155",
  textDecoration: "none",
  fontWeight: 600,
  padding: "7px 9px",
  borderRadius: 9,
};

const activeNavLink: React.CSSProperties = {
  ...navLink,
  color: "#0f172a",
  background: "#eef2f7",
};

const cartButton: React.CSSProperties = {
  color: "#fff",
  textDecoration: "none",
  background: "#0f172a",
  padding: "9px 14px",
  borderRadius: 12,
  fontWeight: 700,
};

const mobileButton: React.CSSProperties = {
  border: "1px solid #dbe4f0",
  borderRadius: 10,
  background: "#fff",
  color: "#0f172a",
  width: 36,
  height: 36,
  display: "inline-grid",
  placeItems: "center",
};

const mobileLink: React.CSSProperties = {
  textDecoration: "none",
  color: "#334155",
  padding: "10px 12px",
  borderRadius: 9,
  fontWeight: 600,
};

const activeMobileLink: React.CSSProperties = {
  ...mobileLink,
  background: "#eef2f7",
  color: "#0f172a",
};

const cartMobileButton: React.CSSProperties = {
  textDecoration: "none",
  color: "#fff",
  background: "#0f172a",
  padding: "10px 12px",
  borderRadius: 10,
  fontWeight: 700,
  textAlign: "center",
};

const logoutButton: React.CSSProperties = {
  border: "1px solid #dbe4f0",
  borderRadius: 10,
  padding: "9px 11px",
  background: "#fff",
  color: "#0f172a",
  fontWeight: 700,
  cursor: "pointer",
};

const logoutMobileButton: React.CSSProperties = {
  border: "1px solid #dbe4f0",
  borderRadius: 10,
  padding: "10px 12px",
  background: "#fff",
  color: "#0f172a",
  fontWeight: 700,
  cursor: "pointer",
};

const backButton: React.CSSProperties = {
  border: "1px solid #dbe4f0",
  borderRadius: 10,
  padding: "8px 11px",
  background: "#fff",
  color: "#0f172a",
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const crumbLink: React.CSSProperties = {
  textDecoration: "none",
  color: "#64748b",
  fontWeight: 600,
};
