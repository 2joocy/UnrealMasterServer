import pg from "pg";

const { Pool } = pg;

export default class ServerRepository {
  private pool: pg.Pool;

  constructor(pool: pg.Pool) {
    this.pool = pool;
  }

  public async create(id: string, name: string, ip: string) {
    const client = await this.pool.connect();
    await client.query(
      `
        INSERT INTO servers (id, name, ip)
        VALUES ($1, $2, $3);
        `,
      [id, name, ip]
    );
    client.release();
  }

  public async read(id: string) {
    const client = await this.pool.connect();
    const result = await client.query(
      `
            SELECT * FROM servers
            WHERE id = $1;
            `,
      [id]
    );
    client.release();
    return result.rows[0];
  }

  public async readAllFromIds(ids: string[]) {
    const client = await this.pool.connect();
    const result = await client.query(
      `
            SELECT * FROM servers
            WHERE id = ANY($1);
            `,
      [ids]
    );
    client.release();
    return result.rows;
  }

  async init() {
    const client = await this.pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS servers (
        id TEXT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        ip VARCHAR(255) NOT NULL
      );
    `);
    client.release();
  }
}
