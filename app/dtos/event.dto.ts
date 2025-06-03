export interface Coordinator {
    coordinator_name: string;
    coordinator_number: string;
};


export interface Event {
  eventName: string,
  eventCategory: string,
  venue: string,
  description: string,
  endTime: 0,
  startTime: 0,
  document: string,
  poster: string,
  cordinators: Coordinator[],
  rules: [
    string
  ]
}

export interface EventsResponse {
  success: boolean;
  message: string;
  data: {
    events: Event[];
  };
}


export interface TimelineEvent {
  eventName: string;
  eventCategory: string;
  startTime: number;
  endTime: number;
}

export interface TimelineResponse {
  success: boolean;
  message: string;
  data: {
    events: TimelineEvent[];
  };
}

