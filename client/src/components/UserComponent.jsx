import { MapPin, MessageCircle, Plus, UserPlus } from 'lucide-react'
import React from 'react'
import { dummyUserData } from '../assets/assets'

const UserComponent = ({ user }) => {
    const currentUser = dummyUserData
    const handleFollow = async () => {

    }

    const handleConnectionRequest = async () => {

    }
    return (
        <div key={user._id} className='rounded-md border border-gray-300 flex flex-col items-center justify-start p-4 w-70 h-auto min-h-60 gap-2'>
            <img src={user.profile_picture} className='w-15 h-15 rounded-full ' ></img>
            <p className='font-semibold text-sm'>{user.full_name}</p>
            {user.username && <p className='text-sm'>@{user.username}</p>}
            {user.bio && <p className='text-xs text-center'>{user.bio}</p>}

            <div className="w-full flex items-center justify-center gap-2 my-3">
                <div className="flex items-center gap-1 text-xs border border-gray-500 rounded-[50px]  px-2 py-1 text-gray-600 ">
                    <MapPin className='w-4 h-4' />
                    <p>{user.location}</p>

                </div>
                <div className="flex items-center gap-1 text-xs border border-gray-500 rounded-[50px]  px-2 py-1 text-gray-600 ">

                    <p>{user.followers.length}</p>
                    <p>Followers</p>


                </div>
            </div>
            <div className="w-full flex items-center justify-center gap-3 ">
                {/*------- follow button ---------- */}
                <button onClick={handleFollow} disabled={currentUser?.following.includes(user._id)} className='w-full flex
                 items-center justify-center gap-2  bg-gradient-to-r from-[#615FFF] to-[#9810FA] rounded-sm text-white
                 hover:from-indigo-600 hover:to-purple-700 text-sm py-2 cursor-pointer '>
                    <UserPlus size={14}/> {currentUser?.following.includes(user._id)?"Following":"Follow"}
                </button>
                {/*----------- Connection button ----------- */}
                <button onClick={handleConnectionRequest} className='flex items-center rounded-md border border-gray-300 rounded-md p-2'>
                    {
                        currentUser?.connections.includes(user._id)?
                        <MessageCircle className='w-5 h-5 hover:scale-106 transition-all text-gray-500'/>:<Plus className='w-5 h-5 hover:scale-106 transition-all text-gray-500'/>
                    }
                </button>
            </div>
        </div>
    )
}

export default UserComponent