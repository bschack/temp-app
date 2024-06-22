'use client'

import { useSessionContext } from "@/context/SessionContext";


export default function Secure() {
  const { session } = useSessionContext();

  if (session) {
    return (
      <main>
        Do secure stuff here
      </main>
    )
  }
  
  return <h1>No User Permission</h1>
}
