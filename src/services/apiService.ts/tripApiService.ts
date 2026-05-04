import { tripAPI } from "../../config/axiosConfig";


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
