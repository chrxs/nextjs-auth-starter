import { ComponentProps } from "react";

import { Link as I18nLink } from "@/i18n/navigation";

export default function Link({
  href,
  ...props
}: ComponentProps<typeof I18nLink>) {
  return <I18nLink href={href} {...props} />;
}
