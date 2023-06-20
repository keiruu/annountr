import React from 'react'
import { FaRegClock } from 'react-icons/fa'

export default function Announcement( props : any ) {
  const dateObject = props.deadline ? new Date(props.deadline) : new Date();
  const formattedDate = dateObject.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  
  return (
    <div className='cursor-pointer bg-secondary-dark rounded-[14px] p-4 w-fit max-w-[300px] min-w-[300px]'>
      <h3 className='text-lg'>{props.title}</h3>
      {props.deadline && 
      <div className=' text-[#e08282] flex gap-2 items-center'>
        <FaRegClock/>
        <p>{formattedDate}</p>
      </div>
      }
      <p className='truncate text-color-1'>{props.desc}</p>
    </div>
  )
}

