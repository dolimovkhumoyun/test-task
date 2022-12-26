import database, { DBQuery } from "../common/dbConnection";
import { FullUser, User } from "../routes/users/types";

export default class Users {
  static async auth(username: string, password: string) {
    const { rows } = await database.query(
      `SELECT 
        username, full_name, phone_number
      FROM 
        users 
      WHERE 
        username = $1 AND password = md5(md5(md5($2)))
      LIMIT 1;`,
      [username, password]
    );

    return rows[0] || null;
  }

  static async getUsers(page: number) {
    const limit = 10;
    const offset = (page - 1) * limit;
    const { rows } = await database.query(`SELECT username, full_name, phone_number FROM users LIMIT $1 OFFSET $2`, [
      limit,
      offset,
    ]);

    return rows;
  }

  static async getUser(userId: number) {
    const { rows } = await database.query(`SELECT username, full_name, phone_number FROM users WHERE id = $1`, [
      userId,
    ]);

    return rows;
  }

  static async createUser(userData: User) {
    const { username, password, full_name, phone_number } = userData;
    await database.query(
      `INSERT INTO users(username, password, full_name, phone_number) VALUES ($1, md5(md5(md5($2))), $3, $4) RETURNING username, full_name, phone_number;`,
      [username, password, full_name, phone_number]
    );

    return userData;
  }

  static async updateUser(userData: FullUser) {
    const { id, username, password, full_name, phone_number } = userData;
    await database.query(
      `UPDATE users 
      SET 
      username = COALESCE($1, username), password = COALESCE(md5(md5(md5($2))), password),
      full_name = COALESCE($3, full_name), phone_number = COALESCE($4, phone_number) 
      WHERE id = $5 
      RETURNING username, full_name, phone_number;`,
      [username, password, full_name, phone_number, id]
    );

    return userData;
  }
}
