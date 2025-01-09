import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import NavRoutes from "@/app/constants/routes";
import Sidenav from "@/app/ui/sidenav";

const poppins = Poppins({
	weight: ["400", "700", "800"],
	variable: "--font-poppins",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Techspardha | Admin Panel",
	description: "Admin Panel for Techspardha | Managed by Technobyte | NITKKR",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${poppins.variable} antialiased`}>
				<div className="flex min-h-screen w-screen">
					<Sidenav routes={NavRoutes} />
					<div className="w-full flex flex-col">
						<h1 className="text-3xl py-2 align-middle text-center border-b border-blue-700 relative">
							Techspardha | Admin Panel
							<span className="text-sm text-gray-500 absolute bottom-1 right-4">
								(Managed by Technobyte | NITKKR)
							</span>
						</h1>
						<div className="flex-grow p-4">{children}</div>
					</div>
				</div>
			</body>
		</html>
	);
}
