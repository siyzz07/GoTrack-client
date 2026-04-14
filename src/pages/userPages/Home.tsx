import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LogoutIcon from "@mui/icons-material/Logout";
import HistoryIcon from "@mui/icons-material/History";
import SearchIcon from "@mui/icons-material/Search";
import { logoutApi } from "../../services/apiService.ts/authApiService";
import { sessionService } from "../../utils/session.service";
import AddTrip from "../../components/trip/AddTrip";
import toast from "react-hot-toast";
import { userTripPlans } from "../../services/apiService.ts/tripApiService";

const Home = () => {
  const navigate = useNavigate();
  const [recentTrips, setRecentTrips] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const handleLogout = async () => {
    try {
      await logoutApi();
      sessionService.removeToken();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      sessionService.removeToken();
      navigate("/login");
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchTrips();
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, currentPage,showModal]);

  const fetchTrips = async () => {
    try {
      const response = await userTripPlans(searchQuery, currentPage, itemsPerPage);

      if (response.data) {
        setRecentTrips(response.data.data);
        setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("fech trips error", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Standard Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 w-full px-6 py-4 flex items-center justify-between shadow-sm">
        <div
          className="flex items-center gap-2 font-bold text-xl text-blue-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <DirectionsCarIcon />
          <span>GoTrack</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
            onClick={() => setShowModal(true)}
          >
            Add Trip
          </button>
          <button
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold transition-all px-2 py-1 rounded-md hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogoutIcon sx={{ fontSize: 20 }} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 md:p-10">
        {/* Hero / Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
            Vehicle Trip Dashboard
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Manage your vehicle journeys, track distances, and maintain travel
            logs in one place.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <HistoryIcon className="text-blue-600" /> Journeys
          </h2>

          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <SearchIcon sx={{ fontSize: 20 }} />
            </div>
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm shadow-blue-50/50"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {recentTrips.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentTrips.map((trip) => (
                <div
                  key={trip.id}
                  onClick={() => navigate(`/trip/${trip._id}`)}
                  className="p-5 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center transition-transform group-hover:scale-105">
                      <DirectionsCarIcon />
                    </div>
                    <div>
                      <div className=" text-gray-800">
                        Trip Name :{" "}
                        <span className="hover:text-blue-600 font-bold">
                          {trip.tripName}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-md font-bold text-gray-900">
                      id:<span className="text-blue-600">{trip.tripId}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-400">
              <DirectionsCarIcon fontSize="large" className="mb-4 opacity-10" />
              <p>
                {searchQuery
                  ? "No matching trips found."
                  : "No trips logged yet. Get started by adding your first trip!"}
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-400">Page</span>
              <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg font-black text-sm">
                {currentPage}
              </span>
              <span className="text-sm font-bold text-gray-400">of {totalPages}</span>
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Standard Modal */}
      {showModal && <AddTrip closePopup={setShowModal} />}
    </div>
  );
};

export default Home;
