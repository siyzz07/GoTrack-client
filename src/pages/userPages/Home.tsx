import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HistoryIcon from '@mui/icons-material/History';
import { fetchTrips, addTrip } from '../../services/apiService.ts/tripApiService';

const Home = () => {
    const navigate = useNavigate();
    const [recentTrips, setRecentTrips] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        origin: '', destination: '', distance: '', duration: '', avgSpeed: ''
    });

    useEffect(() => {
        const load = async () => {
            const data = await fetchTrips();
            setRecentTrips(data.slice(0, 5));
        };
        load();
    }, []);

    const handleAddTrip = async (e: React.FormEvent) => {
        e.preventDefault();
        const added = await addTrip({ ...formData, hasFile: !!file });
        setRecentTrips([added, ...recentTrips].slice(0, 5));
        setShowModal(false);
        setFormData({ origin: '', destination: '', distance: '', duration: '', avgSpeed: '' });
        setFile(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Standard Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 w-full px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2 font-bold text-xl text-blue-600 cursor-pointer" onClick={() => navigate('/')}>
                    <DirectionsCarIcon />
                    <span>GoTrack</span>
                </div>
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => navigate('/trips')}
                        className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                    >
                        History
                    </button>
                    <button 
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
                        onClick={() => setShowModal(true)}
                    >
                        Add Trip
                    </button>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto p-6 md:p-10">
                {/* Hero / Header Section */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold mb-4 text-gray-800">Vehicle Trip Dashboard</h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Manage your vehicle journeys, track distances, and maintain travel logs in one place.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <HistoryIcon className="text-blue-600" /> Recent Journeys
                    </h2>
                    <button 
                        onClick={() => navigate('/trips')}
                        className="text-blue-600 hover:underline font-semibold"
                    >
                        See all trips →
                    </button>
                </div>

                {/* Content Area */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    {recentTrips.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {recentTrips.map((trip) => (
                                <div 
                                    key={trip.id}
                                    onClick={() => navigate(`/trip/${trip.id}`)}
                                    className="p-5 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center transition-transform group-hover:scale-105">
                                            <DirectionsCarIcon />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800">{trip.origin} → {trip.destination}</div>
                                            <div className="text-sm text-gray-500 mt-0.5">{trip.date} • {trip.status}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-gray-900">{trip.distance}</div>
                                        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">{trip.duration}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center text-gray-400">
                            <DirectionsCarIcon fontSize="large" className="mb-4 opacity-10" />
                            <p>No trips logged yet. Get started by adding your first trip!</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Standard Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity">
                    <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-8 relative animate-in fade-in zoom-in duration-200">
                        <button 
                            onClick={() => setShowModal(false)}
                            className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <CloseIcon />
                        </button>
                        
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Trip</h2>

                        <form onSubmit={handleAddTrip} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Starting Location</label>
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="e.g. Kakkanad"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        value={formData.origin}
                                        onChange={(e) => setFormData({...formData, origin: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">End Destination</label>
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="e.g. Aluva"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        value={formData.destination}
                                        onChange={(e) => setFormData({...formData, destination: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Upload Log / CSV</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                                    <input 
                                        type="file" 
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    />
                                    <CloudUploadIcon className={file ? 'text-blue-600' : 'text-gray-300'} />
                                    <p className="mt-2 text-sm text-gray-600">
                                        {file ? file.name : 'Click or drop log file here'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Distance (KM)</label>
                                    <input 
                                        type="text" placeholder="10"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500"
                                        value={formData.distance}
                                        onChange={(e) => setFormData({...formData, distance: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Speed</label>
                                    <input 
                                        type="text" placeholder="40"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500"
                                        value={formData.avgSpeed}
                                        onChange={(e) => setFormData({...formData, avgSpeed: e.target.value})}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-colors shadow-md active:scale-95">
                                Save Trip Details
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
