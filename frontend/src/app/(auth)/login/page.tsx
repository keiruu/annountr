'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as auth from '../../../api/user'

export default function login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e : any) => {
    e.preventDefault();

    try {
      const response : any = await auth.loginUser({email, password});
      console.log(response)
    } catch (error) {
      // Handle any login errors
    }
  };

  return (
    <section className='flex min-h-screen h-[90vh] flex-col items-center justify-center bg-main-dark'>
      <div className='w-full rounded-lg border max-w-[737px] bg-[#232429] border-[#232429]'>
          <div className='px-14 py-10'>
            <div>
              <Image
              src="/assets/annountr.svg" 
              width={156}
              height={66}
              alt="Orienta Logo"
              />
            </div>
            <div>
              <h1 className='text-2xl text-white font-bold pt-10'>
                Log in
              </h1>
              <form className='pt-5' action="#">
                <div>
                    <label htmlFor="email" className='block mb-2 text-sm font-medium text-white'>Email</label>
                    <input type="email" name="email" id="email" 
                    onChange={(e) => setEmail(e.target.value)}
                    className='bg-transparent border border-[#2D2F33] rounded-lg block w-full p-3' required />
                </div>
                <div className='pt-7'>
                    <label htmlFor="password" className='block mb-2 text-sm font-medium text-white'>Password</label>
                    <input type="password" name="password" id="password" 
                    onChange={(e) => setPassword(e.target.value)}
                    className='bg-transparent border border-[#2D2F33] rounded-lg block w-full p-3' required />
                </div>
              </form>
              <div className='mt-10'>
                    <button 
                      onClick={handleLogin}
                      type='submit' className='w-full text-black bg-[#0EBDF6] rounded-lg p-4 font-semibold text-md'>
                      Log in
                    </button>
              </div>
              <div className='mt-10'>
                <a href="#" className='text-sm text-[#0EBDF6] hover:underline'>Forgot your password?</a>
              </div>
              <div className='mt-5'>
                <Link href='/register' className='text-sm text-[#0EBDF6] hover:underline'>Don't have an account?</Link>
              </div>
            </div>
          </div>
      </div>

    </section>
  )
}
