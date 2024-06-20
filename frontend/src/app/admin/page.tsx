'use client'

import { useSessionContext } from "@/context/SessionContext";
import { createUser } from "@/lib/db/createUser";
import { useState } from "react";

export default function Admin() {
  const { session } = useSessionContext();

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  const handleSubmit = async () => {
    try {
      const res = await createUser(user.email, user.name, user.password);
      if (res) alert('User created');
    } catch (error: any) {
      console.log(error.message);
    }
  }

  if (session && session.userRole === 'admin') {
    return (
      <div>
        <h1>Admin</h1>
        <section>
          <h3>Create User</h3>
          <input type="text" name="name" placeholder="Name" onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} />
          <input type="password" name='password' placeholder="Password" onChange={handleChange} />
          <button onClick={handleSubmit}>Create</button>
        </section>
      </div>
    )
  }
  
  return <h1>No User Permission</h1>
}