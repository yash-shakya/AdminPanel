import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// ALL REQUESTS TO BE MADE BY ROLE MANAGER

type Coordinator = {
    coordinator_name: string;
    coordinator_number: string;
};

type EventData = {
    eventName: string;
    category: string;
    venue: string;
    description: string;
    endTime: number;
    startTime: number;
    document: string;
    poster: string;
    cordinators: Coordinator[];
    rules: string[];
};

type Sponsor ={
    name: string;
    imageUrl: string;
    targetUrl: string;
    SponserSection: string;
}

export type {EventData, Coordinator , Sponsor};

export async function addEvent(eventData: EventData): Promise<any> {
    try{
        const url= `${process.env.SERVER_URL}/events`;
        const response=await axios.post(url, eventData);
        return response.data;
    }
    catch (error: any) {
    console.error("Error adding event:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to add event");
    }
}

export async function addSponsor(sponsorData: Sponsor): Promise<any> {
    try{
        const url= `${process.env.SERVER_URL}/sponsors`;
        const response=await axios.post(url, sponsorData);
        return response.data;
    }
    catch (error: any) {
    console.error("Error adding sponsor:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to add sponsor");
    }
}

export async function getDataOfEvent(eventCategory:string , eventName:string): Promise<any> {
    if (!eventCategory || !eventName) {
        throw new Error("Event category and name are required");
    }
    try {
        const url = `${process.env.SERVER_URL}/admin/event/${eventCategory}/${eventName}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching event data:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed to fetch event data");
    }
}

export async function getQuery() : Promise<any> {
    try {
        const url = `${process.env.SERVER_URL}/admin/query`;
        const response = await axios.get(url);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching queries:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed to fetch queries");
    }
}

export async function mailCategory(eventName:string , eventCategory:string,heading:string,buttontext:string,buttonlink:string,subject:string,thankyou:string,detail:string): Promise<any> {
    if (!eventCategory || !eventName) {
        throw new Error("Event category and name are required");
    }
    try {
        const url = `${process.env.SERVER_URL}/admin/mail/category`;
        const data = {
            eventName,
            eventCategory,
            heading,
            buttontext,
            buttonlink,
            subject,
            thankyou,
            detail
        };
        const response = await axios.post(url, data);
        return response.data;
    } catch (error: any) {
        console.error("Error sending mail:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed to send mail");
    }
}
