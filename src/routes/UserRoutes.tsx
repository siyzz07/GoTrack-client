import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/userPages/Login'
import Signup from '../pages/userPages/Signup'

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
        </Routes>
    )
}

export default UserRoutes