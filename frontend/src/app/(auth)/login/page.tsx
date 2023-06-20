'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ThreeDots  } from  'react-loader-spinner'
import { signIn } from 'next-auth/react'

export default function login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   setUser(localStorage.getItem('user') as string)
  // }, [])

  const handleLogin = async (e : any) => {
    e.preventDefault();

    try {
      setLoading(true)
      const result = await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: '/'
      })
    } catch (error) {
      console.log(error)
      // Handle any login errors
    } finally {
      setLoading(false)
    }
  };

  return (
    <section className='flex min-h-screen h-[90vh] flex-col items-center justify-center bg-main-dark'>
      <div className='w-full rounded-lg border max-w-[737px] bg-[#232429] border-[#232429]'>
          <div className='px-14 py-10'>
            <div>
              <Image
              src="/assets/annountr.svg" 
              width={70}
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
                  type='submit' className='w-full text-black transition-all hover:border-accent-2 border-2 border-accent-1 bg-accent-1 rounded-lg p-4 font-semibold text-md'>
                  {loading ?  
                        <div className='w-full flex items-center justify-center'>
                          <ThreeDots 
                            height="20"
                            width="20"
                            color="#000000"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            visible={true}
                          />
                        </div> : 'Log in'}
                </button>
              </div>
              <div className='mt-10'>
                <a href="#" className='text-sm text-[#0EBDF6] hover:underline'>Forgot your password?</a>
              </div>
              <div className='mt-5'>
                <Link href='/register' className=' text-sm text-[#0EBDF6] hover:underline'>Don't have an account?</Link>
              </div>
            </div>
          </div>
      </div>

    </section>
  )
}
