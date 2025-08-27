import { Search } from 'lucide-react'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { dummyConnectionsData } from '../assets/assets'
import UserComponent from '../components/UserComponent'

const Discover = () => {
  const [input, setInput] = useState("")
  const [users, setUsers] = useState(dummyConnectionsData)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      setUsers([])
      setLoading(true)
      setTimeout(() => {
        setUsers(dummyConnectionsData)
        setLoading(false)
      }, 1000)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 150 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5 }} className="min-h-screen w-[100vw] sm:w-full relative sm:pl-10 pb-10">
      {/* Heading */}
      <p className="font-bold text-4xl sm:text-5xl mt-10">Discover People</p>
      <p className="text-sm sm:text-lg mt-[-1px] text-[#45556C]">
        Connect with amazing people and grow your network
      </p>

      {/* Search Bar */}
      <div className="w-[90%] sm:w-[85%] flex items-center justify-center py-3 px-4 rounded-sm shadow-lg mt-10">
        <div className="w-full border border-gray-300 h-10 rounded flex items-center justify-start px-2 py-2">
          <Search className="text-gray-400" />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyUp={handleSearch}
            placeholder="Search people by name, username, bio, or location..."
            className="h-full w-full outline-none border-none px-4 placeholder:text-sm"
          />
        </div>
      </div>

      {/* User List / Loader */}
      <div className="sm:w-full w-[90%] mt-14 flex flex-wrap items-center sm:justify-start justify-center  gap-3 min-h-[200px]">
        {!loading ? (
          users.length > 0 ? (
            users.map((user) => <UserComponent key={user._id} user={user} />)
          ) : (
            <p className="text-gray-500 text-sm">No users found</p>
          )
        ) : (
          <div className="w-full flex items-center justify-center">
            <div className="flex gap-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full bg-purple-500 shadow-purple-400 shadow-md"
                  animate={{ y: [0, -12, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Discover
