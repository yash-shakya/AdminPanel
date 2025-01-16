"use client";
// Purpose: This file will be used as a base file for all the cards.
// It will have a common structure for all the cards.
// It will have a card image, card title, then rest is what ever key-value pairs it will get as props.
// For lengthy values it will have ellipsis (...) at the end.
// At bottom it will have a edit and delete button.

import Image from "next/image";
import Link from "next/link";

// Declaring interfaces for the props
interface BaseCardProps {
	image: string | null;
	title: string;
	data: {
		label: string;
		value: string;
		isURL?: boolean; // If there is a URL we will use <Link> tag by next/link
	}[];
	toEdit: string;
	onDelete: () => void;
}

// BaseCard component
export default function BaseCard({
	image,
	title,
	data,
	toEdit,
	onDelete,
}: BaseCardProps) {
	return (
		<div className="bg-gray-900 p-4 shadow-md rounded-md overflow-clip">
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<div className="w-12 h-12">
						<Image
							src={image || "https://placehold.co/600x400"}
							alt={title}
							layout="responsive"
							width={48}
							height={48}
						/>
					</div>
					<h1 className="border-b pb-2 text-3xl font-black font-mono border-blue-200">
						{title}
					</h1>
				</div>
				<div className="flex space-x-2">
					<Link
                        href={toEdit}
						className="bg-blue-500 text-white px-4 py-1 rounded-md"
					>
						Edit
					</Link>
					<button
						onClick={onDelete}
						className="bg-red-500 text-white px-4 py-1 rounded-md"
					>
						Delete
					</button>
				</div>
			</div>
			<div className="py-2">
				{data.map((item, index) => (
					<div key={index} className="flex items-center justify-between py-1">
						<span className="text-xl font-bold font-mono">{item.label}</span>
						<span className="text-lg font-mono">
							{item.isURL ? (
								<Link
									href={item.value}
									className="text-blue-500 hover:underline"
								>
									{item.value}
								</Link>
							) : (
								item.value
							)}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
