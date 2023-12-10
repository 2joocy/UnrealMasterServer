import pg from "pg";

export default class SessionRepository {
  private pool: pg.Pool;

  constructor(pool: pg.Pool) {
    this.pool = pool;
  }

  public async create(id: string, server_id: string) {
    const client = await this.pool.connect();
    await client.query(
      `
            INSERT INTO sessions (id, server_id)
            VALUES ($1, $2);
            `,
      [id, server_id]
    );
    client.release();
  }

  public async read(id: string) {
    const client = await this.pool.connect();
    const result = await client.query(
      `
                SELECT * FROM sessions
                WHERE id = $1;
                `,
      [id]
    );
    client.release();
    return result.rows[0];
  }

  public async readAll() {
    const client = await this.pool.connect();
    const result = await client.query(
      `
                SELECT * FROM sessions;
                `
    );
    client.release();
    return result.rows;
  }

  public async updateSession(id: string) {
    const client = await this.pool.connect();
    await client.query(
      `
            UPDATE sessions
            SET updated_at = NOW() at time zone 'utc'
            WHERE id = $1;
            `,
      [id]
    );
    client.release();
  }

  async getActiveSessions() {
    const client = await this.pool.connect();
    const result = await client.query(
      `
      SELECT server_id FROM sessions
      WHERE updated_at > (now() at time zone 'utc') - INTERVAL '1 minute'
      GROUP BY server_id;
      `
    );
    client.release();
    return result.rows;
  }

  async init() {
    const client = await this.pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        server_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT (now() at time zone 'utc') NOT NULL,
        updated_at TIMESTAMP DEFAULT (now() at time zone 'utc') NOT NULL,
        FOREIGN KEY (server_id) REFERENCES servers(id)
      );
    `);
    client.release();
  }
}
