"use client";
// Purpose: Define the sidenav for the application.

// Imports
import { Route } from "@/app/constants/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Declaring the sidenav props
interface SidenavProps {
	routes: Route[];
}

export default function Sidenav({ routes }: SidenavProps) {
	// Get the current pathname to highlight the active route
	const pathname = usePathname();

	return (
		<>
			<div className="bg-gray-900 w-1/5 min-h-screen fixed z-0 left-0 top-0">
				<div className="text-white text-3xl p-4 font-mono">Navigation</div>
				<div className="text-white text-lg">
					<ul>
						{routes.map((route, index) => (
							<li
								key={index}
								className={`p-4 ${
									pathname === route.link ? "bg-blue-800 text-white" : ""
								} hover:bg-blue-700`}
							>
								<Link
									href={route.link}
									className={`block ${
										pathname === route.link ? "text-white" : "text-blue-400"
									} text-xl`}
								>
									{route.name}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</>
	);
}
