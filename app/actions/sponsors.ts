import { database, ref, set, push, get, remove, update } from "@/app/db";
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
    const categoryRef = ref(database, `sponsors/${sponsorCategory}`);

    // Generate a new sponsor ID
    const newSponsorRef = push(categoryRef);
    const newSponsorId = newSponsorRef.key;

    if (!newSponsorId) {
      throw new Error("Failed to generate sponsor ID");
    }

    // Add the new sponsor
    await set(newSponsorRef, {
      alt: sponsor.alt,
      imageUrl: sponsor.imageUrl,
      name: sponsor.name,
      targetUrl: sponsor.targetUrl,
    });

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
    const sponsorsRef = ref(database, "sponsors");
    const snapshot = await get(sponsorsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const sponsorsData = snapshot.val();
    const allSponsors: Sponsor[] = [];

    for (const sponsorCategory in sponsorsData) {
      if (sponsorsData.hasOwnProperty(sponsorCategory)) {
        const sponsorsInCategory = sponsorsData[sponsorCategory];
        for (const sponsorId in sponsorsInCategory) {
          if (sponsorsInCategory.hasOwnProperty(sponsorId)) {
            allSponsors.push({
              ...sponsorsInCategory[sponsorId],
              category: sponsorCategory,
              id: sponsorId,
            });
          }
        }
      }
    }

    console.log("Fetched all sponsors successfully.");
    return allSponsors;
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    throw new Error("Unable to fetch sponsors");
  }
}

export async function updateSponsor(
  id: string,
  currentCategory: string,
  updatedData: Partial<Sponsor>,
): Promise<boolean> {
  try {
    currentCategory = decodeURIComponent(currentCategory);
    const currentSponsorRef = ref(database, `sponsors/${currentCategory}/${id}`);
    const snapshot = await get(currentSponsorRef);

    if (!snapshot.exists()) {
      throw new Error(
        `Sponsor with ID ${id} not found in category ${currentCategory}.`,
      );
    }

    const sponsorData = {
      ...snapshot.val(),
      ...updatedData,
    };

    if (updatedData.image) {
      const imgbb = await createImgbbUrl(updatedData.image);
      delete updatedData.image;
      if (imgbb) {
        sponsorData.imageUrl = imgbb.url as string;
      }
    }

    const newCategory = updatedData.category || currentCategory;

    if (newCategory !== currentCategory) {
      // Remove from the current category
      await remove(currentSponsorRef);

      // Add to the new category
      const newSponsorRef = ref(database, `sponsors/${newCategory}/${id}`);
      await set(newSponsorRef, sponsorData);
      console.log(
        `Sponsor moved from category ${currentCategory} to ${newCategory} and updated successfully!`,
      );
    } else {
      // Update in the same category
      await update(currentSponsorRef, sponsorData);
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
    const sponsorRef = ref(database, `sponsors/${sponsorCategory}/${sponsorId}`);
    const snapshot = await get(sponsorRef);

    if (!snapshot.exists()) {
      throw new Error(
        `Sponsor with ID "${sponsorId}" does not exist in category "${sponsorCategory}".`,
      );
    }

    await remove(sponsorRef);

    const categoryRef = ref(database, `sponsors/${sponsorCategory}`);
    const categorySnapshot = await get(categoryRef);

    if (!categorySnapshot.exists()) {
      console.log(`Category ${sponsorCategory} has no remaining sponsors.`);
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
    const decodedCategory = decodeURIComponent(category);
    const sponsorRef = ref(database, `sponsors/${decodedCategory}/${id}`);
    const snapshot = await get(sponsorRef);

    if (!snapshot.exists()) {
      throw new Error(`Sponsor with ID ${id} not found in category ${decodedCategory}`);
    }

    return snapshot.val();
  } catch (error) {
    console.error("Error fetching sponsor:", error);
    throw new Error("Failed to fetch sponsor");
  }
}
