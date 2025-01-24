// Purpose: Define the routes for the application.
// Use as Navigation Links in the app.

// Declare type for the routes.
export type Route = {
  name: string;
  link: string;
};

// Define the routes for the application.
const ROUTES: Route[] = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Admins",
    link: "/panel/view/admins",
  },
  {
    name: "Notification",
    link: "/panel/view/notification",
  },
  {
    name: "Guest Lectures",
    link: "/panel/view/guest-lectures",
  },
  {
    name: "Sponsors",
    link: "/panel/view/sponsors",
  },
  {
    name: "Techspardha Teams",
    link: "/panel/view/techspardha-teams",
  },
  {
    name: "Dev Team",
    link: "/panel/view/dev-team",
  },
  {
    name: "App Dev Team",
    link: "/panel/view/app-dev-team",
  },
  {
    name: "Event Categories",
    link: "/panel/view/eventCategory",
  },
  {
    name: "Events",
    link: "/panel/view/events",
  },
];

export const TabNames = [
  "admins",
  "notification",
  "guest-lectures",
  "sponsors",
  "techspardha-teams",
  "dev-team",
  "app-dev-team",
  "eventCategory",
  "events",
];

// Export the routes.
export default ROUTES;
