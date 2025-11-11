"use client";

export default function CRTEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[10000]">
      {/* CRT Curvature Effect */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)",
        }}
      />
      
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: "inset 0 0 200px rgba(0, 0, 0, 0.8)",
        }}
      />
    </div>
  );
}

