import React, { useEffect, useRef, useState } from 'react'
import { dummyMessagesData, dummyUserData } from '../assets/assets'
import { Image, Send, SendHorizonal } from 'lucide-react'
import moment from 'moment'

const ChatBox = () => {
  const messages = dummyMessagesData
  const [text, setText] = useState("")
  const [image, setImage] = useState(null)
  const [user, setUser] = useState(dummyUserData)
  const messagesEndRef = useRef(null)

  

  const sendMessage = async () => { }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return user && (
    <div className="absolute flex flex-col bottom-0 left-[-16rem] sm:left-0 right-0 top-0">

      {/* --- Fixed header --- */}
      <div className="w-full h-15 border-b border-indigo-100 
        bg-gradient-to-r from-indigo-100 to-purple-100 py-2 px-2 
        flex items-center justify-start sticky top-0 z-10 shadow shadow-lg">
        <div className="flex flex-col items-start justify-start px-2">
          <p className="font-semibold">{user.full_name}</p>
          <p className="text-sm">@{user.username ? user.username : "Add Username"}</p>
        </div>
      </div>

      {/* --- Scrollable chat section --- */}
      <div className=" p-5 md:px-10 flex-1 overflow-y-scroll bg-gradient-to-b from-blue-100 to-indigo-300 relative">
        <div className="space-y-4 w-full max-w-6xl mx-auto ">
          {messages.toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((message, index) => (
            <div className={`flex flex-col  ${message.to_user_id === user._id ? "items-end" : "items-start"}`}>
              <div className={`my-2 relative bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-700 ${message.message_type === 'image' ? "bg-white" : ""} text-sm max-w-sm  text-slate-700 rounded-lg  ${message.to_user_id === user._id ? "rounded-bl-none" : "rounded-br-none"}`}>
                {
                  message.message_type === 'image' && <img src={message.media_url} className='w-full h-full max-w-sm rounded-lg mb-[-0.9rem] '></img>
                }
                <p className={`
  rounded-lg p-2 text-white
  ${message.to_user_id === user._id
                    ? "bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-700 rounded-bl-none"
                    : "bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-700 rounded-br-none"
                  }
`}>
                  {message.text}
                </p>
                <p className={`absolute [text-shadow:2px_2px_6px_rgba(0,0,0,0.4)] bottom-[-1.1rem] ${message.to_user_id === user._id?"right-0":"left-0"} text-white `}>{moment(message.createdAt).fromNow()}</p>
              </div>
              
            </div>

          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* --- Fixed sender --- */}
      <div className="w-full absolute bottom-13  lef-0 right-0 flex items-center justify-center">
        <div className='w-[55%] rounded-full bg-white h-12 flex items-center justify-center gap-3 '>
          <input onKeyDown={e=>e.key === "Enter" && sendMessage()} onChange={(e)=>setText(e.target.value)} className='p-2 w-[80%] rounded-full outline-none border-none h-full  ' placeholder='Type a message...'></input>
          <label>
            <input onChange={(e)=>setImage(e.target.files[0])} accept='image/*' className='w-full h-full ' hidden type="file"></input>
            {image? <img src={URL.createObjectURL(image)} className='h-full w-10 rounded'></img>:            <Image size={24} className='text-gray-400 cursor-pointer '/>
}
          </label>
          {/*--------- send button ---------- */}
          <span onClick={sendMessage()} className='rounded-full flex items-center justify-center  bg-gradient-to-b from-[#615FFF] to-[#9810FA] p-2'>
            <SendHorizonal className='w-5 h-5 text-white
            '/>
          </span>
        
        </div>
       
      </div>
    </div>
  )
}

export default ChatBox
