"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export function LoadingSpinner({
  size = "default",
  fullScreen = false,
  className,
}) {
  const sizeClasses = {
    sm: "w-32 h-32",
    default: "w-60 h-60",
    lg: "w-96 h-96",
  };

  const containerClasses = cn(
    "flex items-center justify-center",
    fullScreen && "min-h-screen bg-gray-100 dark:bg-black",
    className
  );

  const imageClasses = cn(
    "object-contain",
    sizeClasses[size] || sizeClasses.default
  );

  return (
    <div className={containerClasses}>
      <Image
        src="/public/main.gif"
        alt="Loading..."
        width={600}
        height={600}
        className={imageClasses}
        priority
      />
    </div>
  );
}
