'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSessionContext } from '@/context/SessionContext'
import { authenticate } from '@/lib/actions'

import styles from './page.module.css'
 
export default function Page() {
  const router = useRouter();
  const { refetch } = useSessionContext();
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      const auth = await authenticate(formData);
      
      if (auth.success) {
        await refetch();
        router.push('/secure');
      } else {
        setError(auth.message);
      }
    } catch (error: any) {
      setError(error.message);
    }
  }

  return (
    <main className={styles.login_page}>
      <div className={styles.input_container}>
        <input className={styles.input} type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input className={styles.input} type="password" name='password' placeholder="Password" onChange={handleChange} />
        <button className={styles.submit} onClick={handleSubmit}>Login</button>
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </main>
  )
}