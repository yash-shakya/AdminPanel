import axios from "axios";

import { Category,SimpleCategoriesResponse } from "../dtos/category.dto";
import { QueryBody } from "../dtos/query.dto";
import { SimpleResponse, UserUpdateBody } from "../dtos/user.dto";
import { MailBody } from "../dtos/mail.dto"; 
import { NotificationBody } from "../dtos/notification.dto";

export async function addCategory(category:Category): Promise<SimpleCategoriesResponse>{
    if(!category) throw new Error("Category is required");
    try {
        const url=`${process.env.SERVER_URL}/events/categories`;
        const response = await axios.post(url,category)
        return response.data;
    } catch (error:any) {
        console.error("Error adding category:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed to add category");
    }
}

export async function deleteQuery(query: QueryBody): Promise<SimpleResponse>{
    if(!query) throw new Error("Query required");
    try {
        const url=`${process.env.SERVER_URL}/admin/query`;
        const response = await axios.put(url,query);
        return response.data;
    } catch (error:any) {
        console.error("Error deleting query:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed delete query");
    }
}

export async function sendMailToMultipleUsers(mail:MailBody): Promise<SimpleResponse>{

    try {
        const url = `${process.env.SERVER_URL}/admin/mail/list`;
        const response=await axios.post(url,mail);
        return response.data;
    } catch (error:any) {
        console.error("Error sending mail:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed sending mail");
    }
}

export async function sendNotification(notification:NotificationBody): Promise<SimpleResponse>{
    try{
        const url=`${process.env.SERVER_URL}/admin/mobilenoti`;
        const response = await axios.post(url,notification);
        return response.data;
    }catch(error:any){
        console.error("Error sending notification:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed sending notification");
    }
}

export async function updateUser(): Promise<SimpleResponse> {
    try {
        const url=`${process.env.SERVER_URL}/updateUsers`;
        const response = await axios.post(url);
        return response.data;
    } catch (error:any) {
        console.error("Error updating:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed updating");
    }
}

export async function updateUserByAdmin(user:UserUpdateBody): Promise<SimpleResponse> {
    try {
        const url=`${process.env.SERVER_URL}/admin/user`;
        const response = await axios.post(url,user);
        return response.data;
    } catch (error:any) {
        console.error("Error updating user:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed updating user");
    }
}

