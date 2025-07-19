"use client";

import Image, { ImageProps } from "next/image";
import React from "react";

interface SmartImageProps extends Omit<ImageProps, "src"> {
  src: string;
}

const isExternal = (url: string): boolean => {
  return url.startsWith("http://") || url.startsWith("https://");
};

const isCloudinaryPublicId = (src: string): boolean => {
  return !isExternal(src) && !src.startsWith("/");
};

const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  ...rest
}) => {
  const cloudinaryBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "";

  // If it's a public ID from Cloudinary, build the full URL
  const imageUrl = isCloudinaryPublicId(src)
    ? `${cloudinaryBaseUrl}/image/upload/${src}`
    : src;

  const useNextImage = isCloudinaryPublicId(src) || imageUrl.includes("res.cloudinary.com");

  if (useNextImage) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        className={className}
        {...rest}
      />
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)}
    />
  );
};

export default SmartImage;
