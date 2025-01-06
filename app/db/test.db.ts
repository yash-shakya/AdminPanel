// THIS IS A TESTING FILE TO ENSURE THAT THE DATABASE CONNECTION IS WORKING

import {
	createUser,
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
} from "@/app/actions/user";

async function exampleUsage() {
	// Create a user
	const userId = await createUser({
		name: "Alice",
		photo: "bluffimage.jpg",
		bio: "Frontend Developer",
	});

	// Get all users
	const users = await getAllUsers();
	console.log(users);

	// Get a specific user by ID
	const user = await getUserById(userId);
	console.log(user);

	// Update a user
	await updateUser(userId, { bio: "Updated bio" });

	// Delete a user
	await deleteUser(userId);
}

exampleUsage()
	.then(() => {
		console.log("Done!");
	})
	.catch((error) => {
		console.error("Error:", error);
	});
