import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { fetchTrips, addTrip } from '../../services/apiService.ts/tripApiService';

const Trips = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        origin: '', destination: '', distance: '', duration: '', avgSpeed: ''
    });

    useEffect(() => {
        const load = async () => {
            const data = await fetchTrips();
            setTrips(data);
            setLoading(false);
        };
        load();
    }, []);

    const handleAddTrip = async (e: React.FormEvent) => {
        e.preventDefault();
        const added = await addTrip({ ...formData, hasFile: !!file });
        setTrips([added, ...trips]);
        setShowModal(false);
        setFormData({ origin: '', destination: '', distance: '', duration: '', avgSpeed: '' });
        setFile(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Header / Navbar section in list page */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10 w-full mb-6 max-h-[80px]">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/')}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <ArrowBackIcon className="text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Trip History</h1>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-sm"
                >
                    <AddIcon fontSize="small" />
                    New Trip
                </button>
            </div>

            <main className="max-w-4xl mx-auto px-6">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 rounded-full border-2 border-t-blue-600 border-gray-200 animate-spin"></div>
                    </div>
                ) : trips.length > 0 ? (
                    <div className="space-y-4 pb-20">
                        {trips.map((trip) => (
                            <div 
                                key={trip.id}
                                onClick={() => navigate(`/trip/${trip.id}`)}
                                className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <DirectionsCarIcon />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-1 text-sm text-gray-400 font-medium tracking-tight mb-1">
                                                <span>{trip.date}</span>
                                                <span className="mx-1">•</span>
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                                    trip.status === 'Ongoing' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                                                }`}>
                                                    {trip.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 font-bold text-gray-800">
                                                <LocationOnIcon fontSize="inherit" className="text-red-400" />
                                                <span>{trip.origin}</span>
                                                <span className="text-gray-400 font-normal">→</span>
                                                <LocationOnIcon fontSize="inherit" className="text-blue-600" />
                                                <span>{trip.destination}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto text-sm">
                                        <div className="text-xl font-extrabold text-blue-700">{trip.distance}</div>
                                        <div className="text-gray-400 font-medium">{trip.duration}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-center">
                        <HistoryIcon className="text-gray-200 mb-4" style={{ fontSize: 64 }} />
                        <p className="text-lg">No trips found in your account.</p>
                        <button 
                            onClick={() => setShowModal(true)}
                            className="mt-4 text-blue-600 hover:underline font-bold"
                        >
                            Add your first trip now
                        </button>
                    </div>
                )}
            </main>

            {/* Modal - Same standard style as Home */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-8 relative animate-in fade-in zoom-in duration-200">
                        <button 
                            onClick={() => setShowModal(false)}
                            className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <CloseIcon />
                        </button>
                        
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Log Travel Data</h2>

                        <form onSubmit={handleAddTrip} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">From</label>
                                    <input 
                                        required
                                        type="text" 
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500"
                                        value={formData.origin}
                                        onChange={(e) => setFormData({...formData, origin: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">To</label>
                                    <input 
                                        required
                                        type="text" 
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500"
                                        value={formData.destination}
                                        onChange={(e) => setFormData({...formData, destination: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Log File Attachment</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                                    <input 
                                        type="file" 
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    />
                                    <CloudUploadIcon className={file ? 'text-blue-600' : 'text-gray-300'} />
                                    <p className="mt-2 text-sm text-gray-600">
                                        {file ? file.name : 'Select trip data file'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Distance (KM)</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500"
                                        value={formData.distance}
                                        onChange={(e) => setFormData({...formData, distance: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Average Speed</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500"
                                        value={formData.avgSpeed}
                                        onChange={(e) => setFormData({...formData, avgSpeed: e.target.value})}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-colors">
                                Confirm Entry
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Trips;
