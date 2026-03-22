import React from "react";
import "@testing-library/jest-dom";

jest.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }) =>
    React.createElement("a", { href, ...props }, children),
}));

jest.mock("next-intl", () => {
  const en = require("./messages/en.json");
  function tr(table, key, values) {
    let s = table[key] ?? key;
    if (values && typeof s === "string") {
      Object.entries(values).forEach(([k, v]) => {
        s = s.split(`{${k}}`).join(String(v));
      });
    }
    return s;
  }
  return {
    useLocale: () => "en",
    useTranslations: (namespace) => (key, values) =>
      tr(en[namespace] || {}, key, values),
  };
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock("next-intl/server", () => {
  const en = require("./messages/en.json");
  function tr(table, key, values) {
    let s = table[key] ?? key;
    if (values && typeof s === "string") {
      Object.entries(values).forEach(([k, v]) => {
        s = s.split(`{${k}}`).join(String(v));
      });
    }
    return s;
  }
  return {
    getLocale: jest.fn(() => Promise.resolve("en")),
    getTranslations: jest.fn(async (opts) => {
      const namespace =
        typeof opts === "string" ? opts : opts?.namespace ?? "";
      const table = namespace && en[namespace] ? en[namespace] : {};
      return (key, values) => tr(table, key, values);
    }),
  };
});

jest.mock("@/i18n/paths", () => ({
  hrefForLocale: (locale, pathname) => {
    const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
    if (locale === "en") {
      return normalized;
    }
    if (normalized === "/") {
      return `/${locale}`;
    }
    return `/${locale}${normalized}`;
  },
}));
