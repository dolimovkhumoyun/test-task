import { Pool } from "pg";
import CONFIG from "../config";

export type DBQuery = {
  statement: string;
  variables: Array<string | number>;
};

class Database {
  pool: Pool;

  constructor() {
    this.pool = new Pool(CONFIG.DB);
  }

  async queryInTransaction(queries: Array<DBQuery>) {
    const client = await this.pool.connect();
    const results = [];

    try {
      await client.query("BEGIN");

      for (const { statement, variables } of queries) {
        results.push(await client.query(statement, variables));
      }
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
    return results;
  }

  query(statement: string, variables: (string | number | Date | any)[] = []) {
    return this.pool.query(statement, variables);
  }

  end() {
    return this.pool.end();
  }
}

export default new Database();
