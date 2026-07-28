"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { Icon } from "./Icons";

type SafeImageProps = ImageProps & {
  fallbackClassName?: string;
};

export function SafeImage({ alt, fallbackClassName = "", ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`grid h-full w-full place-items-center bg-[#f4efd9] text-[#806505] ${fallbackClassName}`}>
        <Icon name="box" className="h-10 w-10" />
        <span className="sr-only">{alt}</span>
      </div>
    );
  }

  return <Image {...props} alt={alt} onError={() => setFailed(true)} />;
}
