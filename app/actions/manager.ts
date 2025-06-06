import axios from "axios";

// ALL REQUESTS TO BE MADE BY ROLE MANAGER

import { Event ,addEventResponse , UsersResponse} from "../dtos/event.dto";
import { addSponsordto ,SponsorsResponse } from "../dtos/sponsor.dto";
import { QueryResponse } from "../dtos/query.dto";
import { mailResponse } from "../dtos/mail.dto";

export async function addEvent(eventData: Event): Promise<addEventResponse> {
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

export async function addSponsor(sponsor: addSponsordto): Promise<SponsorsResponse> {
    try{
        const url= `${process.env.SERVER_URL}/sponsors`;
        const response=await axios.post(url, sponsor);
        return response.data;
    }
    catch (error: any) {
    console.error("Error adding sponsor:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to add sponsor");
    }
}

export async function getDataOfEvent(eventCategory:string , eventName:string): Promise<UsersResponse> {
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

export async function getQuery() : Promise<QueryResponse> {
    try {
        const url = `${process.env.SERVER_URL}/admin/query`;
        const response = await axios.get(url);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching queries:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed to fetch queries");
    }
}

export async function mailCategory(eventName:string , eventCategory:string,heading:string,buttontext:string,buttonlink:string,subject:string,thankyou:string,detail:string): Promise<mailResponse> {
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
