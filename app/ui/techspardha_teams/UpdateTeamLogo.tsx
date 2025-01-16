"use client";
import { useState } from "react";
import Image from "next/image";

interface UpdateTeamLogoProps {
	initialLogo: string;
	onLogoUpdate: (newLogo: string) => void;
}

export default function UpdateTeamLogo({ initialLogo, onLogoUpdate }: UpdateTeamLogoProps) {
	const [logo, setLogo] = useState(initialLogo);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				if (reader.result) {
					const newLogo = reader.result.toString();
					setLogo(newLogo);
					onLogoUpdate(newLogo); // Callback to update parent state
				}
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<label className="flex flex-col items-center gap-5" htmlFor="logo">
			<Image
				src={logo}
				alt="Team Logo"
				width={200}
				height={200}
				className="rounded-full"
			/>
			<input type="file" id="logo" hidden onChange={handleFileChange} />
		</label>
	);
}
