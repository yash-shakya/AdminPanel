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
