"use client";

export default function Avatar({ src, alt, size = 40, round = true }: { src: string; alt: string; size?: number; round?: boolean }) {
  return (
    <div className="flex-shrink-0 overflow-hidden"
      style={{ width: size, height: size, minWidth: size, minHeight: size, borderRadius: round ? "50%" : 8 }}>
      <img src={src} alt={alt} className="block w-full h-full object-cover" />
    </div>
  );
}
