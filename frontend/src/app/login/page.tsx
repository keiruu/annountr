import React from 'react'
import Image from 'next/image'

export default function login() {
  return (
    <section className='flex min-h-screen flex-col items-center justify-between p-24 bg-main-dark'>
      <div className='w-full rounded-lg border max-w-[737px] bg-[#232429] border-[#232429]'>
          <div className='px-14 py-10'>
            <div>
              <Image
              src="/assets/orienta_logo.png" 
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
                    className='bg-transparent border border-[#2D2F33] rounded-lg block w-full p-3' required />
                </div>
                <div className='pt-7'>
                    <label htmlFor="password" className='block mb-2 text-sm font-medium text-white'>Password</label>
                    <input type="password" name="password" id="password" 
                    className='bg-transparent border border-[#2D2F33] rounded-lg block w-full p-3' required />
                </div>
              </form>
              <div className='mt-10'>
                    <button type='submit' className='w-full text-black bg-[#0EBDF6] rounded-lg p-4 
                    font-semibold text-md'>Log in
                    </button>
              </div>
              <div className='mt-10'>
                <a href="#" className='text-sm font-medium text-[#0EBDF6] hover:underline'>Forgot your password?</a>
              </div>
              <div className='mt-5'>
                <a href="#" className='text-sm font-medium text-[#0EBDF6] hover:underline'>Don't have an account?</a>
              </div>
            </div>
          </div>
      </div>

    </section>
  )
}
