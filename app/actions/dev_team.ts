import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../db";
import { IMGBB } from "../helpers/imgbb";

type DevTeamMember = {
    name: string;
    imageUrl:IMGBB | null;
    year: string;
    linkedin: string;
    github: string;
    instagram: string;
}

export async function addDevTeamMember(member: DevTeamMember) {
    try{
        const devCollection = collection(db, "devTeam");
        const devRef = await addDoc(devCollection, member);
        console.log("Dev team member added with ID:", devRef.id);
        return devRef.id;
    } catch (error) {
        console.error("Error adding dev team member:", error);
        throw error;
    }
}   

export async function getDevTeamMembers() {
    try{
        const devTeamRef = collection(db, "devTeam");
        const snapshot = await getDocs(devTeamRef);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting dev team members:", error);
        throw error;
    }
}


export async function getDevTeamMemberById(id: string) {
    try{
        const devTeamRef = doc(db, "devTeam", id);
        const snapshot = await getDoc(devTeamRef);
        return { id: snapshot.id, ...snapshot.data() };
    } catch (error) {
        console.error("Error getting dev team member by ID:", error);
        throw error;
    }
}

export async function updateDevTeamMember(id: string, updatedData: Partial<DevTeamMember>) {
    try{
        const devTeamRef = doc(db, "devTeam", id);
        await updateDoc(devTeamRef, updatedData);
    } catch (error) {
        console.error("Error updating dev team member:", error);
        throw error;
    }
}

export async function deleteDevTeamMember(id: string) {
    try{
        const devTeamRef = doc(db, "devTeam", id);
        await deleteDoc(devTeamRef);
    } catch (error) {
        console.error("Error deleting dev team member:", error);
        throw error;
    }
}

