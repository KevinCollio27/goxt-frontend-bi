import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const file = req.nextUrl.searchParams.get("file");

  // Seguridad básica: no permitir path traversal
  if (!file || file.includes("..") || file.startsWith("/")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = path.join(process.cwd(), "mockups", file);

  if (!fs.existsSync(filePath) || !filePath.endsWith(".html")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const body = fs.readFileSync(filePath, "utf-8");

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    :root {
      --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

      --color-text-primary:   #111827;
      --color-text-secondary: #6B7280;
      --color-text-tertiary:  #9CA3AF;
      --color-text-info:      #2563EB;
      --color-text-success:   #16A34A;
      --color-text-danger:    #DC2626;

      --color-background-primary:   #FFFFFF;
      --color-background-secondary: #F9FAFB;
      --color-background-success:   #DCFCE7;
      --color-background-info:      #DBEAFE;
      --color-background-danger:    #FEE2E2;

      --color-border-primary:   #D1D5DB;
      --color-border-secondary: #E5E7EB;
      --color-border-tertiary:  #F3F4F6;

      --border-radius-sm: 4px;
      --border-radius-md: 6px;
      --border-radius-lg: 12px;
    }

    *, *::before, *::after { box-sizing: border-box; }

    body {
      font-family: var(--font-sans);
      font-size: 13px;
      color: var(--color-text-primary);
      background: var(--color-background-primary);
      margin: 0;
      padding: 24px;
      -webkit-font-smoothing: antialiased;
    }
  </style>
</head>
<body>
${body}
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
