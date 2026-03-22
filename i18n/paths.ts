import { routing } from "./routing";

/** Path with optional locale prefix (for `localePrefix: "as-needed"`). */
export function hrefForLocale(locale: string, pathname: string): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (locale === routing.defaultLocale) {
    return normalized;
  }
  if (normalized === "/") {
    return `/${locale}`;
  }
  return `/${locale}${normalized}`;
}
