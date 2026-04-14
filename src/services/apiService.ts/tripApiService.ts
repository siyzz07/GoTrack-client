import { tripAPI } from "../../config/axiosConfig";

// // Mock data with persistence in localStorage for demo purposes
// const getMockTrips = () => {
//   const data = localStorage.getItem("vtd_trips");
//   if (!data) {
//     const initial = [
//       {
//         id: "1",
//         origin: "Kakkanad, Kochi",
//         destination: "Aluva, Kochi",
//         distance: "15.4 km",
//         duration: "35 mins",
//         date: "2026-03-31",
//         status: "Completed",
//         speed: "42 km/h",
//         avgSpeed: "38.5 km/h",
//         fuelConsumed: "1.2 L",
//       },
//       {
//         id: "2",
//         origin: "Palarivattom, Kochi",
//         destination: "Edapally, Kochi",
//         distance: "4.2 km",
//         duration: "12 mins",
//         date: "2026-03-31",
//         status: "Ongoing",
//         speed: "30 km/h",
//         avgSpeed: "28.5 km/h",
//         fuelConsumed: "0.4 L",
//       },
//     ];
//     localStorage.setItem("vtd_trips", JSON.stringify(initial));
//     return initial;
//   }
//   return JSON.parse(data);
// };

// export const fetchTrips = async () => {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 500));
//   return getMockTrips();
// };

// export const fetchTripById = async (id: string) => {
//   await new Promise((resolve) => setTimeout(resolve, 500));
//   const trips = getMockTrips();
//   return trips.find((t: any) => t.id === id);
// };

// export const addTrip = async (tripData: any) => {
//     await new Promise(resolve => setTimeout(resolve, 500));
//     const trips = getMockTrips();
//     const newTrip = {
//         ...tripData,
//         id: Math.random().toString(36).substr(2, 9),
//         date: new Date().toISOString().split('T')[0],
//         status: 'Completed' // or whatever default
//     };
//     const updated = [newTrip, ...trips];
//     localStorage.setItem('vtd_trips', JSON.stringify(updated));
//     return newTrip;
// };

//--------------------------------------

export const addTrip = async (tripData: any) => {
    console.log('data',tripData);
    
  const response = await tripAPI.post("/trip", tripData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


export const userTripPlans = async (
  search: string = "",
  page: number = 1,
  limit: number = 5
) => {
  const response = await tripAPI.get("/trip", {
    params: { search, page, limit },
  });
  return response;
};


export const tripDetails =  async(id:string) =>{
  const response = await tripAPI.get(`/trip/${id}`)
  return response
}
