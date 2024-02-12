import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import merge from "lodash/merge";
import uniq from "lodash/uniq";
import reduce from "lodash/fp/reduce";

import { LOCALES } from "./constants";

async function getMessages(locale: string) {
  return (await import(`../../messages/${locale}.json`)).default;
}

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!LOCALES.includes(locale as any)) notFound();

  const messages = await Promise.all(
    uniq([locale.split("-")[0], locale]).map(getMessages),
  ).then(reduce(merge, {}));

  return {
    messages,
  };
});
