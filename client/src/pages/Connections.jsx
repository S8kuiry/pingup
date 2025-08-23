import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, UserCheck, UserPen, UserPlus, Users } from 'lucide-react'
import { dummyConnectionsData as connections,dummyFollowingData as following ,dummyFollowersData as followers ,dummyPendingConnectionsData as pending } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Connections = () => {
  const dataArray = [
  { label: "Followers",value:followers, icon: <Users size={14} /> },
  { label: "Following",value:following, icon: <UserCheck size={14} /> },
  { label: "Pending",value:pending, icon: <UserPen size={14} /> },
  { label: "Connections",value:connections, icon: <UserPlus size={14} /> },
]
const navigate = useNavigate()
  const [selectedList, setSelectedList] = useState(dataArray[0].label)
  return (
    <motion.div
      initial={{ opacity: 0, y: 150 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5 }}

      className=' min-h-screen sm:w-[100%] w-[100vw] sm:w-[100%]  relative sm:pl-10 pb-10 ' >
      <p className='font-bold text-4xl sm:text-5xl mt-10 '>Connections</p>
      <p className='text-sm sm:text-lg mt-[-1px] text-[#45556C]' >Manage your network and discover new connections</p>

      {/*------- flowwers following pending connections */}
      <div className="w-[90%] sm:w-full flex flex-wrap items-center  justify-start gap-6 mt-18">
        {
          dataArray.map((itm)=>(
             <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="bg-white rounded-sm shadow shadow-lg h-22 w-45  sm:w-40 flex flex-col items-center justify-center gap-1 cursor-pointer ">
          <p className='font-bold'>{itm.value.length}</p>
          <p className='text-[#45556C]'>{itm.label}</p>
        </motion.div>

          ))
        }
       

        
      </div>


      {/*-------------- followers following pending connections headers */}
      <div className="sm:w-[50%] w-[80%] bg-white flex items-center h-auto flex-wrap justify-start rounded-sm shadow shadow-lg mt-10 py-2 px-2 gap-6">
        {dataArray.map((itm, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedList(itm.label)}
            className={`cursor-pointer flex items-center gap-2 ${
              selectedList === itm.label ? "text-black" : "text-gray-400/90"
            }`}
          >
            <span className='text-xs'>{itm.icon}</span>
            <p className='text-sm font-semibold'>{itm.label}</p>
          </div>
        ))}
      </div>

      {/*--------- connections ---------- */}
      <div className="mt-12 flex flex-wrap w-[90%]  sm:w-[100%] gap-4">
        {
          dataArray.find((itm)=>itm.label === selectedList).value.map((item)=>(
            <div className="flex items-start justify-start shadow rounded-sm bg-white gap-2 py-3 px-5 w-[100%] sm:w-80 h-auto min-h-40 ">
              <img className='w-10 h-10 rounded-full ' src={item.profile_picture}></img>
              <div className="h-full flex flex-col items-start justify-start gap-1">
                <p className='text-sm font-semibold'>{item.full_name}</p>
                <p className='text-sm text-[#62748E]'>@{item.username}</p>
                <p className='text-xs text-[#4A5565]'>{item.bio.slice(0,90)}...</p>

                <div className="w-full flex items-center justify-center gap-2">
                  {console.log(item)}
                  {<button onClick={()=>navigate(`/profile/${item._id}`)} className='active:scale-0.95 cursor-pointer  text-sm w-full bg-gradient-to-r from-[#615FFF] to-[#9810FA] rounded-sm py-2 flex items-center justify-center text-[#FFFFFF]' >
                  View Profile
                </button>}
                {
                  selectedList === 'Following' &&
                  <button  className='active:scale-0.95 cursor-pointer  text-sm w-full bg-slate-200  rounded-sm py-2 flex items-center justify-center text-black' >
                  Unfollow
                </button>

                }
                {
                  selectedList === 'Pending' &&
                  <button  className='active:scale-0.95 cursor-pointer  text-sm w-full bg-slate-200 rounded-sm py-2 flex items-center justify-center text-[#000000]' >
                  Accept
                </button>

                }
                {
                  selectedList === 'Connections' &&
                  <button onClick={()=>navigate(`/messages/${item._id}`)} className='active:scale-0.95 cursor-pointer text-sm w-full bg-slate-200  rounded-sm py-2 flex items-center justify-center text-[#000000] gap-2' >
                    <MessageSquare className='w-4 h-4'/>
                  Message
                </button>

                }
                </div>
                
              </div>
              
            </div>
          ))
        }

      </div>
    </motion.div>
  )
}

export default Connections