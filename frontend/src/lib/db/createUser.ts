'use server';

import { hashPassword } from "@/auth";
import { pool } from "@/lib/db";

export const createUser = async (email: string, name: string, password: string): Promise<boolean> => {
  const client = await pool.connect();

  try {
    const encryptedPassword = await hashPassword(password);
    const result = await client.query('INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING *', [email, name, encryptedPassword]);

    if (result.rows.length) {
      return true;
    } else {
      throw new Error(`No user with email ${email}`);
    }
  } catch (err: any) {
    throw new Error(`${err.message}`);
  } finally {
    client.release();
  }
};
