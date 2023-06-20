'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ThreeDots  } from  'react-loader-spinner'
import * as auth from '@/api/user'
import type { RootState } from '@/store/store'
import { setUser } from '@/store/features/auth/authSlice'
import { useSelector, useDispatch } from 'react-redux';
import { redirect } from 'next/navigation'


export default function register() {
  const [email, setEmail] = useState('');
  const [fullname, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state : RootState) => state.auth.user);

  
  const handleRegister = async (e : any) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response : any = await auth.registerUser({fullname, email, password});
      dispatch(setUser(response.data.data.user))
      redirect('/login')
    } catch (error) {
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
                Create an Account
              </h1>
              <form className='pt-5' action="#">
                <div>
                    <label htmlFor="name" className='block mb-2 text-sm font-medium text-white'>Full Name</label>
                    <input type="text" name="name" id="name" 
                    onChange={(e) => setName(e.target.value)}
                    className='bg-transparent border border-[#2D2F33] rounded-lg block w-full p-3' required />
                </div>
                <div className='pt-5'>
                    <label htmlFor="email" className='block mb-2 text-sm font-medium text-white'>Email</label>
                    <input type="email" name="email" id="email" 
                    onChange={(e) => setEmail(e.target.value)}
                    className='bg-transparent border border-[#2D2F33] rounded-lg block w-full p-3' required />
                </div>
                <div className='pt-5'>
                    <label htmlFor="password" className='block mb-2 text-sm font-medium text-white'>Password</label>
                    <input type="password" name="password" id="password" 
                    onChange={(e) => setPassword(e.target.value)}
                    className='bg-transparent border border-[#2D2F33] rounded-lg block w-full p-3' required />
                </div>
              </form>
              <div className='mt-10'>
                    <button 
                      onClick={handleRegister}
                      type='submit' className='min-h-[56px] w-full text-black bg-[#0EBDF6] rounded-lg p-4 font-semibold text-md'>
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
                        </div> : 'Register'}
                    </button>
              </div>
              <div className='mt-5'>
                <Link href='/login' className='text-sm text-[#0EBDF6] hover:underline'>Already have an account?</Link>
              </div>
            </div>
          </div>
      </div>

    </section>
  )
}
