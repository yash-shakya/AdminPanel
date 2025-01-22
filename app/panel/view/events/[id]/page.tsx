"use client";

import UpdateEventForm from "@/app/ui/events/UpdateEventForm";


export default function Home({ params }: { params: { id: string[] } }) {

    const a = "Informals", b="Excalibur";
    const [eventCategory, eventName] = params.id; // Destructure to get category and event name
    return (
        <>
            <UpdateEventForm eventCategory={a} eventName={b} />
        </>
    );
}
