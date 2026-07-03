"use server";

import crypto from "crypto";
import { query } from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import { BASE_PATH } from "@/lib/site";
import type { ResetRequestState } from "./types";

type UserRow = { id: number; nome: string };

export async function requestResetAction(
  _prev: ResetRequestState,
  formData: FormData
): Promise<ResetRequestState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email) return { error: "Informe o e-mail." };

  const rows = await query<UserRow>(
    "SELECT id, nome FROM ofc_auth_usuarios WHERE email = ? AND ativo = 1 LIMIT 1",
    [email]
  );
  const user = rows[0];

  // Só age se o usuário existir — mas a resposta é sempre genérica (evita
  // revelar quais e-mails estão cadastrados).
  if (user) {
    const token = crypto.randomBytes(32).toString("hex"); // 64 chars (vai no link)
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex"); // char(64)

    await query(
      `INSERT INTO ofc_auth_reset_tokens (usuario_id, token_hash, expires_at, created_at)
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR), NOW())`,
      [user.id, tokenHash]
    );

    const base = process.env.APP_URL || "http://localhost:3000";
    const link = `${base}${BASE_PATH}/redefinir-senha?token=${token}`;

    try {
      const sent = await sendMail(
        email,
        "Redefinição de senha — Pierre Alexander",
        `<p>Olá, ${user.nome}.</p>
         <p>Recebemos um pedido para redefinir sua senha. O link abaixo é válido por 1 hora:</p>
         <p><a href="${link}">${link}</a></p>
         <p>Se você não solicitou, ignore este e-mail.</p>`
      );
      if (!sent) console.warn("[reset] SMTP indisponível — e-mail não enviado.");
    } catch (e) {
      console.error("[reset] falha ao enviar e-mail:", e);
    }

    // Em desenvolvimento, também loga o link no console para facilitar o teste.
    if (process.env.NODE_ENV !== "production") console.log("[reset] LINK:", link);
  }

  return { ok: true };
}
