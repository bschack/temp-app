'use client'

import { useSessionContext } from "@/context/SessionContext";

export default function Admin() {
  const { session } = useSessionContext();

  if (session && session.userRole === 'admin') {
    return (
      <div>
        <h1>Admin</h1>
        Do admin stuff here
      </div>
    )
  }
  
  return <h1>No User Permission</h1>
}