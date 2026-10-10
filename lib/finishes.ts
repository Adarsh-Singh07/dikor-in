export type FinishKey = "rosegold" | "champagne" | "ivory" | "onyx";

export interface Finish {
  key: FinishKey;
  name: string;
  note: string;
  color: string;
  metalness: number;
  roughness: number;
  swatch: string; // CSS background for UI swatches
}

export const FINISHES: Finish[] = [
  {
    key: "rosegold",
    name: "Rose Gold",
    note: "Warm metallic lustre, our signature finish",
    color: "#d79a9f",
    metalness: 0.9,
    roughness: 0.26,
    swatch: "linear-gradient(135deg,#f3c9cb 0%,#b76e79 55%,#8a4c56 100%)",
  },
  {
    key: "champagne",
    name: "Champagne Gold",
    note: "Classic festive gold with a soft sheen",
    color: "#e2c06a",
    metalness: 1,
    roughness: 0.22,
    swatch: "linear-gradient(135deg,#f6e3a6 0%,#c9a227 55%,#8f6f12 100%)",
  },
  {
    key: "ivory",
    name: "Ivory Matte",
    note: "Hand-sanded, porcelain-like and calm",
    color: "#f1e8da",
    metalness: 0.05,
    roughness: 0.62,
    swatch: "linear-gradient(135deg,#ffffff 0%,#f1e8da 55%,#d9cbb4 100%)",
  },
  {
    key: "onyx",
    name: "Onyx Satin",
    note: "Deep charcoal with a quiet satin glow",
    color: "#3a3230",
    metalness: 0.55,
    roughness: 0.35,
    swatch: "linear-gradient(135deg,#6b5f5a 0%,#2a2320 60%,#141010 100%)",
  },
];
