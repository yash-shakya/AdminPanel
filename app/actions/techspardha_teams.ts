// SCHEMA REFERENCE
// {
//     societyName:{
//         contacts: [],
//         logo: string | null,
//     }
// }

// type Contacts = {
//     imageUrl: string,
//     name: string,
//     post: string {Convenor/co-convenor}
// }
// 

// EXAMPLE
// {
//    "contacts": {
//        "team1": {
//            "contacts": [
//                {
//                    "imageUrl": {IMGBB object},
//                    "name": "John Doe",
//                    "post": "Convenor"
//                }
//            ],
//            "logo": {IMGBB object}
//        },
//        "team2": {
//            "contacts": [
//                {
//                    "imageUrl": {IMGBB object},
//                    "name": "Jane Doe",
//                    "post": "Co-Convenor"
//                }
//            ],
//            "logo": {IMGBB object}
//        }
//    }
// }

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

import { IMGBB } from "@/app/helpers/imgbb";

// TYPES

export type TechspardhaTeam = {
	contacts: Contacts[];
	logo: string | null;
};

type Contacts = {
	imageURL: string;
	name: string;
	post: Post | string;
};

export enum Post {
	Convenor = "Convenor",
	CoConvenor = "Co-Convenor",
}

export type TechspardhaTeamsDTO = {
    [key: string]: TechspardhaTeam;
}


// ACTIONS

// getAll Teams
/**
 * Fetches all Techspardha teams from the Firestore database.
 *
 * @returns {Promise<TechspardhaTeamsDTO>} A promise that resolves to an object containing all Techspardha teams, 
 * where each key is the team ID and the value is the team data.
 *
 * @throws {Error} Throws an error if there is an issue fetching the teams from the database.
 *
 * @example
 * ```
 * getAllTechspardhaTeams()
 *   .then((teams) => {
 *     console.log(teams);
 *   })
 *   .catch((error) => {
 *     console.error("Error fetching techspardha teams: ", error);
 *   });
 * ```
 */
export async function getAllTechspardhaTeams() : Promise<TechspardhaTeamsDTO> {
    try {
        // Get a reference to the "contacts" collection in Firestore
        const querySnapshot = await getDocs(collection(db, "contacts"));
        // Create an object to store the team data
        const data: TechspardhaTeamsDTO = {};
        // Iterate over each document in the collection and add it to the data object
        querySnapshot.forEach((doc) => {
            data[doc.id] = doc.data() as TechspardhaTeam;
        });
        // Return the data object containing all the teams -> array of TechspardhaTeam objects
        return data;
    } catch (error) {
        console.error("Error fetching techspardha teams: ", error);
        throw new Error("Failed to fetch techspardha teams");
    }
}

// get Team by ID // -> id or key is the team name
/**
 * Fetches a Techspardha team by its ID from the Firestore database.
 *
 * @param {string} id - The ID of the Techspardha team to fetch.
 * @returns {Promise<TechspardhaTeam>} A promise that resolves to a TechspardhaTeam object containing the team's data.
 *
 * @throws {Error} Throws an error if the team is not found or if there is an issue fetching the team from the database.
 *
 * @example
 * ```
 * getTechspardhaTeamById("teamId123")
 *   .then((team) => {
 *     console.log(team);
 *   })
 *   .catch((error) => {
 *     console.error("Error fetching techspardha team: ", error);
 *   });
 * ```
 */
export async function getTechspardhaTeamById(id: string) : Promise<TechspardhaTeam> {
    try {
        // Get a reference to the document in the "contacts" collection with the specified id
        const docRef = doc(db, "contacts", id);
        
        // Fetch the document snapshot from Firestore
        const docSnap = await getDoc(docRef);
        
        // Check if the document exists
        if(docSnap.exists()){
            // If the document exists, return its data as a TechspardhaTeam object
            return docSnap.data() as TechspardhaTeam;
        } else {
            // If the document does not exist, throw an error indicating the team was not found
            throw new Error("Techspardha team not found");
        }
    } catch (error) {
        // Log an error message if there was an issue fetching the team and throw an error
        console.error("Error fetching techspardha team: ", error);
        throw new Error("Failed to fetch techspardha team");
    }
}

// create Team // -> id or key is the team name
/**
 * Creates a new Techspardha team in the Firestore database.
 *
 * @param {string} team - The name of the team to be created.
 * @param {TechspardhaTeam} data - The data of the team to be created.
 * @returns {Promise<void>} A promise that resolves when the team is successfully created.
 *
 * @throws {Error} Throws an error if there is an issue creating the team in the database.
 *
 * @example
 * ```typescript
 * const teamData: TechspardhaTeam = {
 *   // team data properties
 * };
 * createTechspardhaTeam("TeamName", teamData)
 *   .then(() => {
 *     console.log("Team created successfully");
 *   })
 *   .catch((error) => {
 *     console.error("Error creating techspardha team: ", error);
 *   });
 * ```
 */
export async function createTechspardhaTeam(team: string, data: TechspardhaTeam): Promise<void> {
    try {
        // Get a reference to the "contacts" collection in Firestore
        const collectionRef = collection(db, "contacts");

        // Create a document reference with the provided team name as the ID
        const docRef = doc(collectionRef, team);

        // Set the document data with the provided data
        await setDoc(docRef, data);

        // Log a message indicating the team was successfully created
        console.log("Techspardha team created: ", team);
    } catch (error) {
        // Log an error message if there was an issue creating the team and throw an error
        console.error("Error creating techspardha team: ", error);
        throw new Error("Failed to create techspardha team");
    }
}

// update Team // -> id or key is the team name ( A whole Team will be updated not a single contact or logo)
/**
 * Updates an existing Techspardha team in the Firestore database.
 *
 * @param {string} team - The name of the team to be updated.
 * @param {TechspardhaTeam} data - The updated data for the team.
 * @returns {Promise<void>} A promise that resolves when the team is successfully updated.
 *
 * @throws {Error} Throws an error if the team is not found or if there is an issue updating the team in the database.
 *
 * @example
 * ```typescript
 * const updatedTeamData: TechspardhaTeam = {
 *   // updated team data properties
 * };
 * updateTechspardhaTeam("TeamName", updatedTeamData)
 *   .then(() => {
 *     console.log("Team updated successfully");
 *   })
 *   .catch((error) => {
 *     console.error("Error updating techspardha team: ", error);
 *   });
 * ```
 */
export async function updateTechspardhaTeam(team: string, data: TechspardhaTeam) : Promise<void> {
    try {
        // Get a reference to the document in the "contacts" collection with the specified id
        const docRef = doc(db, "contacts", team);
        
        // Update the document with the new data
        await updateDoc(docRef, data);
        
        // Log a message indicating the team was successfully updated
        console.log("Techspardha team updated: ", team);
    } catch (error) {
        // Log an error message if there was an issue updating the team and throw an error
        console.error("Error updating techspardha team: ", error);
        throw new Error("Failed to update techspardha team");
    }
}

// delete Team // -> id or key is the team name
/**
 * Deletes an existing Techspardha team from the Firestore database.
 *
 * @param {string} team - The name of the team to be deleted.
 * @returns {Promise<void>} A promise that resolves when the team is successfully deleted.
 *
 * @throws {Error} Throws an error if the team is not found or if there is an issue deleting the team from the database.
 *
 * @example
 * ```typescript
 * deleteTechspardhaTeam("TeamName")
 *   .then(() => {
 *     console.log("Team deleted successfully");
 *   })
 *   .catch((error) => {
 *     console.error("Error deleting techspardha team: ", error);
 *   });
 * ```
 */
export async function deleteTechspardhaTeam(team: string) : Promise<void> {
    try {
        // Get a reference to the document in the "contacts" collection with the specified id
        const docRef = doc(db, "contacts", team);
        
        // Delete the document from Firestore
        await deleteDoc(docRef);
        
        // Log a message indicating the team was successfully deleted
        console.log("Techspardha team deleted: ", team);
    } catch (error) {
        // Log an error message if there was an issue deleting the team and throw an error
        console.error("Error deleting techspardha team: ", error);
        throw new Error("Failed to delete techspardha team");
    }
}