import { Event } from "./event.dto";

export interface UserEventsResponse {
  success: boolean;
  message: string;
  data: {
    events: Event[];
  };
}

export interface UserEventUpdateRequest {
  eventName: string;
  eventCategory: string;
}

export interface SimpleResponse {
  success: boolean;
  message: string;
}

export interface AddQueryRequest {
  text: string;
}