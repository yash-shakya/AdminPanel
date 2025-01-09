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
        link: "/panel/admins",
    },
    {
        name: "Notification",
        link: "/panel/notification",
    },
    {
        name: 'Guest Lectures',
        link: '/panel/guest-lectures',
    },
    {
        name: 'Sponsors',
        link: '/panel/sponsors',
    },
    {
        name: 'Techspardha Teams',
        link: '/panel/techspardha-teams',
    },
    {
        name: 'Dev Team',
        link: '/panel/dev-team',
    },
    {
        name: 'App Dev Team',
        link: '/panel/app-dev-team',
    },
    {
        name: 'Events',
        link: '/panel/events',
    }
];

// Export the routes.
export default ROUTES;