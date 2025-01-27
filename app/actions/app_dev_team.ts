import { database, ref, get, set } from "@/app/db";
import createImgbbUrl, { IMGBB } from "@/app/helpers/imgbb";
import { DevTeamMember } from "./dev_team";
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

    const devTeamRef = ref(database, "devs/aboutAppDevs");

    // Fetch the existing members
    const snapshot = await get(devTeamRef);
    let members: DevTeamMember[] = snapshot.exists() ? snapshot.val().members || [] : [];

    // Add the new member
    members.push(member);

    // Update the database with the new members array
    await set(devTeamRef, { members });

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
    const devTeamRef = ref(database, "devs");
    const snapshot = await get(devTeamRef);

    if (!snapshot.exists()) {
      console.warn("No data found in devs");
      return [];
    }

    const data = snapshot.val();
    return Object.keys(data).map((key) => ({ id: key, ...data[key] }));
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
    const devTeamRef = ref(database, "devs/aboutAppDevs");
    const snapshot = await get(devTeamRef);

    if (!snapshot.exists()) {
      return { err_desc: "No data found for the given ID" };
    }

    const members = snapshot.val().members || [];
    return members[index];
  } catch (error) {
    console.error("Error getting dev team member by ID:", error);
    return {
      err_desc: "Unable to get dev team member",
    };
  }
}

/**
 * Updates a development team member's information.
 *
 * @param {number} index - The index of the development team member.
 * @param {Partial<DevTeamMember>} updatedData - Updated data for the team member.
 * @returns {Promise<boolean>}
 */
export async function updateDevTeamMember(
  index: number,
  updatedData: Partial<DevTeamMember>,
): Promise<boolean> {
  try {
    const devTeamRef = ref(database, "devs/aboutAppDevs");
    const snapshot = await get(devTeamRef);

    if (!snapshot.exists()) {
      console.error("No data found for updating");
      return false;
    }

    const members = snapshot.val().members || [];

    if (updatedData.image) {
      const imgbb: IMGBB | null = await createImgbbUrl(updatedData.image);
      delete updatedData.image;
      if (imgbb) updatedData.imageUrl = imgbb.url as string;
    }

    members[index] = { ...members[index], ...updatedData };
    await set(devTeamRef, { members });

    console.log("Dev team member updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating dev team member:", error);
    return false;
  }
}

/**
 * Deletes a development team member based on the provided index.
 *
 * @param {number} index - The index of the team member to delete.
 * @returns {Promise<boolean>}
 */
export async function deleteDevTeamMember(index: number): Promise<boolean> {
  try {
    const devTeamRef = ref(database, "devs/aboutAppDevs");
    const snapshot = await get(devTeamRef);

    if (!snapshot.exists()) {
      console.error("No data found for deletion");
      return false;
    }

    const members = snapshot.val().members || [];
    members.splice(index, 1);

    await set(devTeamRef, { members });

    console.log("Dev team member deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting dev team member:", error);
    return false;
  }
}
