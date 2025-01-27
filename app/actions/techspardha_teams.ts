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
import { database, ref, set, get, update, remove, child } from "@/app/db";

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
};

// ACTIONS

// Get All Teams
export async function getAllTechspardhaTeams(): Promise<TechspardhaTeamsDTO> {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "contacts"));
    if (snapshot.exists()) {
      return snapshot.val() as TechspardhaTeamsDTO;
    } else {
      throw new Error("No Techspardha teams found");
    }
  } catch (error) {
    console.error("Error fetching techspardha teams: ", error);
    throw new Error("Failed to fetch techspardha teams");
  }
}

// Get Team by ID
export async function getTechspardhaTeamById(id: string): Promise<TechspardhaTeam> {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `contacts/${id}`));
    if (snapshot.exists()) {
      return snapshot.val() as TechspardhaTeam;
    } else {
      throw new Error("Techspardha team not found");
    }
  } catch (error) {
    console.error("Error fetching techspardha team: ", error);
    throw new Error("Failed to fetch techspardha team");
  }
}

// Create Team
export async function createTechspardhaTeam(
  team: string,
  data: TechspardhaTeam
): Promise<void> {
  try {
    const dbRef = ref(database, `contacts/${team}`);
    await set(dbRef, data);
    console.log("Techspardha team created: ", team);
  } catch (error) {
    console.error("Error creating techspardha team: ", error);
    throw new Error("Failed to create techspardha team");
  }
}

// Update Team
export async function updateTechspardhaTeam(
  team: string,
  data: TechspardhaTeam
): Promise<void> {
  try {
    const dbRef = ref(database, `contacts/${team}`);
    await update(dbRef, data);
    console.log("Techspardha team updated: ", team);
  } catch (error) {
    console.error("Error updating techspardha team: ", error);
    throw new Error("Failed to update techspardha team");
  }
}

// Delete Team
export async function deleteTechspardhaTeam(team: string): Promise<void> {
  try {
    const dbRef = ref(database, `contacts/${team}`);
    await remove(dbRef);
    console.log("Techspardha team deleted: ", team);
  } catch (error) {
    console.error("Error deleting techspardha team: ", error);
    throw new Error("Failed to delete techspardha team");
  }
}
