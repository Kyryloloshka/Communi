"use client"
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const page = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  return (
    <div className='flex justify-center items-center h-screen p-100 m-2'>
      <form action="" className='space-y-4 w-full max-w-md shadow-lg p-10 flex flex-col gap-2'>
        <h1 className='text-xl text-center font-semibold text-primary-500'>Communi</h1>
        <div className='space-y-2'>
          <label htmlFor="name" className='block'>Name</label>
          <input type="text" id="name" className='w-full border px-3 py-2 rounded' value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className='space-y-2'>
          <label htmlFor="email" className='block'>Email</label>
          <input type="email" id="email" className='w-full border px-3 py-2 rounded' value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className='space-y-2'>
          <label htmlFor="password" className='block'>Password</label>
          <input type="password" id="password" className='w-full border px-3 py-2 rounded' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className='space-y-2'>
          <label htmlFor="confirmPassword" className='block'>Confirm Password</label>
          <input type="password" id="confirmPassword" className='w-full border px-3 py-2 rounded' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <div className='space-y-2 self-end'>
          <Button variant='default' onClick={() => console.log('Register')}>Register</Button>
        </div>
      </form>
    </div>
  )
}

export default page