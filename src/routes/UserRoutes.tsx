import { Route, Routes } from 'react-router-dom'
import Login from '../pages/userPages/Login'
import Signup from '../pages/userPages/Signup'
import Home from '../pages/userPages/Home'
import TripDetails from '../pages/userPages/TripDetails'
import ProtectedRoute from './protectedRoute'
import PublicRoute from './publicRoute'

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/trip/:id" element={<ProtectedRoute><TripDetails /></ProtectedRoute>} />
        </Routes>
    )
}

export default UserRoutes