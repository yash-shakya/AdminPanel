"use client";
import ViewEvents from "@/app/ui/events/ViewEvents";


export default function Home({ params }: { params: { id: string[] } }) {

    return (
        <>
            <ViewEvents />
        </>
    );
}
