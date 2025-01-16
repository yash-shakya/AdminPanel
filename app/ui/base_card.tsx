"use client";
// Purpose: This file will be used as a base file for all the cards.
// It will have a common structure for all the cards.
// It will have a card image, card title, then rest is whatever key-value pairs it will get as props.
// For lengthy values, it will have ellipsis (...) at the end.
// At the bottom, it will have edit and delete buttons with a confirmation modal for delete.

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const handleDeleteConfirm = () => {
		onDelete();
		setIsDeleteModalOpen(false);
	};

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
					<h1 className="border-b pb-2 text-3xl font-black font-mono border-blue-200 ml-3">
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
						onClick={() => setIsDeleteModalOpen(true)}
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

			{isDeleteModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
						<h3 className="text-lg font-semibold text-white mb-4">
							Confirm Delete
						</h3>
						<p className="text-gray-300 mb-6">
							Are you sure you want to delete this item? This action cannot be
							undone.
						</p>
						<div className="flex justify-end space-x-3">
							<button
								onClick={() => setIsDeleteModalOpen(false)}
								className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handleDeleteConfirm}
								className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
