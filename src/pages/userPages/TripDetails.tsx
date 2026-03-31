import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import VehicleMap from '../../components/map/VehicleMap';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpeedIcon from '@mui/icons-material/Speed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { fetchTripById } from '../../services/apiService.ts/tripApiService';

const TripDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (id) {
                const data = await fetchTripById(id);
                setTrip(data);
            }
            setLoading(false);
        };
        load();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-t-blue-600 border-gray-200 animate-spin"></div>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Trip Not Found</h2>
                <button 
                    onClick={() => navigate('/trips')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                    Back to History
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Navbar back button header */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 shadow-sm sticky top-0 z-10 w-full mb-6">
                <button 
                    onClick={() => navigate('/trips')}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <ArrowBackIcon className="text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Trip Overview</h1>
            </nav>

            <main className="max-w-5xl mx-auto px-6 pb-20">
                {/* Trip Header Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <DirectionsCarIcon fontSize="small" />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Distance</span>
                        </div>
                        <div className="text-2xl font-black text-blue-600">{trip.distance}</div>
                    </div>
                    <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <SpeedIcon fontSize="small" />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Avg Speed</span>
                        </div>
                        <div className="text-2xl font-black text-gray-800">{trip.avgSpeed}</div>
                    </div>
                    <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <AccessTimeIcon fontSize="small" />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Duration</span>
                        </div>
                        <div className="text-2xl font-black text-gray-800">{trip.duration}</div>
                    </div>
                    <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 text-gray-400 mb-1 text-red-400">
                            <LocationOnIcon fontSize="small" />
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Recorded</span>
                        </div>
                        <div className="text-xl font-bold text-gray-800">{trip.date}</div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm mb-8">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-gray-800">
                            <LocationOnIcon className="text-blue-600" />
                            Route Trail
                        </div>
                        <div className="text-[10px] text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase font-bold tracking-widest">
                            GPS Verified
                        </div>
                    </div>
                    <div className="h-[400px]">
                        <VehicleMap center={[10.0159, 76.3419]} zoom={13} />
                    </div>
                </div>

                {/* Itinerary Timeline */}
                <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm">
                    <h3 className="text-lg font-bold mb-8 text-gray-800">Trip Itinerary</h3>
                    <div className="relative space-y-8">
                        <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gray-100"></div>
                        
                        <div className="flex gap-6 relative">
                            <div className="w-3.5 h-3.5 bg-blue-600 rounded-full border-4 border-white shadow-sm z-10 transition-transform hover:scale-110"></div>
                            <div>
                                <div className="font-bold text-gray-900">Start Location</div>
                                <div className="text-gray-500 mt-1">{trip.origin}</div>
                                <div className="text-xs text-gray-400 mt-2 font-medium">8:30 AM</div>
                            </div>
                        </div>

                        <div className="flex gap-6 relative">
                            <div className="w-3.5 h-3.5 bg-red-500 rounded-full border-4 border-white shadow-sm z-10 transition-transform hover:scale-110"></div>
                            <div>
                                <div className="font-bold text-gray-900">End Destination</div>
                                <div className="text-gray-500 mt-1">{trip.destination}</div>
                                <div className="text-xs text-gray-400 mt-2 font-medium">9:05 AM</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TripDetails;
