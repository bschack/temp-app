'use server';

import { HomePageData } from "@/components/Data";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import styles from "./page.module.css";

export default async function Home() {
  const token = cookies().get("token");

  if (!token) {
    redirect("/login");
  }

  return (
    <main className={styles.main}>
      <h1>Home</h1>
      <HomePageData jwtToken={token} />
    </main>
  );
}
