import { BadgeCheck, Heart, MessageCircle, Share2 } from 'lucide-react'
import moment from 'moment'
import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const PostCard = ({itm}) => {
    const [likes,setLikes] = useState(itm.likes_count)
    const currentUser = dummyUserData
    const handleLike = ()=>{
        
    }
    const navigate = useNavigate()

  return (
    <div className="relative max-w-2xl w-full rounded-lg shadow-lg min-h-30 h-auto py-4 px-4 flex flex-col items-start justify-start" >
              {/**------------- yser info ----------- */}
              <div className=" w-[100%] flex items-center justify-start gap-2">
                <img onClick={()=>navigate(`/profile/${itm._id}`)} src={itm.user.profile_picture} className='mb-4 active:scale-95 w-11 h-11 rounded-full'></img>



                <div className="h-full flex flex-col items-start justify-start ">
                  <div className='text-bold flex gap-2 items-center'><span className='font-semibold'>{itm.user.full_name}</span> <BadgeCheck className='text-blue-400' size={18} /></div>
                  <p>{itm.user.email} . {moment(itm.createdAt).fromNow()}</p>
                </div>

              </div>
              {/*------------ content ------------- */}
              {itm.content && <div className="my-4 text-gray-800 whitespace-pre-line text-sm"
              dangerouslySetInnerHTML={{__html:itm.content.replace(/(#\w+)/g,'<span class="text-indigo-600" >$1</span>')}}>

              </div>  }

              {/*----- images ---------- */}
              <div className="grid grid-cols-2 gap-2">
                {itm.image_urls.map((img)=>(
                  <img src={img} className={`w-full h-48 object-cover ${itm.image_urls.length === 1 && 'col-span-2 h-auto'}`}></img>
                ))}

              </div>

              {/*--- bottom ---- */}
              <div className="w-[100%]    mt-4">
                <hr className='w-full bg-gray-100 '></hr>
                <div className="w-full flex items-center justify-start gap-3 mb-2 mt-2 ">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <Heart onClick={handleLike} className={`${likes.includes(currentUser._id) && "text-red-500  fill-red-500"}`} size={17} />
                    <p className='text-sm'>{likes.length}</p>

                  </div>
                  <div className="flex items-center gap-1 cursor-pointer">
                    <MessageCircle size={17} />
                    <p className='text-sm'>19</p>


                  </div>
                  <div className="flex items-center gap-1 cursor-pointer">
                    <Share2 size={17} />
                    <p className='text-sm'>90</p>

                  </div>

                </div>
              </div>

            </div>
  )
}

export default PostCard