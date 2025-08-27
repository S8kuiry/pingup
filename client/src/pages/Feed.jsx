import React, { useEffect, useState } from 'react'
import { assets, dummyPostsData } from '../assets/assets'
import { BadgeCheck, Heart, Loader, MessageCircle, Share, Share2, } from 'lucide-react'
import Loading from '../components/Loading'
import StoriesBar from '../components/StoriesBar'
import moment from 'moment'
import PostCard from '../components/PostCard'
import RecentMessages from '../components/RecentMessages'
import {motion} from 'framer-motion'

const Feed = () => {
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(false)
  const fetchFeeds = async () => {
    setFeeds(dummyPostsData)
  }
  useEffect(() => {
    fetchFeeds()
  }, [])



  return !loading ? (
    <motion.div initial={{ opacity: 0, y: 150 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5 }} className='w-[90%] sm:w-[100%] mt-4 h-[100%] overflow-y-scroll py-10  xl:pr-5 flex items-start xl:justify-center xl:gap-8 gap-4'>
      {/*----- stories and post  section ---------- */}
      <div className="overflow-x-hidden   ">
        <StoriesBar />


        <div className=" py-6 px-1 space-y-6">
          {feeds.map((itm) => (
            <PostCard itm={itm} />

          ))}

        </div>
      </div>
      {/*--------- right sidebar ----------- */}
      <div className=" max-xl:hidden sticky top-0 ">
        <div className="max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow">
          <h1>Sponsored</h1>
          <img src={assets.sponsored_img} className='w-[100%] rounded-lg'></img>
          <div className="w-[100%] mt-2 flex flex-col items-start justify-start">
            <p className='font-medium text-[#45556C]'>Email Marketing</p>
            <p className='my-1 text-[#90A1B9]'>Supercharge your marketing with a powerful, easy-
              to-use platform built for results.</p>
          </div>

        </div>
        <RecentMessages/>




      </div>
    </motion.div>
  ) : (
    <Loading />
  )
}

export default Feed