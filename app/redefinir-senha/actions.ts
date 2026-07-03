"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import type { ResetState } from "./types";

type TokenRow = { id: number; usuario_id: number };

export async function resetPasswordAction(
  _prev: ResetState,
  formData: FormData
): Promise<ResetState> {
  const token = String(formData.get("token") || "");
  const senha = String(formData.get("password") || "");
  const senha2 = String(formData.get("password2") || "");

  if (!token) return { error: "Link inválido. Solicite uma nova redefinição." };
  if (senha.length < 8) return { error: "A senha deve ter ao menos 8 caracteres." };
  if (senha !== senha2) return { error: "As senhas não conferem." };

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const rows = await query<TokenRow>(
    `SELECT id, usuario_id FROM ofc_auth_reset_tokens
      WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()
      LIMIT 1`,
    [tokenHash]
  );
  const rt = rows[0];
  if (!rt) return { error: "Link inválido ou expirado. Solicite uma nova redefinição." };

  const hash = await bcrypt.hash(senha, await bcrypt.genSalt(11));

  await query(
    `UPDATE ofc_auth_usuarios
        SET password_hash = ?, must_change_password = 0, failed_attempts = 0, blocked_until = NULL
      WHERE id = ?`,
    [hash, rt.usuario_id]
  );
  await query("UPDATE ofc_auth_reset_tokens SET used_at = NOW() WHERE id = ?", [rt.id]);

  return { ok: true };
}
