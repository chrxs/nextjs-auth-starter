"use server";

import { redirect } from "@/i18n/navigation";

export default async function changeLanguage(locale: string) {
  redirect(`/${locale}/settings`);
}
