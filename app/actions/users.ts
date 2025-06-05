import axios from "axios";
import { UserEventsResponse,SimpleResponse, UserEventUpdateRequest,AddQueryRequest  } from "../dtos/user.dto";
import { Event } from "../dtos/event.dto";

export async function getUserEvents(): Promise<Event[]> {
  try {
    const url = `${process.env.SERVER_URL}/user/event`;

    const response = await axios.get<UserEventsResponse>(url, {
      withCredentials: true, // ensure session/cookie is sent
    });

    return response.data.data.events;
  } catch (error: any) {
    console.error("Error fetching user events:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to fetch user events");
  }
}


export async function updateUserEvent(data: UserEventUpdateRequest): Promise<SimpleResponse> {
  try {
    const url = `${process.env.SERVER_URL}/user/event`;

    // Create URLSearchParams and append form fields clearly
    const formData = new URLSearchParams();
    formData.append("eventName", data.eventName);
    formData.append("eventCategory", data.eventCategory);

    const response = await axios.put<SimpleResponse>(url, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error updating user event:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to update user event");
  }
}


export async function unregisterUserEvent(data: UserEventUpdateRequest): Promise<SimpleResponse> {
  try {
    const url = `${process.env.SERVER_URL}/user/event/unregister`;

    const formData = new URLSearchParams();
    formData.append("eventName", data.eventName);
    formData.append("eventCategory", data.eventCategory);

    const response = await axios.put<SimpleResponse>(url, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error unregistering user event:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to unregister user event");
  }
}


export async function addQuery(data: AddQueryRequest): Promise<SimpleResponse> {
  try {
    const url = `${process.env.SERVER_URL}/query`;

    const formData = new URLSearchParams();
    formData.append("text", data.text);

    const response = await axios.post<SimpleResponse>(url, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error adding query:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to add query");
  }
}