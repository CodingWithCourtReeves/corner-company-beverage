import sharp from "sharp";
import { readFileSync, mkdirSync } from "node:fs";

const svg = readFileSync("public/favicon.svg");

mkdirSync("public", { recursive: true });
await sharp(svg).resize(16, 16).png().toFile("public/favicon-16.png");
await sharp(svg).resize(32, 32).png().toFile("public/favicon-32.png");
await sharp(svg).resize(180, 180).png().toFile("public/apple-touch-icon.png");

const og = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#2F4A3A"/>
  <g transform="translate(600 240)">
    <circle r="120" fill="none" stroke="#F4EFE6" stroke-width="1.5"/>
    <circle r="108" fill="none" stroke="#F4EFE6" stroke-width="1"/>
    <text text-anchor="middle" y="-12" font-family="Georgia, serif" font-size="74" font-weight="500" fill="#F4EFE6">C</text>
    <text text-anchor="middle" y="20" font-family="Georgia, serif" font-style="italic" font-size="28" fill="#F4EFE6">&amp;</text>
    <text text-anchor="middle" y="64" font-family="Georgia, serif" font-size="74" font-weight="500" fill="#F4EFE6">C</text>
  </g>
  <text x="600" y="460" text-anchor="middle" font-family="Georgia, serif" font-size="56" fill="#F4EFE6">Corner Company</text>
  <text x="600" y="510" text-anchor="middle" font-family="Inter, sans-serif" font-size="22" letter-spacing="6" fill="#F4EFE6">BEVERAGE EMPORIUM</text>
  <text x="600" y="570" text-anchor="middle" font-family="Inter, sans-serif" font-size="18" letter-spacing="3" fill="#F4EFE6" opacity="0.7">JONESBOROUGH · TENNESSEE</text>
</svg>
`;
await sharp(Buffer.from(og)).png().toFile("public/og-image.png");

console.log("Generated favicons and OG image.");
