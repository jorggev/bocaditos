"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type ImageWithSkeletonProps = {
  src: string;
  alt: string;
  containerClassName?: string;
  imageClassName?: string;
};

export function ImageWithSkeleton({ src, alt, containerClassName, imageClassName }: ImageWithSkeletonProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {!loaded && <Skeleton className="absolute inset-0 z-10 rounded-none" />}
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        onLoad={() => setLoaded(true)}
        className={cn("object-cover transition-opacity duration-300", loaded ? "opacity-100" : "opacity-0", imageClassName)}
      />
    </div>
  );
}