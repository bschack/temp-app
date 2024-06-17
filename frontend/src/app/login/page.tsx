'use client';

import { userLogin } from "@/api/userEvents";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const loginResult = await userLogin(username, password);

    setLoading(false);

    if (loginResult.success) {
      setMessage(loginResult.message);
      router.push('/');
    } else {
      setError(true);
    }
  }
  
  return (
    <main>
      <h1>Login</h1>
      <p>{message}</p>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username</label>
          <input 
            type="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" disabled={loading}>Login {loading && "..."}</button>
      </form>
    </main>
  );
}