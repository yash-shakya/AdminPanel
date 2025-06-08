import axios from "axios";
import { LoginRequest, LoginUserResponse, updateUserRequest } from "../dtos/user.dto";

export async function loginWebUsingGoogleAPP(Token:LoginRequest): Promise<LoginUserResponse> {    
    if(!Token || Token.idToken.length==0) throw new Error("Invalid token: Token is missing or empty")
    try {
        const url=`${process.env.SERVER_URL}/loginApp`;

    
        const response= await axios.post<LoginUserResponse>(url,Token);

        return response.data;

        

    } catch (error:any) {
        console.error("Login(APP) failed:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Login request failed");
    }
}

export async function UpdateUserProfileForAndroid(payload:updateUserRequest): Promise<LoginUserResponse> {
    if(!payload) throw new Error("Empty fields! fill fields to update the user")
    try {
        
        const url=`${process.env.SERVER_URL}/signUpApp`

        const response=await axios.put<LoginUserResponse>(url,payload)

        return response.data

    } catch (error:any) {
        console.error("Failed to update user profile(APP):", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Profile update failed");
    }

}