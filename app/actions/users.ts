import {
    collection,
    setDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";
import { db } from "@/app/db";


export type RegisteredEvents = {
    [category: string]: string[]; 
};

export type User = {
    admin: boolean;
    email: string;
    name: string;
    onBoard: boolean;
    picture: string;
    role: "user" | "admin" | "manager";
    college?: string;
    phone?: string;
    year?: string;
    registeredEvents?: RegisteredEvents;
};

export type UsersDTO = {
    [email: string]: User;
};

// Get all users
/**
 * Fetches all users from the Firestore database.
 * 
 * @returns {Promise<UsersDTO>} A promise that resolves to an object containing all users,
 * where each key is the user's email and the value is the user data.
 * 
 * @throws {Error} Throws an error if there is an issue fetching users from the database.
 * 
 * @example
 * ```typescript
 * getAllUsers()
 *   .then((users) => {
 *     console.log(users);
 *   })
 *   .catch((error) => {
 *     console.error("Error fetching users:", error);
 *   });
 * ```
 */
export async function getAllUsers(): Promise<UsersDTO> {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const data: UsersDTO = {};
        
        querySnapshot.forEach((doc) => {
            data[doc.id] = doc.data() as User;
        });
        
        return data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
    }
}

// Get user by email
/**
 * Fetches a user by their email from the Firestore database.
 * 
 * @param {string} email - The email of the user to fetch.
 * @returns {Promise<User>} A promise that resolves to a User object containing the user's data.
 * 
 * @throws {Error} Throws an error if the user is not found or if there is an issue fetching the user.
 * 
 * @example
 * ```typescript
 * getUserByEmail("user@example.com")
 *   .then((user) => {
 *     console.log(user);
 *   })
 *   .catch((error) => {
 *     console.error("Error fetching user:", error);
 *   });
 * ```
 */
export async function getUserByEmail(email: string): Promise<User> {
    try {
        const docRef = doc(db, "users", email);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data() as User;
        } else {
            throw new Error("User not found");
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user");
    }
}

// Create user
/**
 * Creates a new user in the Firestore database.
 * 
 * @param {string} email - The email of the user to create.
 * @param {User} data - The data of the user to create.
 * @returns {Promise<void>} A promise that resolves when the user is successfully created.
 * 
 * @throws {Error} Throws an error if there is an issue creating the user.
 * 
 * @example
 * ```typescript
 * const userData: User = {
 *   email: "user@example.com",
 *   name: "John Doe",
 *   admin: false,
 *   onBoard: true,
 *   picture: "https://example.com/picture.jpg",
 *   role: "user"
 * };
 * 
 * createUser("user@example.com", userData)
 *   .then(() => {
 *     console.log("User created successfully");
 *   })
 *   .catch((error) => {
 *     console.error("Error creating user:", error);
 *   });
 * ```
 */
export async function createUser(email: string, data: User): Promise<void> {
    try {
        const collectionRef = collection(db, "users");
        const docRef = doc(collectionRef, email);
        
        await setDoc(docRef, data);
        console.log("User created:", email);
    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
    }
}

// Update user
/**
 * Updates an existing user in the Firestore database.
 * 
 * @param {string} email - The email of the user to update.
 * @param {Partial<User>} data - The updated data for the user.
 * @returns {Promise<void>} A promise that resolves when the user is successfully updated.
 * 
 * @throws {Error} Throws an error if the user is not found or if there is an issue updating the user.
 * 
 * @example
 * ```typescript
 * const updatedData: Partial<User> = {
 *   name: "Jane Doe",
 *   phone: "1234567890"
 * };
 * 
 * updateUser("user@example.com", updatedData)
 *   .then(() => {
 *     console.log("User updated successfully");
 *   })
 *   .catch((error) => {
 *     console.error("Error updating user:", error);
 *   });
 * ```
 */
export async function updateUser(email: string, data: Partial<User>): Promise<void> {
    try {
        const docRef = doc(db, "users", email);
        
        await updateDoc(docRef, data);
        console.log("User updated:", email);
    } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user");
    }
}

// Delete user
/**
 * Deletes an existing user from the Firestore database.
 * 
 * @param {string} email - The email of the user to delete.
 * @returns {Promise<void>} A promise that resolves when the user is successfully deleted.
 * 
 * @throws {Error} Throws an error if the user is not found or if there is an issue deleting the user.
 * 
 * @example
 * ```typescript
 * deleteUser("user@example.com")
 *   .then(() => {
 *     console.log("User deleted successfully");
 *   })
 *   .catch((error) => {
 *     console.error("Error deleting user:", error);
 *   });
 * ```
 */
export async function deleteUser(email: string): Promise<void> {
    try {
        const docRef = doc(db, "users", email);
        
        await deleteDoc(docRef);
        console.log("User deleted:", email);
    } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user");
    }
}