"use client";
// Purpose: This will create a simple nav bar for the panel. (View, Add, Update come from props)
import { usePathname } from "next/navigation";
import Link from "next/link";

interface PanelNavBarProps {
	navItems: {
		name: string;
		href: string;
	}[];
}

export default function PanelNavBar({ navItems }: PanelNavBarProps) {
	const pathname = usePathname();
	// Break the pathname and get the last part of the path
	const currentNav = pathname.split("/").pop();

	return (
		<>
			<nav className="bg-gray-800 text-white px-4 py-1 rounded-lg">
				<ul className="flex items-center gap-5">
					{navItems.map((item, index) => (
						<li 
							key={index} 
							className={`mr-4 ${pathname.includes(item.href) ? "text-blue-200 bg-blue-800" : ""}  px-3 py-1 rounded-lg w-[80px] text-center transition-all`}
						>
							<Link href={`${item.href}/${currentNav}`}>{item.name}</Link>
						</li>
					))}
				</ul>
			</nav>
		</>
	);
}
