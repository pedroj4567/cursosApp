import React from "react";

export type HeroPolygonProps = {
  children: React.ReactNode;
};
function HeroPolygon({ children }: HeroPolygonProps) {
  return (
    <div
      className="relative min-h-[60vh] bg-gradient-to-br from-cyan-700 via-teal-500 to-emerald-400"
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
      }}
    >
      {children}
    </div>
  );
}

export default HeroPolygon;
