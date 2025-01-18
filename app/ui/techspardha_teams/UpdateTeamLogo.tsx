"use client";
import { useState } from "react";
import Image from "next/image";
import { getImgbbUrl } from "@/app/helpers/imgbb";

interface UpdateTeamLogoProps {
	initialLogo: string;
	onLogoUpdate: (newLogo: string) => void;
}

export default function UpdateTeamLogo({
	initialLogo,
	onLogoUpdate,
}: UpdateTeamLogoProps) {
	const [logo, setLogo] = useState(initialLogo);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		console.log("File changed");

		const file = event.target.files?.[0];
		if (file) {
			// Pass this file (binary) to the imgbb API
			getImgbbUrl(file).then((url) => {
				if (url) {
					onLogoUpdate(url.imageURL?.url || "");
				}
			});

			const reader = new FileReader();
			reader.onload = async () => {
				if (reader.result) {
					const Logo64 = reader.result.toString(); //this is base64

						if (Logo64) {
							setLogo(Logo64);
						}
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
