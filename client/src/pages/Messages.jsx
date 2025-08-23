import React, { use, useState } from 'react'
import { assets, dummyConnectionsData, dummyMessagesData } from '../assets/assets'
import { Eye, MessageSquare } from 'lucide-react'
import {motion} from 'framer-motion'
import {useNavigate} from 'react-router-dom'

const Messages = () => {
  const [message, setMessage] = useState([])
  const fetchMessages = async () => {
    setMessage(dummyMessagesData)

  }
  useState(() => {
    fetchMessages();
  }, [])

  
  const navigate = useNavigate()
  return (
    <motion.div
    initial={{opacity:0,y:150}}
            animate = {{opacity:1,y:0}}
            transition={{duration:1.5}}
     className='min-h-screen sm:w-[100%] w-[100vw] sm:w-[100%]  relative sm:pl-10 pb-10'  >
      <p className='font-bold text-4xl sm:text-5xl mt-10 '>Messages</p>
      <p className='text-sm sm:text-lg mt-[-1px] text-[#45556C]' >Talk to your friends and family</p>

      {/* for height purposes  */}
      <div className="h-10"></div>
      {/*connected users */}

      {
        dummyConnectionsData.map((itm) => (
          <div className="sm:w-[55%] w-[90%] rounded-sm shadow  my-3 bg-white flex items-center justify-center pt-3 p-2 gap-3 h-auto min-h-35">
            <div className="h-full w-[90%]  flex items-start justify-start gap-3">
              <img src={itm.profile_picture} className='w-10 h-10 rounded-full ml-2'></img>
              <div className="h-full flex-col items-start justify-start">
                <p className='text-sm font-semibold'>{itm.full_name}</p>

                <p className='text-sm text-slate-500 '>@{itm.username}</p>
                <p className='text-sm text-gray-500'>{itm.bio}</p>

              </div>
            </div>
            <div className="h-full flex flex-col gap-5">
              <button onClick={()=>navigate(`/messages/${itm._id}`)} className="active:scale-95 size-10 text-slate-800 flex items-center justify-center rounded-sm bg-slate-100 hover:bg-slate-200 cursor-pointer ">
               <MessageSquare className='w-4 h-4'/>
              </button>


              <button onClick={()=>navigate(`/profile/${itm._id}`)} className="active:scale-95 size-10 text-slate-800 flex items-center justify-center rounded-sm bg-slate-100 hover:bg-slate-200 cursor-pointer ">
               <Eye className='w-4 h-4'/ >
              </button>
            </div>
          </div>
        ))

      }
     

      


    </motion.div>
  )
}

export default Messages