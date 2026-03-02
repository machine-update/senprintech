"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function getFallbackPath(pathname: string, searchParams: URLSearchParams): string {
  if (pathname.startsWith("/products/")) return "/catalogue";
  if (pathname === "/search") return "/catalogue";
  if (pathname === "/design") {
    const productId = searchParams.get("productId");
    return productId ? `/products/${productId}` : "/catalogue";
  }
  if (pathname === "/cart") return "/catalogue";
  if (pathname === "/business") return "/";
  if (pathname === "/checkout") return "/cart";
  if (pathname.startsWith("/orders/")) return "/account";
  if (pathname === "/connexion" || pathname === "/inscription" || pathname === "/mot-de-passe-oublie") return "/";
  if (pathname === "/reinitialiser-mot-de-passe") return "/connexion";
  if (pathname.startsWith("/admin")) return "/admin";
  return "/";
}

export function useSmartBack() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fallback = useMemo(
    () => getFallbackPath(pathname, searchParams),
    [pathname, searchParams]
  );

  function goBack() {
    const hasBrowserHistory = typeof window !== "undefined" && window.history.length > 1;
    const sameOriginReferrer =
      typeof document !== "undefined" &&
      !!document.referrer &&
      (() => {
        try {
          return new URL(document.referrer).origin === window.location.origin;
        } catch {
          return false;
        }
      })();

    if (hasBrowserHistory && sameOriginReferrer) {
      router.back();
      return;
    }

    router.push(fallback);
  }

  return { goBack, fallback };
}
