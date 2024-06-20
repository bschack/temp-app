'use server'

import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const getUserSession = async () => {
  try {
    const session = cookies().get('session');

    // console.log(session);
    if (!session) return false;

    return jwt.verify(session.value, process.env.AUTH_SECRET as string);
  } catch (e: any) {
    if (e instanceof TokenExpiredError) {
      console.error('Session has expired');
      return false;
    }
    console.error('Failed to get user session', e);
    return false;
  }
};

export const getUserData = async () => {
  try {
    const userData = cookies().get('userData');
    if (!userData) return null;

    return JSON.parse(userData.value);
  } catch (e: any) {
    console.error('Failed to get user data', e);
    return null;
  }
}

export const clearUserSession = async () => {
  try {
    const cookieStore = cookies();
    // cookieStore.getAll().forEach((cookie) => {
    //   cookieStore.delete(cookie.name);
    // });
    cookieStore.delete('session');
  } catch (e: any) {
    console.error('Failed to clear user session', e);
  }
}
