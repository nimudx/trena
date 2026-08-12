import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const ACCENT = "#3F8F5F";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111113",
          borderRadius: 7,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
          <rect x="12.5" y="2" width="7" height="15" rx="3.5" fill={ACCENT} />
          <rect
            x="12.5"
            y="2"
            width="7"
            height="15"
            rx="3.5"
            fill={ACCENT}
            opacity={0.7}
            transform="rotate(120 16 16)"
          />
          <rect
            x="12.5"
            y="2"
            width="7"
            height="15"
            rx="3.5"
            fill={ACCENT}
            opacity={0.45}
            transform="rotate(240 16 16)"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
