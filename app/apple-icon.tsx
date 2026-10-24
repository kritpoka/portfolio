import { ImageResponse } from "next/og";

// Home-screen icon: the same "KP" monogram as app/icon.svg, light theme.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#FAF9F6" }}>
        <svg width="180" height="180" viewBox="0 0 32 32">
          <g fill="none" stroke="#1C1B18" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 9v14M8 16.5 14 9M10.1 14 14.3 23" />
            <path d="M18 23V9h3a3.4 3.4 0 0 1 0 6.8h-3" />
          </g>
          <circle cx="25.6" cy="23" r="2.1" fill="#0B6A45" />
        </svg>
      </div>
    ),
    size,
  );
}
