"use client"

import { DatePickerComponent } from '@/components/datepicker'
import { useEffect, useState, useReducer } from 'react'
import { getSession, useSession } from 'next-auth/react'
import Modal from 'react-modal'
import * as announcement from '@/api/announcement'
import Announcement from '@/components/announcement'
import { redirect } from 'next/navigation'
import ReactHtmlParser from 'react-html-parser'
import { Scrollbars } from 'react-custom-scrollbars'
import { Circles  } from  'react-loader-spinner'
import { IoClose } from 'react-icons/io5'
import { FaEdit, FaRegClock, FaTrash } from 'react-icons/fa'
import { setAnnouncements } from '@/store/features/announcement/announcementSlice'

export default function Home({ params }: { params: { id: string } }) {
  interface UserModel {
    id: string,
    fullname : string,
    email: string
  }
  
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [aisOpen, asetIsOpen] = useState<boolean>(false)

  const [deadline, setDeadline] = useState<any>(null)

  const [selectAnnouncement, setSelectAnnouncement] = useState<any>(null)
  const [deadlineAnnouncements, setDeadlineAnnouncements] = useState<any>({})
  const [generalAnnouncements, setGeneralAnnouncements] = useState<any>({})
  
  const [update, setUpdate] = useState(false)
  const [loading, setLoading] = useState(true)
  const [edit, setEdit] = useState(false)

  const [user, setUser] = useState<UserModel>()
  const { data: session} = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })


  const getDate = (date : Date) => {
    setDeadline(date)
  };

  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const submitAnnouncement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    interface Announcement {
      title : string,
      desc : string,
      deadline : boolean,
      date : any
    }
    
    const target = e.target as typeof e.target & {
      title: { value: string };
      desc: { value: string };
    };
    
    const text = target.desc.value;
    const replacedText = text.replace(/\n/g, '<br/>');

    const data : Announcement = {
      title: target.title.value,
      desc : replacedText,
      deadline : isChecked,
      date : deadline ? deadline : null                                                
    }

    try {
      const user = await getUser()
      const response : any = await announcement.addAnnouncement(data, user.id);
      setIsOpen(false)
    } catch (error) {
      // Handle any login errors
    } finally {
      setUpdate(!update)
      console.log(update)
    }
  };

  const getUser = async () => {
    try {
      const session : any = await getSession();

      if (session) {
        return session.token.user
      } else {
        console.log("No active session");
        redirect('/login')
      }
    } catch (error) {
      // Handle any login errors
    }
  }

  const deleteAnnouncement = async (announcementId: string) => {
    try {
      const user = await getUser()
      if (user) {
        const response : any = await announcement.deleteAnnouncement(user.id, announcementId)
        asetIsOpen(false)
      } else {
        console.log("No active session");
        redirect('/login')
      }
    } catch (error) {
      // Handle any login errors
    } finally {
      setUpdate(!update)
    }
  }

  const editAnnouncement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    interface Announcement {
      id: string,
      title : string,
      desc : string,
    }
    
    const target = e.target as typeof e.target & {
      title: { value: string };
      desc: { value: string };
    };
    
    const text = target.desc.value;
    const replacedText = text.replace(/\n/g, '<br/>');

    const data : Announcement = {
      id:  selectAnnouncement.id,
      title: target.title.value,
      desc : replacedText,                                             
    }

    try {
      const user = await getUser()
      const response : any = await announcement.updateAnnouncement(data, user.id);
      // asetIsOpen(false)
    } catch (error) {
      // Handle any login errors
    } finally {
      setSelectAnnouncement({...selectAnnouncement, desc: selectAnnouncement.desc.replace(/\n/g, '<br/>')})
      setEdit(false)
      setUpdate(!update)
    }
  };

  const getAnnouncements = async () => {
    try {
      const user = await getUser()
      if (user) {
        const response : any = await announcement.getAnnouncements(user.id)
        return response.data.data // list of announcements
      } else {
        console.log("No active session");
        redirect('/login')
      }
    } catch (error) {
      // Handle any login errors
    } finally {
      // setUpdate(!update)
    }
  };
  
  useEffect(() => {
    try {
      (async () => {
        await getUser().then((session) => setUser(session))
      })();
      (async () => {
        await getAnnouncements().then((response) => {
          if(response) {
            const general = response.filter((announcement : any) => announcement.category === 'general');
            const deadline = response.filter((announcement : any) => announcement.category === 'deadline');
  
            setDeadlineAnnouncements(deadline)
            setGeneralAnnouncements(general)
            console.log(response)
            setLoading(false)
          }
        })
      })();
    } catch (e) {
      
    } finally {
      // setLoading(false)
    }
  
    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await getAnnouncements()
        if(response) {
          const general = response.filter((announcement : any) => announcement.category === 'general');
          const deadline = response.filter((announcement : any) => announcement.category === 'deadline');

          setDeadlineAnnouncements(deadline)
          setGeneralAnnouncements(general)
        }
      } catch (e) {
        console.log('Somethiing went wron')
      }
    })()
  }, [update])
  
  const date = `${new Date().getDate()}/${new Date().getDay()}/${new Date().getFullYear()}`

  return (
    <>
      {loading ? 
        <div className='absolute top-1/2 left-[60%] transform -translate-x-1/2 -translate-y-1/2'>
          <Circles
            height="80"
            width="80"
            color="#0EBDF6"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div> :
        
        

        <main className='p-8 mx-auto'>

        {/* Create Modal */}
        <Modal
          isOpen={isOpen}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.75)'
            },
            content: {
              borderRadius: '14px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '656px',
              height: '580px',
              border: '1px solid #323033',
              background: '#1D1E22',
            }
          }}
        >
          <div className='font-work p-4'>
            <div className='w-full flex justify-between items-center'>
              <h2 className='text-4xl pb-3'>Create an Announcement</h2>
              <button onClick={() => setIsOpen(false)} className='cursor-pointer text-color-1 transition-all hover:text-white'>
                <IoClose size={30}/>
              </button>
            </div>
            <hr className='border-accent-3'/>
            <form className='space-y-5 pt-4'
              onSubmit={submitAnnouncement} 
            >
              <div className='flex flex-col gap-2'>
                <label htmlFor='title'>Title</label>
                <input name='title' type='text' placeholder='Enter Announcement Title' className='border border-accent-3 bg-transparent p-3 rounded-[7px]'/>
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='desc'>Description</label>
                <textarea name='desc' rows={4} placeholder='Enter Announcement Description' className='border border-accent-3 resize-none bg-transparent p-3 rounded-[7px]'/>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-3'>
                  <label htmlFor='deadline'>With Deadline</label>
                  <input name='deadline' type='checkbox'
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className='border border-accent-3 bg-transparent p-3 rounded-[7px]'/>
                </div>
                <span className={isChecked ? 'visible' : 'invisible'}><DatePickerComponent onDateChange={getDate}/></span>
              </div>

              <div className='w-full flex justify-end space-x-3'>
                <button onClick={() => setIsOpen(false)} className='px-6 py-4 rounded-[7px] border border-accent-3 bg-transparent transition-all hover:border-white hover:text-white'>Cancel</button>
                <button type='submit' className='px-6 py-4 rounded-[7px] border border-accent-3 text-main-dark bg-accent-2 transition-all hover:text-white'>Confirm</button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Announcement Modal */}
        <Modal
          isOpen={aisOpen}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.75)'
            },
            content: {
              borderRadius: '14px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '656px',
              minHeight: '90%',
              border: '1px solid #323033',
              background: '#1D1E22',
              overflow: 'hidden'
            }
          }}
        >
          {selectAnnouncement && (
            <form className='font-work p-4' onSubmit={editAnnouncement}>
              <div className='w-full flex justify-between items-center'>
                {edit ? 
                  <input id='title' type='text' className='text-3xl bg-transparent underline w-full flex flex-wrap' 
                    onChange={(event) => setSelectAnnouncement({...selectAnnouncement, title: event.target.value})} 
                    value={selectAnnouncement.title}></input> 
                  : <h2 className='text-3xl'>{selectAnnouncement.title}</h2>}
                <button onClick={() => {
                  asetIsOpen(false)
                  setEdit(false)
                }} className='cursor-pointer text-color-1 transition-all hover:text-white'>
                  <IoClose size={30}/>
                </button>
              </div>
              {selectAnnouncement.deadline && <span className='flex gap-3 items-center'>
                <FaRegClock/>
                <p>{selectAnnouncement.deadline}</p>
              </span>}
              
              <hr className='border-accent-3 mt-3'/>
              <div className='pt-3 h-80 overflow-y-auto'>
                <Scrollbars>
                  {edit ? 
                    <textarea id='desc' name='desc'
                      onChange={(event) => setSelectAnnouncement({...selectAnnouncement, desc: event.target.value})}
                      value={selectAnnouncement.desc.replace(/<br\/>/g, '\n')}
                      className='bg-transparent h-full w-full'
                    ></textarea>
                  : ReactHtmlParser(selectAnnouncement.desc)}
                </Scrollbars>
              </div>
              <hr className='border-accent-3 mt-8'/>
              <div className='w-full flex justify-between space-x-3 mt-6'>
                <div className='flex gap-10 text-[#767676]'>
                  <button type='button' onClick={() => deleteAnnouncement(selectAnnouncement.id)} className=''><FaTrash size={25}/></button>
                  <button type='button' onClick={() => setEdit(!edit)} className=''><FaEdit size={25}/></button>
                </div>
                {edit ? 
                <button type='submit' className='px-6 py-4 rounded-[7px] border border-accent-3 bg-transparent'>
                  Save
                </button>
                : 
                <button type='button' onClick={() => {
                  asetIsOpen(false) 
                  setEdit(false)
                }} className='px-6 py-4 rounded-[7px] border border-accent-3 bg-transparent'>
                  Close
                </button>}
              </div>
            </form>
          )}
        </Modal>
          
      
        {/* Header */}
        <div className='flex justify-between pb-5'>
          <div>
            <h1 className='font-bold text-4xl'>Welcome, {user && user.fullname}</h1>
            <p className='text-color-1'>Today is {date}</p>
          </div>

          <button onClick={() => setIsOpen(true)} className='bg-secondary-dark rounded-lg px-4 py-2'>
            + Add Announcement
          </button>
        </div>
        <hr className='border-[#232429]'/>

        {/* Content */}
        <div className='flex gap-14 pt-6'>
          <div className='space-y-3'>
            <h2 className='font-semibold text-2xl'>Deadline</h2>
            {Array.isArray(deadlineAnnouncements)
              ? deadlineAnnouncements.map(element => {
                  return <div onClick={() => {
                    const dateObject = new Date(element.date)
                    const formattedDate = dateObject.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    });
                    
                    asetIsOpen(true)
                    setSelectAnnouncement({
                      id: element.id,
                      title: element.title,
                      desc: element.desc,
                      deadline: formattedDate
                    })
                  }} className='cursor-pointer'>
                    <Announcement id={element.id} deadline={element.date} title={element.title} desc={element.desc}/>
                  </div>;
                })
              : null}
          </div>
          <div className='space-y-3'>
            <h2 className='font-semibold text-2xl'>General Announcements</h2>
            {Array.isArray(generalAnnouncements)
              ? generalAnnouncements.map(element => {
                  return <div onClick={() => {
                    asetIsOpen(true)
                    setSelectAnnouncement({
                      id: element.id,
                      title: element.title,
                      desc: element.desc
                    })
                  }}
                  className='cursor-pointer'>
                    <Announcement id={element.id} title={element.title} desc={element.desc}/>
                  </div>;
                })
              : null}
          </div>
        </div>
        </main>
      }
    </>
  )
}
