"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";

import { getInitials } from "@/lib/utils";

type Props = {
  size?: number;
};

export default function UserImage({ size = 64 }: Props) {
  const { data: session } = useSession();
  const { image, name } = session?.user ?? {};

  if (image) {
    return (
      <div className="rounded overflow-hidden">
        <Image
          src={image as string}
          width={size}
          height={size}
          alt={name ?? ""}
        />
      </div>
    );
  }

  const initials = name && getInitials(name);

  return <div className="rounded overflow-hidden">{initials}</div>;
}
