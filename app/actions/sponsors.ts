import {
	collection,
	addDoc,
	getDocs,
	doc,
	updateDoc,
} from "firebase/firestore";
import { db } from "@/app/db";
import { IMGBB } from "../helpers/imgbb";
import createImgbbUrl from "../helpers/imgbb";

type Sponsor = {
	alt: string;
	imageUrl?: IMGBB | null;
	name: string;
	targetUrl: string;
	image?: File | null;
};

export async function createSponsor(
	sponsor: Sponsor
): Promise<string | { err_desc: string }> {
	try {
		const sponsorsCollection = collection(db, "sponsors");
		if (!sponsor.image) {
			return {
				err_desc: "No image given",
			};
		}
		const imgbb: IMGBB | null = await createImgbbUrl(sponsor.image);
		delete sponsor.image;
		const docRef = await addDoc(sponsorsCollection, {
			...sponsor,
			imageUrl: imgbb,
			createdAt: Date.now(),
		});
		console.log("Sponsor created with ID:", docRef.id);
		return docRef.id;
	} catch (error) {
		console.error("Error creating sponsor:", error);
		return {
			err_desc: "Unable to create sponsor",
		};
	}
}

export async function getAllSponsor() {
	try {
		const sponsorsCollection = collection(db, "sponsors");
		const snapshot = await getDocs(sponsorsCollection);
		const sponsors = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		return sponsors;
	} catch (error) {
		console.error("Error fetching sponsors:", error);
		return {
			err_description: "Unable to fetch sponsors",
		};
	}
}

export async function updateSponsor(
	id: string,
	updatedData: Partial<Sponsor>
): Promise<boolean> {
	try {
		const sponsorDocRef = doc(db, "sponsors", id);
		if (updatedData.image) {
			const imgbb: IMGBB | null = await createImgbbUrl(updatedData.image);
			delete updatedData.image;
			if (imgbb) updatedData.imageUrl = imgbb;
		}
		await updateDoc(sponsorDocRef, {
			...updatedData,
			updatedAt: Date.now(),
		});
		console.log("Sponsor updated successfully!");
		return true;
	} catch (error) {
		console.error("Error updating Sponsor:", error);
		return false;
	}
}
