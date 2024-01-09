import NextLink, { LinkProps } from "next/link";

export default function Link(props: React.PropsWithChildren<LinkProps>) {
  return <NextLink {...props} />;
}
