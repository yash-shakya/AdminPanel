import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/app/db";
import { IMGBB } from "../helpers/imgbb";
import createImgbbUrl from "../helpers/imgbb";

export type Lecture = {
  id?: string; // Optional because it is not present when creating a new lecture
  date: string;
  desc: string;
  facebook?: string;
  imageUrl?: string;
  insta?: string;
  linkedin?: string;
  link?: string;
  name: string;
  time: string;
  image?: File | null;
};

export async function createLecture(
  lecture: Lecture,
): Promise<string | { err_desc: string }> {
  try {
    const lecturesCollection = collection(db, "lectures");
    if (!lecture.image) {
      return {
        err_desc: "No image given",
      };
    }

    const imgbb: IMGBB | null = await createImgbbUrl(lecture.image);
    delete lecture.image;
    const docRef = await addDoc(lecturesCollection, {
      ...lecture,
      imageUrl: imgbb?.url,
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating lecture:", error);
    return {
      err_desc: "Unable to create lecture",
    };
  }
}

export async function getAllLecture(): Promise<Lecture[]> {
  try {
    const lecturesCollection = collection(db, "lectures");
    const snapshot = await getDocs(lecturesCollection);
    const lectures = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        date: data.date,
        desc: data.desc,
        facebook: data.facebook,
        imageUrl: data.imageUrl,
        insta: data.insta,
        linkedin: data.linkedin,
        link: data.link,
        name: data.name,
        time: data.time,
      } as Lecture;
    });
    return lectures;
  } catch (error) {
    console.error("Error fetching lectures:", error);
    throw new Error("Error fetching lectures");
  }
}

export async function updateLecture(
  id: string,
  updatedData: Partial<Lecture>,
): Promise<boolean> {
  try {
    const lectureDocRef = doc(db, "lectures", id);
    if (updatedData.image) {
      const imgbb: IMGBB | null = await createImgbbUrl(updatedData.image);
      delete updatedData.image;
      if (imgbb) updatedData.imageUrl = imgbb.url as string;
    }
    await updateDoc(lectureDocRef, {
      ...updatedData,
    });
    return true;
  } catch (error) {
    console.error("Error updating lecture:", error);
    return false;
  }
}

export async function deleteLecture(id: string) {
  try {
    const docRef = doc(db, "lectures", id);

    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting lecture: ", id);
    throw new Error("Failed to delete GL");
  }
}

export async function getLectureById(id: string) {
  try {
    const docRef = doc(db, "lectures", id);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Lecture;
    } else {
      throw new Error("Guest lecture not found");
    }
  } catch (error) {
    console.error("Error fetching lecture: ", error);
    throw new Error("Failed to fetch guest lecture");
  }
}
