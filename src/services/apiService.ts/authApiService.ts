import { authAPI } from "../../config/axiosConfig"



export const signupApi = async(data:{name:string,email:string,password:string}) =>{

     const respons = await authAPI.post('/signup',data)
     return respons

}



export const login = async (data:{email:string , password:string}) => {
        
    const response = await authAPI.post('/login',data)
    return response
}