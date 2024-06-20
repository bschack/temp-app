'use client'

import { useSessionContext } from "@/context/SessionContext";


export default function Secure() {
  const { session } = useSessionContext();

  if (session) {
    return (
      <div>
        <h1>Secure</h1>
        Do secure stuff here
      </div>
    )
  }
  
  return <h1>No User Permission</h1>
}
