import React, { use, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, dummyPostsData, dummyUserData } from '../assets/assets';
import Loading from '../components/Loading';
import { Calendar, Edit,  MapPin, User } from 'lucide-react';
import moment from 'moment'
import { motion } from 'framer-motion'
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';  // ✅ correct Link
import ShowEdit from '../components/ShowEdit';
import { AppContext } from '../context/AppContext';

const Profile = () => {
  const { profileId } = useParams();
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('posts')
  const [posts, setPosts] = useState([])
 const {showEdit, setShowEdit} = useContext(AppContext)


  const fetchUser = async () => {
    setUser(dummyUserData);
    setPosts(dummyPostsData)
  }
  useEffect(() => {
    fetchUser()
  }, [])

  return user ? (
    <>
    <motion.div
      initial={{ opacity: 0, y: 150 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5 }}

      className=' pt-15  min-h-screen sm:w-[100%] w-[100vw] sm:w-[100%]  relative sm:pl-10 pb-20 flex flex-col sm:items-center items-start justify-start
     gap-4'
    >

      {/*--------- profile card section ------------- */}
      <div className="sm:w-[55%] w-[90%] rounded-xl h-103 shadow shadow-md ">
        {/*------- top section --------- */}
        <div className="w-full h-[52%]">
          <img src={user.cover_photo} className='rounded-t-xl object-fit  w-full h-full'></img>
        </div>
        {/*-------- bottom section -------------- */}
        <div className="relative w-full h-[48%] flex flex-col items-end justify-start py-4 px-5">


          {/*--------- profile pic ----- */}


          <div className="rounded-full w-auto h-auto p-1 absolute top-[-25px] left-2 sm:left-3 bg-white shadow">
            {user.profile_picture? <img className='rounded-full w-15 h-15 sm:w-20 sm:h-20 ' src={user.profile_picture}></img> : <div className="p-5"><User className='sm:w-9 sm:h-9 w-5 h-5 ' /></div>}
          </div>


          {/*---- user info --------- */}
          <div className="w-[85%] flex items-center justify-between gap-10">

            <div className="h-full flex flex-col items-start justify-start">
              <p className='font-semibold text-sm'>{user.full_name}</p>
              {user.username ? <p className='text-sm text-gray-600'>@{user.username}</p> : <p className='text-sm text-gray-600'>@ Add a Username</p>}
              {user.bio && <p className='text-xs text-gray-600' >@{user.bio}</p>}


            </div>

            {profileId && <div className="h-full flex items-start justify-center">
              <button onClick={() => setShowEdit(true)} className='cursor-pointer rounded-sm py-1 px-2 border border-gray-400 flex items-center gap-2 text-sm'><Edit size={14} /> Edit</button>
            </div>}


          </div>
          {/*------ loaction and  others  -------*/}
          <div className="w-[85%]  flex items-center justify-start gap-5 text-gray-600 mt-3 text-xs">
            <div className="flex items-center justify-center gap-1">
              <MapPin size={14} />
              <p>{user.location ? user.location : "Add Location"}</p>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Calendar size={14} />
              <p >Joined {moment(user.createdAt).fromNow()}</p>
            </div>
          </div>
          <hr className='w-[85%] text-gray-400 mt-5 mb-4'></hr>
          {/* floweers followinf info */}
          <div className="w-[85%] flex items-center justify-start gap-6 mt-1 text-gray-600">
            <div className="">
              <p><span className='font-bold  '>{user.posts.length}</span>  <span className='text-sm text-gray-600'>Posts</span></p>


            </div>

            <div className="">
              <p><span className='font-bold  '>{user.followers.length}</span>  <span className='text-sm text-gray-600'>Followers</span></p>


            </div>

            <div className="">
              <p><span className='font-bold  '>{user.following.length}</span>  <span className='text-sm text-gray-600'>Folowing</span></p>


            </div>

          </div>



        </div>


      </div>

      {/*--------- tabs --------- */}
      <div className="sm:w-[40%] w-[90%] flex items-center justify-between py-2 px-1 rounded-sm bg-white shadow mt-5">
        {
          ['posts', 'media', 'likes'].map((itm) => (
            <div onClick={() => setActiveTab(itm)} className={`cursor-pointer gap-3 h-8 rounded-sm text-gray-400 flex items-center justify-center   px-10  text-sm ${activeTab === itm ? "bg-[#4F39F6] text-white transition-all duration-600" : ""}`} >{itm[0].toUpperCase() + itm.slice(1)}</div>
          ))
        }

      </div>
      {/*------- media -------------- */}
{activeTab === "media" && (
  <div className="sm:max-w-4xl w-[90%] flex flex-wrap itsm-center justify-center gap-1 mt-5 mb-10">
    {posts
      .filter((post) => post.image_urls.length > 0)
      .map((post) => (
        <div key={post._id} className="sm:max-w-xs max-w-2xl w-full  sm:w-65 h-44">
          {post.image_urls.map((img, idx) => (
            <>
            <Link   key={idx} className="relative block group w-full h-full">
              <img
                src={img}
                alt="post"
                className="w-full h-full object-cover "
              />
              <p className="transition-all duration-300 hidden absolute group-hover:flex inset-0 bg-black/30 items-end justify-end p-2 text-white text-xs">
                Posted : {moment(post.createdAt).fromNow()}
              </p>
            </Link>
            
            </>
            
          ))}
        </div>
      ))}
  </div>
)}


      {/*--------- posts -------- */}
      {activeTab === "posts" && 
      (<div className="sm:w-full w-[90%] flex flex-col items-center mt-5 mt-5 ">
        {
          posts.map((post)=>(
            <PostCard itm={post}/ >
          ))
        }
      </div>)
      }
     
    </motion.div>
    {showEdit && <ShowEdit user={user}/>}

    </>
    
  ) : (
    <Loading />
  )
}

export default Profile