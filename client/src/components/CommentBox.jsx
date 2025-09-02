import React, { useState } from 'react'

const CommentBox = () => {
  const [text, setText] = useState("")
  return (
    <div className="w-full h-auto min-h-30 py-3">
      {/** Enter Comment Section */}
      <div className="w-full  py-1 h-12 flex items-center justify-center gap-3 border border-gray-300 rounded-xs  px-2">
        <input className='w-[85%] outline-none border-none resize-none' placeholder='Enter Your Comment...'></input>
        <button className='text-white rounded-xs h-[100%] w-[15%] bg-purple-800' >Post</button>

      </div>
      {/*---- fetch Comment Section -------- */}
      <div className="w-full flex flex-col items-start justify-start border-1 border-gray-300 my-2 h-105 overflow-y-scroll ">

        
      </div>
    </div>

  )
}

export default CommentBox