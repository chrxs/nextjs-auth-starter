"use client";

import { useLocale } from "next-intl";

import { LOCALES } from "@/i18n/constants";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LanguageSelect() {
  const selectedLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(pathname, { locale: evt.target.value });
  };

  return (
    <select value={selectedLocale} onChange={handleChange}>
      {LOCALES.map((locale) => (
        <option key={locale} value={locale}>
          {locale}
        </option>
      ))}
    </select>
  );
}
