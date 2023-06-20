"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, {useState} from 'react'
import { FaHome, FaUserAlt, FaQuestionCircle } from 'react-icons/fa'
import { TbLogout } from 'react-icons/tb'
import { signOut } from "next-auth/react"

const MenuItem = (props : any) => {
  const path = usePathname()

  return (
    <Link href={props.link ? props.link : '/'}>
      <div className={`${path === props.link ? 'bg-main-dark border-accent-1' : 'border-secondary-dark'} border-l-2 my-2 flex gap-5 items-center pl-8 py-4 transition-all hover:bg-main-dark`}>
        {props.icon}
        <p className='text-base'>{props.name}</p>
      </div>
    </Link>
  );
};


export default function Sidebar() {

  return (
    <div className='font-work bg-secondary-dark min-h-screen min-w-56 w-80'>
      <img src='/assets/annountr.svg' alt='Annountr logo' className='pl-8 py-6 w-24'/>
      <div className='mt-4 flex-col flex justify-between h-[76vh]'>
        <div>
          <MenuItem link='/' name='Home' icon={<FaHome size={20}/>}/>
          <MenuItem link='/profile' name='Profile' icon={<FaUserAlt size={20}/>}/>
        </div>
        <div className=''>
          <MenuItem link='/help' name='Help' icon={<FaQuestionCircle size={20}/>}/>
          <div className='cursor-pointer border-secondary-dark border-l-2 my-2 flex gap-5 items-center pl-8 py-4 transition-all hover:bg-main-dark'
            onClick={() => signOut({
              callbackUrl: '/login'
            })}
          >
            <TbLogout size={20}/>
            <p className='text-base'>Logout</p>
          </div>
        </div>
      </div>
    </div>
  )
}
