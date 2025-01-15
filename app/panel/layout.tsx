// Purpose: Give a layout for the panels. Have 2 Navs { View, Add }
import { PanelNav } from "../constants/panel_nav";
import PanelNavBar from "../ui/panel_nav";

export default function PanelLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
    return (
        <>
            <PanelNavBar navItems={PanelNav} />
            {children}
        </>
    );
}
