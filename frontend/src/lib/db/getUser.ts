'use server';

import { pool } from "@/lib/db";
import { User, UserSchema } from "@/lib/zod";

export const getUserByEmail = async (email: string): Promise<User> => {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);

    if (result.rows.length) {
      const { error, data: user } = await UserSchema.safeParseAsync(result.rows[0]);

      if (error) throw new Error(`Error parsing user data: ${error}`);

      return user;
    } else {
      throw new Error(`No user with email ${email}`);
    }
  } catch (err: any) {
    throw new Error(`${err.message}`);
  } finally {
    client.release();
  }
};
