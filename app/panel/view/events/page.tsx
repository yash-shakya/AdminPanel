"use client"

import ViewEvents from "@/app/ui/events/ViewEvents";
export default function Home() {
	
	return (
			<>
				<div className="bg-gray-900 p-4 shadow-md rounded-md overflow-clip">
					<h1 className="border-b pb-2 text-3xl font-black font-mono border-blue-200">
						Events
					</h1>
					
					<ViewEvents />
				</div>
			</>
		);
	}