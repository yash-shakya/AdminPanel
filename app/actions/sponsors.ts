import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
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
  id?: string; // for getAllSponsors
};

export async function createSponsor(
  sponsor: Sponsor,
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
    let sponsorsInCategory = categoryDoc.exists() ? categoryDoc.data() : {};

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

    console.log(
      `Sponsor created with ID: ${newSponsorId} in category: ${sponsorCategory}`,
    );
    return newSponsorId;
  } catch (error) {
    console.error("Error creating sponsor:", error);
    return { err_desc: "Unable to create sponsor" };
  }
}

export async function getAllSponsors(): Promise<Sponsor[]> {
  try {
    // Reference to the "sponsors" collection
    const sponsorsCollectionRef = collection(db, "sponsors");

    // Fetch all documents in the "sponsors" collection
    const sponsorDocsSnapshot = await getDocs(sponsorsCollectionRef);

    // Initialize an array to hold all sponsors
    const allSponsors: Sponsor[] = [];

    // Process each document in the "sponsors" collection
    sponsorDocsSnapshot.forEach((docSnapshot) => {
      const sponsorCategory = docSnapshot.id; // Document ID is the category
      const sponsors = docSnapshot.data(); // All sponsors under this category

      // Add each sponsor to the array with its category
      for (const sponsorId in sponsors) {
        if (sponsors.hasOwnProperty(sponsorId)) {
          allSponsors.push({
            ...sponsors[sponsorId],
            category: sponsorCategory,
            id: sponsorId,
          });
        }
      }
    });

    console.log("Fetched all sponsors successfully.");
    return allSponsors;
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    throw new Error("Unable to fetch sponsors");
  }
}

export async function updateSponsor(
  id: string,
  currentCategory: string, // The sponsor's current category
  updatedData: Partial<Sponsor>,
): Promise<boolean> {
  try {
    const oldCategoryDocRef = doc(db, "sponsors", currentCategory);

    // Fetch the current category document
    const oldCategoryDocSnap = await getDoc(oldCategoryDocRef);
    if (!oldCategoryDocSnap.exists()) {
      throw new Error(`Current category ${currentCategory} does not exist.`);
    }

    const sponsorsInOldCategory = oldCategoryDocSnap.data();

    if (!sponsorsInOldCategory || !sponsorsInOldCategory[id]) {
      throw new Error(
        `Sponsor with ID ${id} not found in category ${currentCategory}.`,
      );
    }

    // Store the existing sponsor data before modifying/deleting it
    const sponsorData = {
      ...sponsorsInOldCategory[id], // Existing data from the old category
      ...updatedData, // Merge with the updated data
    };

    // Handle image upload if needed
    if (updatedData.image) {
      const imgbb = await createImgbbUrl(updatedData.image);
      delete updatedData.image;
      if (imgbb) {
        sponsorData.imageUrl = imgbb.url as string;
      }
    }

    // Check if the category is changing
    const newCategory = updatedData.category || currentCategory;

    if (newCategory !== currentCategory) {
      // Remove the sponsor from the old category
      delete sponsorsInOldCategory[id];

      // Add the sponsor to the new category
      const newCategoryDocRef = doc(db, "sponsors", newCategory);
      const newCategoryDocSnap = await getDoc(newCategoryDocRef);
      let sponsorsInNewCategory = newCategoryDocSnap.exists()
        ? newCategoryDocSnap.data()
        : {};

      sponsorsInNewCategory[id] = {
        ...sponsorData, // Use the fully prepared sponsor data
      };

      // If the old category becomes empty, delete it
      if (Object.keys(sponsorsInOldCategory).length === 0) {
        await deleteDoc(oldCategoryDocRef);
        console.log(`Category ${currentCategory} deleted as it became empty.`);
      } else {
        // Otherwise, update the category document
        await updateDoc(oldCategoryDocRef, sponsorsInOldCategory);
      }
      delete sponsorsInNewCategory[id].image;
      // Update or create the new category document
      if (newCategoryDocSnap.exists()) {
        await updateDoc(newCategoryDocRef, sponsorsInNewCategory);
      } else {
        await setDoc(newCategoryDocRef, sponsorsInNewCategory);
      }

      console.log(
        `Sponsor moved from category ${currentCategory} to ${newCategory} and updated successfully!`,
      );
    } else {
      // Update the sponsor in the same category
      sponsorsInOldCategory[id] = {
        ...sponsorData, // Use the fully prepared sponsor data
        updatedAt: Date.now(),
      };

      await updateDoc(oldCategoryDocRef, sponsorsInOldCategory);
      console.log(
        `Sponsor with ID ${id} updated in category ${currentCategory}.`,
      );
    }

    return true;
  } catch (error) {
    console.error("Error updating sponsor:", error);
    return false;
  }
}

export async function deleteSponsor(
  sponsorCategory: string,
  sponsorId: string,
): Promise<string> {
  try {
    if (!sponsorId) {
      throw new Error("No sponsor id found");
    }
    // Reference to the specific sponsor category document
    const categoryDocRef = doc(db, "sponsors", sponsorCategory);

    // Fetch the document
    const categoryDoc = await getDoc(categoryDocRef);

    if (!categoryDoc.exists()) {
      throw new Error(`Sponsor category "${sponsorCategory}" does not exist.`);
    }

    // Get all sponsors under the category
    const sponsors = categoryDoc.data();

    // Check if the sponsorId exists in the category
    if (!sponsors[sponsorId]) {
      throw new Error(
        `Sponsor with ID "${sponsorId}" does not exist in category "${sponsorCategory}".`,
      );
    }

    // Remove the sponsor with the given sponsorId
    delete sponsors[sponsorId];

    if (Object.keys(sponsors).length === 0) {
      // If no sponsors remain, delete the entire document
      await deleteDoc(categoryDocRef);
    } else {
      // Otherwise, update the document with the modified sponsors
      await setDoc(categoryDocRef, sponsors, { merge: false });
    }
    console.log(
      `Sponsor with ID "${sponsorId}" successfully deleted from category "${sponsorCategory}".`,
    );
    return `Sponsor "${sponsorId}" deleted successfully.`;
  } catch (error) {
    console.error("Error deleting sponsor:", error);
    throw new Error(`Unable to delete sponsor: ${sponsorId}`);
  }
}

export async function getSponsorById(id: string, category: string) {
  try {
    // Reference the category document
    const categoryDocRef = doc(db, "sponsors", category);

    // Fetch the category document
    const categoryDocSnap = await getDoc(categoryDocRef);

    if (categoryDocSnap.exists()) {
      const sponsors = categoryDocSnap.data();

      // Check if the sponsor with the given ID exists
      if (sponsors && sponsors[id]) {
        return sponsors[id];
      } else {
        throw new Error(
          `Sponsor with ID ${id} not found in category ${category}`,
        );
      }
    } else {
      throw new Error(`Category document ${category} not found`);
    }
  } catch (error) {
    console.error("Error fetching sponsor:", error);
    throw new Error("Failed to fetch sponsor");
  }
}
