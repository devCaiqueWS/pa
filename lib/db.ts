// =============================================================================
// CONEXÃO MySQL (Locaweb DBaaS)
// Pool único reutilizado entre requisições. As credenciais vêm de variáveis de
// ambiente (.env.local em dev; variáveis do servidor em produção) — nunca no
// código versionado.
// =============================================================================
import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_POOL ?? 5),
      charset: "utf8mb4",
      timezone: "Z",
    });
  }
  return pool;
}

// Helper de consulta tipada. Uso: const rows = await query<MinhaLinha>(sql, [params]).
export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const [rows] = await getPool().query(sql, params);
  return rows as T[];
}
