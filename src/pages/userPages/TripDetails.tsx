import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SpeedIcon from "@mui/icons-material/Speed";
import { logoutApi } from "../../services/apiService.ts/authApiService";
import { sessionService } from "../../utils/session.service";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { tripDetails } from "../../services/apiService.ts/tripApiService";
import { getDistance } from "geolib";

// Leaflet standard icon fix
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconRetinaUrl: markerIcon2x,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [tripData, setTripData] = useState<any[]>([]);
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [endIndex, setEndIndex] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
    fetchTripDatas();
  }, [id]);

  const fetchTripDatas = async () => {
    try {
      if (!id) return;
      const response = await tripDetails(id as string);
      if (response.data) {
        const sorted = response.data.data.sort(
          (a: any, b: any) =>
            new Date(a.time).getTime() - new Date(b.time).getTime(),
        );
       let speedAdded = speedFind(sorted);

        setTripData(speedAdded);
      }
      setLoading(false);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "error to fetch datas");
      }
      setLoading(false);
      navigate(-1);
    }
  };

  const speedFind = (data: any[]) => {
    if (data.length === 0) return data;
    
    data[0].speed = 0;
    data[0].status = data[0].ignition === "off" ? "Stopped" : "Idle";

    for (let i = 1; i < data.length; i++) {
        const p1 = data[i - 1];
        const p2 = data[i];

        const distance = getDistance(
            { latitude: p1.location.coordinates[1], longitude: p1.location.coordinates[0] },
            { latitude: p2.location.coordinates[1], longitude: p2.location.coordinates[0] }
        );

        const timeDiff = (new Date(p2.time).getTime() - new Date(p1.time).getTime()) / (1000 * 60 * 60);
        const speed = timeDiff > 0 ? (distance / 1000) / timeDiff : 0;

        data[i].speed = speed;
        
        if (p1.ignition === "off") {
            data[i].status = "Stopped";
        } else if (distance === 0) {
            data[i].status = "Idle";
        } else if (speed > 60) {
            data[i].status = "Over Speeding";
        } else {
            data[i].status = "Moving";
        }
    }
    return data;
  };

  console.log('ppppp',tripData)

  const calculateDetailedStats = (startIx: number, endIx: number) => {
    if (tripData.length < 2) return { distance: 0, duration: 0, avgSpeed: 0, maxSpeed: 0, idleTime: 0, stopTime: 0 };

    let totalMeters = 0;
    let maxSpeed = 0;
    let idleMs = 0;
    let stopMs = 0;

    const start = Math.min(startIx, endIx);
    const end = Math.max(startIx, endIx);

    for (let i = start; i < end; i++) {
      const p1 = tripData[i];
      const p2 = tripData[i + 1];

      const d = getDistance(
        { latitude: p1.location.coordinates[1], longitude: p1.location.coordinates[0] },
        { latitude: p2.location.coordinates[1], longitude: p2.location.coordinates[0] }
      );
      totalMeters += d;

      const t1 = new Date(p1.time).getTime();
      const t2 = new Date(p2.time).getTime();
      const diffMs = t2 - t1;
      const speed = diffMs > 0 ? (d / 1000) / (diffMs / (1000 * 60 * 60)) : 0;

      if (speed > maxSpeed) maxSpeed = speed;

      if (p1.ignition === "off") {
        stopMs += diffMs;
      } else if (d === 0) {
        idleMs += diffMs;
      }
    }

    const tStart = new Date(tripData[start].time).getTime();
    const tEnd = new Date(tripData[end].time).getTime();
    const totalDurationMs = tEnd - tStart;
    const totalHours = totalDurationMs / (1000 * 60 * 60);
    const avgSpeed = totalHours > 0 ? (totalMeters / 1000) / totalHours : 0;

    return {
      distance: totalMeters / 1000,
      duration: totalDurationMs / (1000 * 60), // minutes
      avgSpeed: avgSpeed,
      maxSpeed: maxSpeed,
      idleTime: idleMs / (1000 * 60),
      stopTime: stopMs / (1000 * 60)
    };
  };

  const overallStats = useMemo(
    () => calculateDetailedStats(0, tripData.length - 1),
    [tripData],
  );
  const selectionStats = useMemo(
    () =>
      startIndex !== null && endIndex !== null
        ? calculateDetailedStats(startIndex, endIndex)
        : null,
    [startIndex, endIndex, tripData],
  );

  // Integrated Status-Aware Segments logic
  const segments = useMemo(() => {
    const results = [];
    for (let i = 0; i < tripData.length - 1; i++) {
      const p1 = tripData[i];
      const p2 = tripData[i + 1];
      
      const distance = getDistance(
        { latitude: p1.location.coordinates[1], longitude: p1.location.coordinates[0] },
        { latitude: p2.location.coordinates[1], longitude: p2.location.coordinates[0] }
      );
      
      const timeDiff = (new Date(p2.time).getTime() - new Date(p1.time).getTime()) / (1000 * 60 * 60);
      const speed = timeDiff > 0 ? (distance / 1000) / timeDiff : 0;

      let color = "#3b82f6"; // Moving - Blue
      let status = "Moving";

      if (p1.ignition === "off") {
        color = "#ef4444"; // Stopped - Red
        status = "Stopped";
      } else if (distance === 0) {
        color = "#f59e0b"; // Idle - Amber
        status = "Idle";
      } else if (speed > 60) {
        color = "#8b5cf6"; // Speeding - Purple
        status = "Over Speeding";
      }

      results.push({
        positions: [
          [p1.location.coordinates[1], p1.location.coordinates[0]],
          [p2.location.coordinates[1], p2.location.coordinates[0]],
        ],
        color,
        speed: speed.toFixed(1),
        status,
        time: new Date(p1.time).toLocaleTimeString(),
      });
    }
    return results;
  }, [tripData]);

  const selectionPath = useMemo(
    () =>
      startIndex !== null && endIndex !== null
        ? tripData
            .slice(
              Math.min(startIndex, endIndex),
              Math.max(startIndex, endIndex) + 1,
            )
            .map(
              (p) =>
                [p.location.coordinates[1], p.location.coordinates[0]] as [
                  number,
                  number,
                ],
            )
        : [],
    [startIndex, endIndex, tripData],
  );

  const handleMapPointSelect = (index: number) => {
    if (startIndex === null || (startIndex !== null && endIndex !== null)) {
      setStartIndex(index);
      setEndIndex(null);
    } else {
      setEndIndex(index);
    }
  };

  const totalPages = Math.ceil(tripData.length / itemsPerPage);
  const paginatedData = tripData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans tracking-tight">
        <div className="w-8 h-8 border-2 border-t-blue-600 animate-spin rounded-full"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-slate-700 font-sans tracking-tight">
      <nav className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-[1000]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowBackIcon />
          </button>
          <span className="font-bold text-gray-800 tracking-tight">
            Trip Discovery Center
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-red-500 font-bold transition-all"
        >
          <LogoutIcon fontSize="small" /> Logout
        </button>
      </nav>

      <main className="max-w-[1400px] mx-auto p-4 md:p-8">
        <div className="flex gap-6 mb-4 text-[11px] font-black uppercase tracking-widest text-slate-400/80">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-blue-200"></div>{" "}
            Moving
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 border border-red-200"></div>{" "}
            Stopped
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-amber-200"></div>{" "}
            Idle
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 border border-purple-200"></div>{" "}
            Over speeding
          </div>
        </div>

        {/* Monolithic Integrated Map */}
        <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-8 relative z-0">
          {tripData.length > 0 && (
            <MapContainer
              center={[
                tripData[0].location.coordinates[1],
                tripData[0].location.coordinates[0],
              ]}
              zoom={13}
              className="h-full w-full"
              scrollWheelZoom={true}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {segments.map((seg, idx) => (
                <Polyline
                  key={idx}
                  positions={seg.positions as any}
                  pathOptions={{
                    color: seg.color,
                    weight: 4,
                    lineJoin: "round",
                    opacity: 0.6,
                  }}
                >
                  <Popup>
                    <div className="p-1 min-w-[120px]">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Telemetry Log</div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-black text-slate-800">{seg.speed} KM/H</span>
                        <span className={`text-[9px] font-black px-1.5 rounded-sm ${seg.status === 'Moving' ? 'bg-blue-50 text-blue-600' : seg.status === 'Stopped' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                          {seg.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">{seg.time}</div>
                    </div>
                  </Popup>
                </Polyline>
              ))}
              {selectionPath.length > 1 && (
                <Polyline
                  positions={selectionPath as any}
                  pathOptions={{
                    color: "#10b981",
                    weight: 8,
                    lineJoin: "round",
                    opacity: 1,
                  }}
                />
              )}
              <Marker
                position={[
                  tripData[0].location.coordinates[1],
                  tripData[0].location.coordinates[0],
                ]}
              >
                <Popup>
                  <span className="font-black text-blue-600">START</span>
                </Popup>
              </Marker>
              <Marker
                position={[
                  tripData[tripData.length - 1].location.coordinates[1],
                  tripData[tripData.length - 1].location.coordinates[0],
                ]}
              >
                <Popup>
                  <span className="font-black text-red-600">END</span>
                </Popup>
              </Marker>
              {startIndex !== null && (
                <Marker
                  position={[
                    tripData[startIndex].location.coordinates[1],
                    tripData[startIndex].location.coordinates[0],
                  ]}
                >
                  <Popup>
                    <div className="p-1">
                        <div className="font-black text-blue-500 text-[10px] uppercase">Starting Point A</div>
                        <div className="text-sm font-bold">{new Date(tripData[startIndex].time).toLocaleTimeString()}</div>
                    </div>
                  </Popup>
                </Marker>
              )}
              {endIndex !== null && (
                <Marker
                  position={[
                    tripData[endIndex].location.coordinates[1],
                    tripData[endIndex].location.coordinates[0],
                  ]}
                >
                  <Popup>
                    <div className="p-1">
                        <div className="font-black text-emerald-500 text-[10px] uppercase">Ending Point B</div>
                        <div className="text-sm font-bold">{new Date(tripData[endIndex].time).toLocaleTimeString()}</div>
                        <div className="text-[9px] text-slate-400 mt-1 uppercase font-black">Dist from A: {selectionStats?.distance.toFixed(2)} KM</div>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 text-center">
          <StatCard
            icon={<DirectionsCarIcon className="text-blue-500" />}
            title="Total distance"
            value={`${overallStats.distance.toFixed(1)} KM`}
          />
          <StatCard
            icon={<AccessTimeIcon className="text-blue-400" />}
            title="Total duration"
            value={`${Math.floor(overallStats.duration / 60)}h ${Math.floor(overallStats.duration % 60)}m`}
          />
          <StatCard
            icon={<SpeedIcon className="text-teal-400" />}
            title="Avg Speed"
            value={`${overallStats.avgSpeed.toFixed(1)} km/h`}
          />
          <StatCard
            icon={<SpeedIcon className="text-purple-500" />}
            title="Max Speed"
            value={`${overallStats.maxSpeed.toFixed(1)} km/h`}
          />
          <StatCard
            icon={<AccessTimeIcon className="text-red-600" />}
            title="Total Stoppage"
            value={`${Math.floor(overallStats.stopTime)} Mins`}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 uppercase text-[10px] font-black text-slate-400">
                  <th className="p-4">Time Entry</th>
                  <th className="p-4">Gap Time</th>
                  <th className="p-4">Gap Dist</th>
                  <th className="p-4">Ignition</th>
                  <th className="p-4">Speed</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((p, i) => {
                  const gIdx = (currentPage - 1) * itemsPerPage + i;
                  const prevP = gIdx > 0 ? tripData[gIdx - 1] : null;

                  let gapSecs = 0;
                  let gapMeters = 0;

                  if (prevP) {
                    gapSecs = (new Date(p.time).getTime() - new Date(prevP.time).getTime()) / 1000;
                    gapMeters = getDistance(
                        { latitude: p.location.coordinates[1], longitude: p.location.coordinates[0] },
                        { latitude: prevP.location.coordinates[1], longitude: prevP.location.coordinates[0] }
                    );
                  }

                  return (
                    <tr
                      key={i}
                      className={`border-b border-slate-50 hover:bg-slate-50/80 transition-colors cursor-pointer ${startIndex === gIdx || endIndex === gIdx ? "bg-blue-50/60 shadow-inner" : ""}`}
                      onClick={() => handleMapPointSelect(gIdx)}
                    >
                      <td className="p-4 text-xs font-semibold text-slate-500">
                        {new Date(p.time).toLocaleTimeString()}
                      </td>
                      <td className="p-4 text-xs font-black text-slate-500">
                        {gapSecs > 0 ? `${gapSecs}s` : "--"}
                      </td>
                      <td className="p-4 text-xs font-black text-slate-500">
                        {gapMeters > 0 ? `${gapMeters.toFixed(1)}m` : "--"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${p.status === "Moving" ? "bg-blue-50 text-blue-600 border border-blue-100" : p.status === "Stopped" ? "bg-red-50 text-red-600 border border-red-100" : p.status === "Idle" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-purple-50 text-purple-600 border border-purple-100"}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-black text-slate-900">
                        {p.speed.toFixed(1)} KM/H
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Dynamic Pagination Engine */}
            <div className="flex items-center justify-center gap-1.5 mt-8 mb-4">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all"
              >
                &larr;
              </button>
              <div className="flex gap-1.5 mx-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pNum =
                    currentPage <= 3
                      ? i + 1
                      : currentPage >= totalPages - 2
                        ? totalPages - 4 + i
                        : currentPage - 2 + i;
                  if (pNum > totalPages || pNum <= 0) return null;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${currentPage === pNum ? "bg-blue-600 text-white shadow-xl scale-110" : "border border-slate-100 text-slate-400 hover:bg-slate-50"}`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all"
              >
                &rarr;
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all"
              >
                Last
              </button>
            </div>
          </div>

          <div className="w-full lg:w-[400px] bg-slate-50/50 border border-slate-100 rounded-3xl p-8 h-fit">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-8 border-b border-slate-200/60 pb-3">
              Segment Analysis (A &rarr; B)
            </h4>
            {selectionStats ? (
              <div className="space-y-6">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase">From Point A</div>
                        <div className="text-sm font-black text-slate-800">{new Date(tripData[startIndex!].time).toLocaleTimeString()}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-black text-slate-400 uppercase">To Point B</div>
                        <div className="text-sm font-black text-slate-800">{new Date(tripData[endIndex!].time).toLocaleTimeString()}</div>
                    </div>
                </div>

                <SummaryItem
                  label="Time Elapsed"
                  value={`${Math.floor(selectionStats.duration)} m ${Math.floor((selectionStats.duration % 1) * 60)} s`}
                />
                <SummaryItem
                  label="Distance Covered"
                  value={`${selectionStats.distance.toFixed(3)} KM`}
                />
                <SummaryItem
                  label="Average Speed"
                  value={`${selectionStats.avgSpeed.toFixed(1)} KM/H`}
                />
                 <SummaryItem
                  label="Max Speed Hit"
                  value={`${selectionStats.maxSpeed.toFixed(1)} KM/H`}
                />
                <div className="pt-4 border-t border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-3">Time Breakdown</div>
                    <div className="flex h-2 rounded-full overflow-hidden bg-slate-200">
                        <div style={{ width: `${(selectionStats.stopTime / selectionStats.duration) * 100}%` }} className="bg-red-500" title="Stopped"></div>
                        <div style={{ width: `${(selectionStats.idleTime / selectionStats.duration) * 100}%` }} className="bg-amber-500" title="Idle"></div>
                        <div style={{ width: `${((selectionStats.duration - selectionStats.stopTime - selectionStats.idleTime) / selectionStats.duration) * 100}%` }} className="bg-blue-500" title="Moving"></div>
                    </div>
                    <div className="flex justify-between mt-2 text-[9px] font-black uppercase text-slate-400">
                        <span>Stopped: {Math.floor(selectionStats.stopTime)}m</span>
                        <span>Idle: {Math.floor(selectionStats.idleTime)}m</span>
                        <span>Moving: {Math.floor(selectionStats.duration - selectionStats.stopTime - selectionStats.idleTime)}m</span>
                    </div>
                </div>

                <button
                  onClick={() => {
                    setStartIndex(null);
                    setEndIndex(null);
                  }}
                  className="w-full mt-6 py-4 bg-white border border-slate-200 text-slate-500 font-bold text-[10px] rounded-2xl hover:bg-slate-50 uppercase tracking-widest transition-all shadow-sm"
                >
                  Reset Selection
                </button>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-300">
                <DirectionsCarIcon className="opacity-20 mb-6 scale-150" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] px-8 leading-loose">
                  Select two points from the table below to analyze trip metrics in between
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({
  icon,
  title,
  value,
}: {
  icon: any;
  title: string;
  value: string;
}) => (
  <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2.5 transition-all group hover:border-blue-200">
    <div className="p-2.5 rounded-full bg-slate-50 group-hover:bg-blue-50 transition-colors">
      {icon}
    </div>
    <div className="text-[20px] md:text-[24px] font-black text-slate-900 group-hover:text-blue-600 transition-colors">
      {value}
    </div>
    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
      {title}
    </div>
  </div>
);

const SummaryItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center group/item border-b border-slate-100/60 pb-4 last:border-0 last:pb-0">
    <span className="text-[11px] font-black text-slate-400 uppercase tracking-tight group-hover/item:text-slate-500 transition-colors">
      {label}
    </span>
    <span className="text-xs font-black text-slate-800">{value}</span>
  </div>
);

export default TripDetails;
