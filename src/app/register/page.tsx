"use client"
import { Button } from '@/components/ui/button';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react'
import {auth, db} from '@/lib/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';

export interface ErrorForm {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}


const page = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ErrorForm>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const newErrors = {} as ErrorForm;

    if (!name.trim()) {
      newErrors.name = "Name is required!";
    }
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = "Email is required!";
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long!";
    }
    if (password!== confirmPassword) {
      newErrors.confirmPassword = "Passwords are not the same!";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSumbit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (validateForm()) {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, {
          name,
          email
        });
        router.push('/');
        setErrors({});
      } else {
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <div className='flex justify-center items-center h-screen m-2'>
      <form action="" onSubmit={handleSumbit} className='space-y-2 sm:space-y-4 w-full max-w-md shadow-primary rounded-md py-5 px-4 sm:p-10 flex flex-col gap-2'>
        <h1 className='text-2xl text-center font-semibold text-primary-500'>Communi</h1>
        <div className='space-y-2'>
          <label htmlFor="name" className='block'>Name</label>
          <input placeholder='Enter your name' type="text" id="name" className='w-full border px-3 py-2 rounded dark:bg-dark-4' value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <p className='text-red-400'>{errors.name}</p>}
        </div>
        <div className='space-y-2'>
          <label htmlFor="email" className='block'>Email</label>
          <input placeholder='Enter your email' type="email" id="email" className='w-full border px-3 py-2 rounded dark:bg-dark-4' value={email} onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <p className='text-red-400'>{errors.email}</p>}
        </div>
        <div className='space-y-2'>
          <label htmlFor="password" className='block'>Password</label>
          <input type="password" placeholder='Enter your password' id="password" className='w-full border px-3 py-2 rounded dark:bg-dark-4' value={password} onChange={(e) => setPassword(e.target.value)} />
          {errors.password && <p className='text-red-400'>{errors.password}</p>}
        </div>
        <div className='space-y-2'>
          <label htmlFor="confirmPassword" className='block'>Confirm Password</label>
          <input type="password" placeholder='Confirm password' id="confirmPassword" className='w-full border px-3 py-2 rounded dark:bg-dark-4' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          {errors.confirmPassword && <p className='text-red-400'>{errors.confirmPassword}</p>}
        </div>
        <div className="flex flex-auto flex-wrap gap-1 self-center align-center justify-center">
          <span className='text-center'>Already have an Account? </span>
          <Link className='text-primary-500 hover:underline' href='/login'>Sign in</Link>
        </div>
        <Button className='overflow-hidden flex-auto' variant='primary' type="submit" onClick={() => console.log('Register')}>{loading ? <span className="loader"></span> : "Register"}</Button>
      </form>
    </div>
  )
}

export default page