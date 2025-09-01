import React, { useRef, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import ChatBox from './pages/ChatBox'
import Connections from './pages/Connections'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import Layout from './pages/Layout'

import { useUser, useAuth } from '@clerk/clerk-react'
import { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { fetchUser } from './features/user/userSlice.js'
import { fetchConnections } from './features/connections/connectionSlice.js'
import { addMessage } from './features/messages/messagesSlice.js'

const App = () => {
  const { user } = useUser()
  const { getToken } = useAuth()
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const pathnameRef = useRef(pathname)

  // Keep track of current pathname
  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  // Fetch user and connections when logged in
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const token = await getToken()
        if (token) {
          dispatch(fetchUser(token))
          dispatch(fetchConnections(token))
        } else {
          console.log('No token yet')
        }
      }
    }

    fetchData()
  }, [user, getToken, dispatch])

  // SSE (Server Sent Events) for real-time messages
  useEffect(() => {
    if (!user) return

    const eventSource = new EventSource(
      `${import.meta.env.VITE_BASEURL}/api/message/${user.id}`
    )

    eventSource.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)

        if (pathnameRef.current === `/messages/${message.from_user_id}`) {
          dispatch(addMessage(message))
        } else {
          // You might show a toast/notification for new messages in other chats
        }
      } catch (err) {
        console.error('Error parsing SSE message:', err)
      }
    }

    eventSource.onerror = (err) => {
      console.error('SSE error:', err)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [user, dispatch])

  return (
    <div>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<ChatBox />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
