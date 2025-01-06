// IT IS A SAMPLE FILE, JUST TO SHOW AN EXAMPLE

import {
	collection,
	addDoc,
	getDocs,
	getDoc,
	doc,
	updateDoc,
	deleteDoc,
} from "firebase/firestore";
import { db } from "@/app/db";

interface User {
	name: string;
	photo: string;
	bio: string;
}

// User CRUD operations

// CREATE: Add a new user
export async function createUser(user: User): Promise<string> {
	try {
		const usersCollection = collection(db, "users");
		const docRef = await addDoc(usersCollection, {
			...user,
			createdAt: Date.now(),
		});
		console.log("User created with ID:", docRef.id);
		return docRef.id;
	} catch (error) {
		console.error("Error creating user:", error);
		throw error;
	}
}

// READ: Get all users
export async function getAllUsers() {
	try {
		const usersCollection = collection(db, "users");
		const snapshot = await getDocs(usersCollection);
		const users = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		return users;
	} catch (error) {
		console.error("Error fetching users:", error);
		throw error;
	}
}

// READ: Get a user by ID
export async function getUserById(userId: string) {
	try {
		const userDocRef = doc(db, "users", userId);
		const userDocSnap = await getDoc(userDocRef);
		if (userDocSnap.exists()) {
			return { id: userDocSnap.id, ...userDocSnap.data() };
		} else {
			console.log("No such user!");
			return null;
		}
	} catch (error) {
		console.error("Error fetching user by ID:", error);
		throw error;
	}
}

// UPDATE: Update an existing user
export async function updateUser(userId: string, updatedData: Partial<User>) {
	try {
		const userDocRef = doc(db, "users", userId);
		await updateDoc(userDocRef, {
			...updatedData,
			updatedAt: Date.now(),
		});
		console.log("User updated successfully!");
	} catch (error) {
		console.error("Error updating user:", error);
		throw error;
	}
}

// DELETE: Remove a user
export async function deleteUser(userId: string) {
	try {
		const userDocRef = doc(db, "users", userId);
		await deleteDoc(userDocRef);
		console.log("User deleted successfully!");
	} catch (error) {
		console.error("Error deleting user:", error);
		throw error;
	}
}
