// =============================================================================
// ENVIO DE E-MAIL
// Ordem de config: (1) variáveis SMTP_* do ambiente, se definidas; senão
// (2) a config SMTP já cadastrada no banco (ofc_cfg_smtp_importacao, ativo=1).
// A senha do SMTP fica no banco e é lida só em runtime pelo servidor.
// =============================================================================
import nodemailer from "nodemailer";
import { query } from "@/lib/db";

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from: string;
};

async function loadConfig(): Promise<SmtpConfig | null> {
  // (1) SMTP próprio do site via variáveis de ambiente.
  if (process.env.SMTP_HOST) {
    const port = Number(process.env.SMTP_PORT ?? 587);
    return {
      host: process.env.SMTP_HOST,
      port,
      secure:
        (process.env.SMTP_ENCRYPTION ?? "").toLowerCase() === "ssl" || port === 465,
      user: process.env.SMTP_USER || undefined,
      pass: process.env.SMTP_PASSWORD || undefined,
      from:
        process.env.SMTP_FROM ||
        process.env.SMTP_USER ||
        "no-reply@pierrealexander.com.br",
    };
  }

  // (2) Fallback: config já cadastrada no banco.
  const rows = await query<{
    host: string;
    port: number;
    username: string | null;
    password: string | null;
    encryption: string | null;
    from_email: string | null;
    from_name: string | null;
  }>(
    `SELECT host, port, username, password, encryption, from_email, from_name
       FROM ofc_cfg_smtp_importacao
      WHERE ativo = 1
      ORDER BY id
      LIMIT 1`
  );
  const r = rows[0];
  if (!r?.host) return null;

  const port = Number(r.port ?? 587);
  const from = r.from_email
    ? r.from_name
      ? `${r.from_name} <${r.from_email}>`
      : r.from_email
    : "no-reply@pierrealexander.com.br";

  return {
    host: r.host,
    port,
    secure: (r.encryption ?? "").toLowerCase() === "ssl" || port === 465,
    user: r.username || undefined,
    pass: r.password || undefined,
    from,
  };
}

export async function smtpConfigured(): Promise<boolean> {
  try {
    return (await loadConfig()) !== null;
  } catch {
    return false;
  }
}

export async function sendMail(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  const cfg = await loadConfig();
  if (!cfg) return false;

  const transport = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: cfg.user ? { user: cfg.user, pass: cfg.pass } : undefined,
  });

  await transport.sendMail({ from: cfg.from, to, subject, html });
  return true;
}
