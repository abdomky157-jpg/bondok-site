"use client";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  priority?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  fill?: boolean;
  sizes?: string;
}

/**
 * Image component with consistent styling.
 * Uses native img tags for maximum compatibility.
 */
export default function OptimizedImage({
  src,
  alt,
  className,
  style,
  onClick,
  loading = "lazy",
}: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      style={style}
      onClick={onClick}
    />
  );
}
