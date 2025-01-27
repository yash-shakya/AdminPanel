import { database, ref, get, set, update, remove, child } from "@/app/db";
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

/**
 * Adds a new member to the development team.
 *
 * @param {DevTeamMember} member - The development team member to add.
 * @returns {Promise<string | { err_desc: string }>} The ID of the added team member or an error description.
 */
export async function addDevTeamMember(
  member: DevTeamMember,
): Promise<string | { err_desc: string }> {
  try {
    if (!member.imageUrl) {
      return { err_desc: "No image given" };
    }

    const devsRef = ref(database, "devs/aboutDevs");
    const snapshot = await get(devsRef);
    let members: DevTeamMember[] = [];

    if (snapshot.exists()) {
      const data = snapshot.val();
      if (data?.members && Array.isArray(data.members)) {
        members = data.members;
      } else {
        console.warn("Document data does not contain a valid members array.");
      }
    }

    members.push(member);
    await set(devsRef, { members });

    console.log("Dev team member added successfully");
    return "Member added successfully";
  } catch (error) {
    console.error("Error adding dev team member:", error);
    return { err_desc: "Unable to add dev team member" };
  }
}

/**
 * Fetches the list of development team members.
 *
 * @returns {Promise<Array<{ id: string, [key: string]: any }> | { err_desc: string }>}
 */
export async function getDevTeamMembers(): Promise<
  Array<{ id: string;[key: string]: any }> | { err_desc: string }
> {
  try {
    const devsRef = ref(database, "devs/aboutDevs");
    const snapshot = await get(devsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return data?.members || [];
    } else {
      console.warn("No data found");
      return [];
    }
  } catch (error) {
    console.error("Error getting dev team members:", error);
    return {
      err_desc: "Unable to fetch dev team members",
    };
  }
}

/**
 * Retrieves a development team member's data by their index.
 *
 * @param {number} index - The index of the development team member.
 * @returns {Promise<{ [key: string]: any } | { err_desc: string }>}
 */
export async function getDevTeamMemberById(
  index: number,
): Promise<{ [key: string]: any } | { err_desc: string }> {
  try {
    const devsRef = ref(database, "devs/aboutDevs");
    const snapshot = await get(devsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return data?.members?.[index] || { err_desc: "Member not found" };
    } else {
      return { err_desc: "Data not found" };
    }
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
 * @param {number} index - The index of the development team member.
 * @param {Partial<DevTeamMember>} updatedData - The updated data for the team member.
 * @returns {Promise<boolean>}
 */
export async function updateDevTeamMember(
  index: number,
  updatedData: Partial<DevTeamMember>,
): Promise<boolean> {
  try {
    const devsRef = ref(database, "devs/aboutDevs");
    const snapshot = await get(devsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const members = data?.members;

      if (!Array.isArray(members)) {
        console.error("No members found in the document");
        return false;
      }

      if (updatedData.image) {
        const imgbb: IMGBB | null = await createImgbbUrl(updatedData.image);
        delete updatedData.image;
        if (imgbb) updatedData.imageUrl = imgbb.url as string;
      }

      members[index] = { ...members[index], ...updatedData };
      await set(devsRef, { members });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error updating dev team member:", error);
    return false;
  }
}

/**
 * Deletes a member from the dev team based on the provided index.
 *
 * @param {number} index - The index of the dev team member to delete.
 * @returns {Promise<boolean>}
 */
export async function deleteDevTeamMember(index: number): Promise<boolean> {
  try {
    const devsRef = ref(database, "devs/aboutDevs");
    const snapshot = await get(devsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const members = data?.members;

      if (!Array.isArray(members)) {
        console.error("No members found in the document");
        return false;
      }

      members.splice(index, 1);
      await set(devsRef, { members });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error deleting dev team member:", error);
    return false;
  }
}
