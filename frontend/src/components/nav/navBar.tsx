'use client'

import Link from "next/link";
import { useSessionContext } from "@/context/SessionContext";

import styles from "./navBar.module.css";

const NavBar = () => {
  const { session, loading, signOut } = useSessionContext();

  if (loading) return <p>Loading...</p>;

  // console.log(session);

  return (
    <nav className={styles.nav}>
      <div>
        <Link href="/">
          <h3>Ben&apos;s Test Website</h3>
        </Link>
      </div>
      {session ? (
        <div className={styles.linkGroup}>
          <Link href="/secure">Secure</Link>
          {session.userRole === 'admin' && <Link href="/admin">Admin</Link>}
          <div onClick={signOut} className={styles.logout}>Logout</div>
        </div>
      ) : (
          <div className={styles.linkGroup}>
            <Link href="/sign-in">Sign In</Link>
          </div>
      )}
    </nav>
  );
};

export default NavBar;
