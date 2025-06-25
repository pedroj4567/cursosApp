import React from "react";

export type HeroPolygonProps = {
  children: React.ReactNode;
};
function HeroPolygon({ children }: HeroPolygonProps) {
  return (
    <div
      className={`relative min-h-[60vh] bg-[url(/imagenHero.webp)] bg-cover `}
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-700/70 via-gray-500/70 to-gray-400/80 bg-opacity-40"></div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default HeroPolygon;
