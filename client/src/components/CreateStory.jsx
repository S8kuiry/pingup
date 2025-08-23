import { ArrowLeftIcon, Sparkle, Star, Text, Upload } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import {motion} from 'framer-motion'
const CreateStory = () => {
    const bgColor = ["#4F46E5", "#7C3AED", "#DB2777", "#E11D48", "#CA8A04", "#0D9488"]
    const { setCreateStory } = useContext(AppContext)
    const [background, setBackground] = useState(bgColor[0])
    const [text, setText] = useState("")
    const [media, setMedia] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [mode, setMode] = useState("text")

    const handleMediaUpload = async (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setMedia(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }
    const handleCreateStory = async () => {
        setText(""),
            setMedia(null)
        setPreviewUrl(null)

    }


    return (
        <div className='fixed inset-0 bg-black/70 backdrop-blur-xs z-12 flex items-center justify-center '>
            <motion.div 
            initial={{opacity:0,y:150}}
            animate = {{opacity:1,y:0}}
            transition={{duration:2}}
            
            className="relative sm:w-[28%] w-[80%] auto flex flex-col items-center justify-start">
                <div className="absolute left-0 top-0">
                    < ArrowLeftIcon onClick={() => setCreateStory(false)} className='text-white hover:scale-110 transition-all duration-250 cursor-pointer ' />
                </div>
                <div className="text-white  text-semibold text-lg">Create Story</div>
                {
                    mode === "text" && (
                        <textarea onChange={(e) => setText(e.target.value)} className={`resize-none w-full rounded-lg bg-[${background}] mt-5 pt-4 pl-4  text-white outline-none focus:none h-88`} placeholder="What's on your mind?">

                        </textarea>

                    )

                }
                {
                    mode === "media" && previewUrl && (
                        media?.type.startsWith('image') ? (
                            <div className={`resize-none w-full rounded-lg bg-[${background}] mt-5   text-white outline-none focus:none h-88 flex items-center justify-center overflow-hidden`} placeholder="What's on your mind?">

                                <img src={previewUrl} className='object-contain h-88 max-h-full max-w-full '></img>

                            </div>

                        ) : (
                            <div className={`resize-none w-full rounded-lg bg-[${background}] mt-5  text-white outline-none focus:none h-88 flex items-center justify-center`} placeholder="What's on your mind?">
                                <video src={previewUrl} className='object-contain h-88 max-h-full max-w-full '></video>

                            </div>

                        )

                    )
                }

                <div className="w-full flex items-center justify-start gap-1 my-3">

                    {
                        bgColor.map((itm) => (
                            <span onClick={() => setBackground(itm)} className={`border border-white rounded-full py-2 px-2 bg-[${itm}] cursor-pointer`}></span>

                        ))
                    }

                </div>
                <div className="w-full flex items-center justify-between my-2 ">


                    <div
                        onClick={() => {
                            setMode("text");
                            setMedia(null);
                            setPreviewUrl(null);
                        }}
                        className={`${mode === "text" ? "bg-white text-black" : "bg-zinc-800 text-white"} w-[49%] py-3 rounded-xs cursor-pointer`}
                    >
                        <div className="w-full h-full flex items-center justify-center text-xs gap-2">
                            <Text size={14} />
                            <p>Text</p>
                        </div>
                    </div>

                    <div
                        className={`${mode === "media" ? "bg-white text-black" : "bg-[#27272A] text-white"} w-[49%] py-3 rounded-xs cursor-pointer`}
                    >
                        <label className={`w-full h-full flex items-center justify-center   text-xs gap-2`}>
                            <Upload size={14} />
                            <p>Photo/Video</p>
                            <input
                                hidden
                                type="file"
                                accept="image/*,video/*"
                                className="w-[100%] h-[100%]"
                                onChange={(e) => {
                                    handleMediaUpload(e);
                                    setMode("media");
                                    e.target.value = "";
                                }}
                            />
                        </label>
                    </div>

                </div>
                <div onClick={() =>
                    toast.promise(
                        handleCreateStory(), // make sure this RETURNS a Promise
                        {
                            loading: 'Saving...',
                            success: <p>Story created 🎉</p>,
                            error: e => <p>{e.message}</p>
                        }
                    )
                } className="rounded-xs my-2 w-full py-3 text-white text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-[#615FFF] to-[#9810FA]">
                    <Sparkle size={15} />
                    <p>Create Story</p>
                </div>


            </motion.div>
        </div>
    )
}

export default CreateStory