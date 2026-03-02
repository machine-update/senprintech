import { NextResponse } from "next/server";

const allowed = ["image/png", "image/jpeg", "image/svg+xml", "application/pdf"];
const maxBytes = 10 * 1024 * 1024;

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  if (!allowed.includes(file.type)) return NextResponse.json({ error: "Type non autorise" }, { status: 400 });
  if (file.size > maxBytes) return NextResponse.json({ error: "Fichier trop volumineux" }, { status: 400 });

  const mockScan = { malware: false, transparency: true, dpi: 300 };

  return NextResponse.json({
    uploaded: true,
    storageKey: `mock/${Date.now()}-${file.name}`,
    scan: mockScan,
    message: "Mock upload valide. Brancher R2/S3 ici.",
  });
}
