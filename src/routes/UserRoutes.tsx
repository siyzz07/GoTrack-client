import { Route, Routes } from 'react-router-dom'
import Login from '../pages/userPages/Login'
import Signup from '../pages/userPages/Signup'
import Home from '../pages/userPages/Home'
import Trips from '../pages/userPages/Trips'
import TripDetails from '../pages/userPages/TripDetails'

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/trip/:id" element={<TripDetails />} />
        </Routes>
    )
}

export default UserRoutes