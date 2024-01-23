"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";

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

  return <div className="rounded overflow-hidden">{name}</div>;
}
