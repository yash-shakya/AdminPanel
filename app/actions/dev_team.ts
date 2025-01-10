import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../db";
import createImgbbUrl, { IMGBB } from "../helpers/imgbb";

type DevTeamMember = {
    name: string;
    imageUrl?:IMGBB | null;
    year: string;
    linkedin: string;
    github: string;
    instagram: string;
    image?: File | null;
}

export async function addDevTeamMember(member: DevTeamMember) {
    try{
        if(!member.image){
            return {
                err_desc: "No image given"
            }
        }
        const devCollection = collection(db, "devTeam");
        const imgbb: IMGBB | null = await createImgbbUrl(member.image);
        delete member.image;
        const devRef = await addDoc(devCollection, {
            ...member,
            imageUrl: imgbb,
            createdAt: Date.now(),
        });
        console.log("Dev team member added with ID:", devRef.id);
        return devRef.id;
    } catch (error) {
        console.error("Error adding dev team member:", error);
        return {
            err_desc: "Unable to add dev team member"
        }
    }
}   

export async function getDevTeamMembers() {
    try{
        const devTeamRef = collection(db, "devTeam");
        const snapshot = await getDocs(devTeamRef);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting dev team members:", error);
        return {
            err_desc: "Unable to fetch dev team members"
        }
    }
}


export async function getDevTeamMemberById(id: string) {
    try{
        const devTeamRef = doc(db, "devTeam", id);
        const snapshot = await getDoc(devTeamRef);
        return { id: snapshot.id, ...snapshot.data() };
    } catch (error) {
        console.error("Error getting dev team member by ID:", error);
        return {
            err_desc: "Unable to get dev team member"
        }
    }
}

export async function updateDevTeamMember(id: string, updatedData: Partial<DevTeamMember>) {
    try{
        const devTeamRef = doc(db, "devTeam", id);
        if(updatedData.image){
            const imgbb: IMGBB | null = await createImgbbUrl(updatedData.image);
            delete updatedData.image;
            if (imgbb) updatedData.imageUrl = imgbb;
        }
        await updateDoc(devTeamRef, {...updatedData,updatedAt: Date.now()});
        return true;
    } catch (error) {
        console.error("Error updating dev team member:", error);
        return false;
    }
}

export async function deleteDevTeamMember(id: string) {
    try{
        const devTeamRef = doc(db, "devTeam", id);
        await deleteDoc(devTeamRef);
        return true;
    } catch (error) {
        console.error("Error deleting dev team member:", error);
        return false;
    }
}

