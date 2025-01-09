// SCHEMA REFERENCE
// {
//     societyName:{
//         contacts: [],
//         logo: string
//     }
// }

// type Contacts = {
//     imageUrl: string,
//     name: string,
//     post: string {Convenor/co-convenor}
// }

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

import { IMGBB } from "@/app/helpers/imgbb";

// TYPES

type TechspardhaTeam = {
	contacts: Contacts[];
	logo: string;
};

type Contacts = {
	imageURL: IMGBB | null;
	name: string;
	post: Post;
};

enum Post {
	Convenor = "Convenor",
	CoConvenor = "Co-Convenor",
}

export type TechspardhaTeamsDTO = {

}

export type TechspardhaTeamDTO = {
    
}

// ACTIONS

// getAll Teams
export async function getAllTechspardhaTeams(){
    try {

        // get the collection
        const teamsCollection = collection(db, "techspardha_teams");
        
        // get all the documents
        const snapshot = await getDocs(teamsCollection);

        // map the data
        const teams = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Return the teams
        return teams;
        
    } catch (error) {
        console.error("Error fetching teams:", error);
        throw error;
    }
}
