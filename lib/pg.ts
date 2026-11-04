import { Pool, type QueryResult, type QueryResultRow } from "pg";

let poolInstance: Pool | null = null;

export function getPgPool(): Pool | null {
  const connStr = process.env.DATABASE_URL || process.env.DIRECT_URL;
  if (!connStr) return null;

  if (!poolInstance) {
    poolInstance = new Pool({
      connectionString: connStr,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 8000,
    });

    poolInstance.on("error", (err) => {
      console.error("[PostgreSQL Pool Error]:", err);
    });
  }

  return poolInstance;
}

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T> | null> {
  const pool = getPgPool();
  if (!pool) return null;
  try {
    return await pool.query<T>(text, params);
  } catch (err) {
    console.error("[PostgreSQL Query Error]:", { text, error: err });
    return null;
  }
}
