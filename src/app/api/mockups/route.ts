import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function toLabel(filename: string): string {
  return filename
    .replace(/\.html$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bAi\b/g, "AI")
    .replace(/\bCrm\b/g, "CRM")
    .replace(/\bGoxt\b/g, "GOxT")
    .trim();
}

function scanDir(dir: string, category: string): { file: string; label: string; category: string }[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".html"))
    .map((f) => ({
      file: `${category}/${f}`,
      label: toLabel(f),
      category,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export async function GET() {
  const root = path.join(process.cwd(), "mockups");

  const items = [
    ...scanDir(path.join(root, "Dashboard"), "Dashboard"),
    // raíz
    ...(fs.existsSync(root)
      ? fs
          .readdirSync(root)
          .filter((f) => f.endsWith(".html"))
          .map((f) => ({ file: f, label: toLabel(f), category: "General" }))
      : []),
  ];

  return NextResponse.json(items);
}
