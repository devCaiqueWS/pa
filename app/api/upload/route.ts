import { NextResponse } from "next/server";
import { getSession } from "@/lib/guard";
import { cloudinary, cloudinaryConfigurado } from "@/lib/cloudinary";

export const runtime = "nodejs";

const EDIT_ROLES = ["admin", "admin_ti"];
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

// POST /api/upload  (multipart, campo "file") -> { url }
// Só admin logado. Envia a imagem ao Cloudinary e devolve a URL final.
export async function POST(req: Request) {
  const session = await getSession();
  if (!session || !EDIT_ROLES.includes(session.perfil)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  if (!cloudinaryConfigurado) {
    return NextResponse.json(
      { error: "Cloudinary ainda não configurado (faltam as variáveis de ambiente)." },
      { status: 503 }
    );
  }

  let file: FormDataEntryValue | null;
  try {
    const form = await req.formData();
    file = form.get("file");
  } catch {
    return NextResponse.json({ error: "Envio inválido." }, { status: 400 });
  }

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "O arquivo precisa ser uma imagem." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Imagem muito grande (máx. 8 MB)." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "pierre-site", resource_type: "image" }, (err, res) => {
          if (err || !res) reject(err ?? new Error("Falha no upload."));
          else resolve(res as { secure_url: string });
        })
        .end(bytes);
    });
    return NextResponse.json({ url: result.secure_url });
  } catch {
    return NextResponse.json({ error: "Falha ao enviar a imagem." }, { status: 502 });
  }
}
