import axios from "axios";

import { UserAuthResponse, UserProfileUpdateSchema } from "../dtos/authentication.dto";

export async function loginUsingOAuth(idToken:string): Promise<UserAuthResponse> {
    if(!idToken) throw new Error("Id Token required");
    try {
        const url=`${process.env.SERVER_URL}/loginApp`;
        const response = await axios.post(url,idToken);
        return response.data;
    } catch (error:any) {
        console.error("Error in login:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed to login");
    }
}

export async function updateUserProfile(updateSchema:UserProfileUpdateSchema) : Promise<UserAuthResponse> {
    if(!updateSchema || !updateSchema.year || !updateSchema.college) {
        throw new Error("Year and college are required for profile update");
    }
    try {
        const url=`${process.env.SERVER_URL}/signUpApp`;
        const response = await axios.put(url,updateSchema);
        return response.data;
    } catch (error:any) {
        console.error("Error updating user profile:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed to update user profile");
    }
}