import {
	collection,
	addDoc,
	setDoc,
	getDocs,
	getDoc,
	doc,
	updateDoc,
	deleteDoc,
} from "firebase/firestore";
import { db } from "../db";
import createImgbbUrl, { IMGBB } from "../helpers/imgbb";

export type DevTeamMember = {
	name: string;
	imageUrl?: string | null;
	year: YEAR;
	linkedin?: string;
	github?: string;
	instagram?: string;
	image?: File | null;
};

type YEAR =
	| "Freshman"
	| "Sophomore"
	| "Pre-Final Year"
	| "Final Year"
	| "Super Senior";

// TODO: change the below fxns except creation fxn as devs -> aboutDevs -> arrayof members

/**
 * Adds a new member to the development team.
 *
 * @param {DevTeamMember} member - The development team member to add.
 * @returns {Promise<string | { err_desc: string }>} The ID of the added team member or an error description.
 *
 * @throws Will throw an error if adding the team member fails.
 */
export async function addDevTeamMember(
	member: DevTeamMember
  ): Promise<string | { err_desc: string }> {
	try {
	  if (!member.imageUrl) {
		return { err_desc: "No image given" };
	  }
  
	  const devDocRef = doc(db, "devs", "aboutDevs");
  
	  // Fetch the existing document
	  const devDoc = await getDoc(devDocRef);
	  let members: DevTeamMember[] = [];
  
	  if (devDoc.exists()) {
		const data = devDoc.data();
		if (data?.members && Array.isArray(data.members)) {
		  members = data.members; // Use the existing array if valid
		} else {
		  console.warn("Document data does not contain a valid members array.");
		}
	  }
	  
	  // Add the new member to the array
	  members.push(member);
	  // Update the document with the wrapped array
	  await setDoc(devDocRef, { members });
  
	  console.log("Dev team member added successfully");
	  return "Member added successfully";
	} catch (error) {
	  console.error("Error adding dev team member:", error);
	  return { err_desc: "Unable to add dev team member" };
	}
  }
  

/**
 * Fetches the list of development team members from the "devTeam" collection in the database.
 *
 * @returns {Promise<Array<{ id: string, [key: string]: any }> | { err_desc: string }>}
 * A promise that resolves to an array of objects representing the dev team members,
 * each containing an `id` and other data fields, or an error description object if the fetch fails.
 *
 * @throws Will log an error message to the console if there is an issue fetching the dev team members.
 */
export async function getDevTeamMembers(): Promise<
	Array<{ id: string; [key: string]: any }> | { err_desc: string }
> {
	try {
		const devTeamRef = collection(db, "devs");
		const snapshot = await getDocs(devTeamRef);
		return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
	} catch (error) {
		console.error("Error getting dev team members:", error);
		return {
			err_desc: "Unable to fetch dev team members",
		};
	}
}

/**
 * Retrieves a development team member's data by their ID.
 *
 * @param {string} id - The ID of the development team member.
 * @returns {Promise<{ id: string, [key: string]: any } | { err_desc: string }>}
 * A promise that resolves to an object containing the team member's data, or an error description if the retrieval fails.
 * @throws Will log an error message to the console if the retrieval fails.
 */
export async function getDevTeamMemberById(
	id: string
): Promise<{ id: string; [key: string]: any } | { err_desc: string }> {
	try {
		const devTeamRef = doc(db, "devs", id);
		const snapshot = await getDoc(devTeamRef);
		return { id: snapshot.id, ...snapshot.data() };
	} catch (error) {
		console.error("Error getting dev team member by ID:", error);
		return {
			err_desc: "Unable to get dev team member",
		};
	}
}

/**
 * Updates a development team member's information in the database.
 *
 * @param {string} id - The unique identifier of the development team member.
 * @param {Partial<DevTeamMember>} updatedData - An object containing the updated data for the team member.
 * If the `image` property is provided, it will be uploaded and the `imageUrl` will be updated accordingly.
 *
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the update was successful, or `false` if an error occurred.
 *
 * @throws {Error} - Throws an error if the update operation fails.
 */
export async function updateDevTeamMember(
	id: string,
	updatedData: Partial<DevTeamMember>
): Promise<boolean> {
	try {
		const devTeamRef = doc(db, "devs", id);
		if (updatedData.image) {
			const imgbb: IMGBB | null = await createImgbbUrl(updatedData.image);
			delete updatedData.image;
			if (imgbb) updatedData.imageUrl = imgbb.url as string;
		}
		await updateDoc(devTeamRef, updatedData);
		return true;
	} catch (error) {
		console.error("Error updating dev team member:", error);
		return false;
	}
}

/**
 * Deletes a member from the dev team based on the provided ID.
 *
 * @param {string} id - The ID of the dev team member to delete.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the deletion was successful, or `false` if an error occurred.
 *
 * @throws Will log an error message to the console if the deletion fails.
 */
export async function deleteDevTeamMember(id: string): Promise<boolean> {
	try {
		const devTeamRef = doc(db, "devs", id);
		await deleteDoc(devTeamRef);
		return true;
	} catch (error) {
		console.error("Error deleting dev team member:", error);
		return false;
	}
}
