import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { dummyUserData } from '../assets/assets'
import Loading from '../components/Loading'

const Layout = () => {
  const user = dummyUserData

  return user ? (
    <div className="w-full fixed inset-0 overflow-y-scroll overflow-x-scroll bg-slate-50 flex min-h-screen  ">
      {/* Sidebar - fixed width */}
      <div className="w-64 p-0">
        <Sidebar />
      </div>

      {/* Main content - takes the rest of the space */}
      <div className="relative flex-1  px-6 py-2">
        <Outlet />
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default Layout
