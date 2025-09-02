import React, { useState } from 'react'

const CommentBox = () => {
  const [text,setText] = useState("")
  return (
    <div className="w-full h-auto min-h-30 py-2">
      <input className='w-full outline-none border-1 border-gray-300 rounded-xs' placeholder='Enter Your Comment...'></input>

    </div>
  )
}

export default CommentBox