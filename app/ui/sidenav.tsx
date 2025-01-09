// Purpose: Define the sidenav for the application.

// Imports
import { Route } from "@/app/constants/routes";
import Link from "next/link";

// Declaring the sidenav props
interface SidenavProps {
	routes: Route[];
}

export default function Sidenav({ routes }: SidenavProps) {
	return (
		<>
			<div className="bg-gray-900 w-1/5 h-screen">
				<div className="text-white text-3xl p-4 font-mono">Navigation</div>
				<div className="text-white text-lg p-4">
					<ul>
						{routes.map((route, index) => (
							<li key={index} className="p-2">
								<Link href={route.link} className="text-blue-500 text-xl hover:text-blue-300">
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
