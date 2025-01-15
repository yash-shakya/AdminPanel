// Purpose: This will create a simple nav bar for the panel. (View, Add, Update come from props)

interface PanelNavBarProps {
	navItems: {
		name: string;
		href: string;
	}[];
}

export default function PanelNavBar({ navItems }: PanelNavBarProps) {
	return (
		<>
			<nav className="bg-gray-800 text-white p-4">
				<ul className="flex">
					{navItems.map((item, index) => (
						<li key={index} className="mr-4">
							<a href={item.href}>{item.name}</a>
						</li>
					))}
				</ul>
			</nav>
		</>
	);
}
