'use server'

import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken';

import { getUserByEmail, pool } from "@/lib/db";
import { clearUserSession } from '@/auth/tokenUtils';
import { verifyPassword } from '@/auth';

type AuthResponse = {
  success: boolean,
  message: string,
}

export const authenticate = async (formData: { email: string, password: string }): Promise<AuthResponse> => {
  const email = formData.email;
  const password = formData.password;

  try {
    const user = await getUserByEmail(email);
    const { name, password: userPassword, image, role, id } = user;
    // console.log(userPassword, password)

    const isAuthenticated = await verifyPassword(password, userPassword);

    if (isAuthenticated) {
      const token = jwt.sign({ userId: id, userRole: role, name, image }, process.env.AUTH_SECRET as string, { expiresIn: '5h' });

      cookies().set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
        path: '/',
      })

      return {
        success: true,
        message: 'User authenticated',
      };
    } else {
      return {
        success: false,
        message: 'Authentication failed',
      };
    }
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
}

export const signOut = () => {
  clearUserSession();
  // redirect('/sign-in');
}