import { BadgeCheck, Heart, MessageCircle, Share2 } from 'lucide-react'
import moment from 'moment'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {useAuth} from '@clerk/clerk-react'
import {toast} from 'react-hot-toast'
import { api } from '../api/axios'

const PostCard = ({ itm }) => {
  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.user?.value)
  const {getToken} = useAuth()

  // Safely handle likes
  const [likes, setLikes] = useState(itm?.likes_count || [])

  const handleLike = async () => {
   try {
    const token = await getToken()
    const {data} = await api.post('/api/post/like',{postId:itm._id},{
      headers:{
        Authorization : `Bearer ${token}`
      }
    })
    if(data.success){
      toast.success(data.message)
      setLikes(prev =>{
        if(prev.includes(currentUser._id)){
          return  prev.filter(id => id !== currentUser._id)
        }else{
          return [...prev,currentUser._id]
        }
      })
    }

   } catch (error) {
    toast.error(error)
    
    
   }
  }

  if (!itm) return null // Prevent rendering if no post data

  return (
    <div className="relative max-w-2xl w-full rounded-lg shadow-lg min-h-30 h-auto py-4 px-4 flex flex-col items-start justify-start">
      {/**------------- user info ----------- */}
      <div className="w-full flex items-center justify-start gap-2">
        <img
          onClick={() => navigate(`/profile/${itm?.user?._id || ''}`)}
          src={itm?.user?.profile_picture || '/default-avatar.png'}
          alt="profile"
          className="mb-4 active:scale-95 w-11 h-11 rounded-full cursor-pointer"
        />

        <div className="h-full flex flex-col items-start justify-start">
          <div className="text-bold flex gap-2 items-center">
            <span className="font-semibold">{itm?.user?.full_name || 'Unknown User'}</span>
            <BadgeCheck className="text-blue-400" size={18} />
          </div>
          <p className="text-sm text-gray-600">
            {itm?.user?.email || 'no-email'} • {moment(itm?.createdAt).fromNow()}
          </p>
        </div>
      </div>

      {/*------------ content ------------- */}
      {itm?.content && (
        <div
          className="my-4 text-gray-800 whitespace-pre-line text-sm"
          dangerouslySetInnerHTML={{
            __html: itm.content.replace(
              /(#\w+)/g,
              '<span class="text-indigo-600">$1</span>'
            ),
          }}
        />
      )}

      {/*----- images ---------- */}
      {itm?.image_urls?.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {itm.image_urls.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="post"
              className={`w-full h-48 object-cover ${
                itm.image_urls.length === 1 ? 'col-span-2 h-auto' : ''
              }`}
            />
          ))}
        </div>
      )}

      {/*--- bottom ---- */}
      <div className="w-full mt-4">
        <hr className="w-full bg-gray-100" />
        <div className="w-full flex items-center justify-start gap-3 mb-2 mt-2">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={handleLike}
          >
            <Heart
              className={`${
                currentUser && likes.includes(currentUser._id)
                  ? 'text-red-500 fill-red-500'
                  : ''
              }`}
              size={17}
            />
            <p className="text-sm">{likes.length}</p>
          </div>

          <div className="flex items-center gap-1 cursor-pointer">
            <MessageCircle size={17} />
            <p className="text-sm">19</p>
          </div>

          <div onCanPlay={()=>navigate()} className="flex items-center gap-1 cursor-pointer">
            <Share2 size={17} />
            <p className="text-sm">90</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard
