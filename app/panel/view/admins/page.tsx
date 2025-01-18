"use client";

import UserTable from "@/app/ui/admin_users/UserTable"

export default function Home() {
    return (
        <div className="container mx-auto px-4 py-3">
            <div className="text-4xl w-full flex justify-center items-center mb-4">
                Hi! <span className="text-blue-500 font-mono font-black m-3">ADMINS</span>
            </div>
            <UserTable />
        </div>
    );
}