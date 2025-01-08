import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/db";

type Lecture = {
  date: string;
  desc: string;
  facebook: string;
  imageUrl: string;
  insta: string;
  linkedin: string;
  link: string;
  name: string;
  time: string;
};

export async function createLecture(
  lecture: Lecture
): Promise<String | { err_desc: string }> {
  try {
    const lecturesCollection = collection(db, "lectures");
    const docRef = await addDoc(lecturesCollection, {
      ...lecture,
      createdAt: Date.now(),
    });
    console.log("Lecture created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating lecture:", error);
    return {
      err_desc: "Unable to create lecture",
    };
  }
}

export async function getAllLecture() {
  try {
    const lecturesCollection = collection(db, "lectures");
    const snapshot = await getDocs(lecturesCollection);
    const lectures = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return lectures;
  } catch (error) {
    console.error("Error fetching lectures:", error);
    return {
      err_description: "Unable to fetch lectures",
    };
  }
}

export async function updateLecture(
  id: string,
  updatedData: Partial<Lecture>
): Promise<Boolean> {
  try {
    const lectureDocRef = doc(db, "lectures", id);
    await updateDoc(lectureDocRef, {
      ...updatedData,
      updatedAt: Date.now(),
    });
    console.log("Lecture updated successfully!");
    return true;
  } catch (error) {
    console.error("Error updating lecture:", error);
    return false;
  }
}
