import { useEffect, useState } from "react";
import BaseTable from "../base_table";
import { deleteLecture, getAllLecture } from "@/app/actions/lecture";

// Define the GuestLecture type
interface GuestLecture {
    id: string;
    speakerName: string;
    topic: string;
    date: string;
    time: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    department: string;
    speakerImage?: string;
    venue: string;
    contactEmail: string;
}

// You'll need to implement these functions in your actions folder


export default function GuestLectureTable() {
    const [lectures, setLectures] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchLectures = async () => {
            try {
                const lecturesData = await getAllLecture();
                setLectures(lecturesData);

            } catch (err) {
                setError("Failed to load guest lectures");
                console.error("Error loading guest lectures:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLectures();
    }, []);

    const handleEdit = (id: string) => {
        console.log("Edit lecture:", id);
        // Implement your edit logic here
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteLecture(id);
            setLectures((prevLectures:any) => 
                prevLectures.filter((lecture:any) => lecture.id !== id)
            );
        } catch (err) {
            console.error("Error deleting lecture:", err);
            alert("Failed to delete guest lecture.");
        }
    };

    const columns = [
        { 
            key: "speakerImage", 
            header: "Speaker",
            type: "image" as const,
            imageConfig: {
                fallbackSrc: "/placeholder-speaker.png",
                width: "w-12",
                height: "h-12",
                rounded: true
            }
        },
        { key: "speakerName", header: "Speaker Name" },
        { key: "topic", header: "Topic" },
        { 
            key: "status",
            header: "Status",
            type: "badge" as const,
            badgeConfig: {
                colors: {
                    scheduled: "bg-blue-500",
                    completed: "bg-green-500",
                    cancelled: "bg-red-500"
                }
            }
        },
        { key: "date", header: "Date" },
        { key: "time", header: "Time" },
        { key: "venue", header: "Venue" },
        { key: "department", header: "Department" },
        { key: "contactEmail", header: "Contact" },
        {
            key: "actions",
            header: "Actions",
            type: "actions" as const
        }
    ];

    return (
        <BaseTable
            columns={columns}
            data={lectures}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
            identifierKey="id"
            title="Guest Lectures"
        />
    );
}