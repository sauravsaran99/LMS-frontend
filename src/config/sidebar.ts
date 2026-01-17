export const sidebarItems = [
    {
        label: "Dashboard",
        path: "/",
        roles: ["SUPER_ADMIN", "BRANCH_ADMIN", "RECEPTIONIST"],
    },
    {
        label: "Bookings",
        path: "/bookings",
        roles: ["SUPER_ADMIN", "BRANCH_ADMIN", "RECEPTIONIST"],
    },
    {
        label: "Test Master",
        path: "/tests",
        roles: ["SUPER_ADMIN", "BRANCH_ADMIN"],
    },
    {
        label: "Doctor Master",
        path: "/doctors",
        roles: ["SUPER_ADMIN", "BRANCH_ADMIN"],
    },
    {
        label: "Customers",
        path: "/customers",
        roles: ["SUPER_ADMIN", "BRANCH_ADMIN", "RECEPTIONIST"],
    },
];
