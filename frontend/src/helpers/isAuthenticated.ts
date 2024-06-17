'use server';
import { cookies } from "next/headers";
import { getCookie } from "typescript-cookie";

export const isAuthenticated = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token"); //getCookie('token');

  console.log(token);
  return token ? true : false;
}