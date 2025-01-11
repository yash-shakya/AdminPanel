import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/db";
import { IMGBB } from "../helpers/imgbb";
import createImgbbUrl from "../helpers/imgbb";

type SponsorsSchema = Record<string, Record<string, Sponsor>>;

type Sponsor = {
  category: string;
  alt: string;
  imageUrl?: string;
  name: string;
  targetUrl: string;
  image?: File | null;
};

export async function createSponsor(
  sponsor: Sponsor
): Promise<string | { err_desc: string }> {
  try {
    if (!sponsor.image) {
      return { err_desc: "No image given" };
    }

    // Upload image and update sponsor object
    const imgbb = await createImgbbUrl(sponsor.image);
    delete sponsor.image;
    sponsor.imageUrl = imgbb?.url as string;

    const sponsorCategory = sponsor.category;
    const categoryDocRef = doc(db, "sponsors", sponsorCategory);

    // Fetch the category document
    const categoryDoc = await getDoc(categoryDocRef);
    let sponsorsInCategory = categoryDoc.exists()
      ? categoryDoc.data()
      : {};

    // Generate a new sponsor ID
    const newSponsorId = `id_${Date.now()}`;

    // Add the new sponsor under the category
    sponsorsInCategory[newSponsorId] = {
      alt: sponsor.alt,
      imageUrl: sponsor.imageUrl,
      name: sponsor.name,
      targetUrl: sponsor.targetUrl,
    };

    // Update or create the category document
    if (categoryDoc.exists()) {
      await updateDoc(categoryDocRef, sponsorsInCategory);
    } else {
      await setDoc(categoryDocRef, sponsorsInCategory);
    }

    console.log(`Sponsor created with ID: ${newSponsorId} in category: ${sponsorCategory}`);
    return newSponsorId;
  } catch (error) {
    console.error("Error creating sponsor:", error);
    return { err_desc: "Unable to create sponsor" };
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
      if (imgbb) updatedData.imageUrl = imgbb.url as string;
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
