import axios from "axios";

import { UserAuthResponse, IdToken,UserProfileUpdateSchema } from "../dtos/authentication.dto";

export async function loginUsingOAuth(idToken:IdToken): Promise<UserAuthResponse> {
    if(!idToken) throw new Error("Id Token required");
    try {
        const url=`${process.env.SERVER_URL}/loginApp`;
        const response = await axios.put(url,idToken);
        return response.data;
    } catch (error:any) {
        console.error("Error in login:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed to login");
    }
}

export async function updateUserProfile(updateSchema:UserProfileUpdateSchema) : Promise<UserAuthResponse> {
    try {
        const url=`${process.env.SERVER_URL}/signUpApp`;
        const response = await axios.put(url,updateSchema);
        return response.data;
    } catch (error:any) {
        console.error("Error updating user profile:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed to update user profile");
    }
}