import { database, ref, push, get, update, remove, child } from "@/app/db";
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
    if (!lecture.image) {
      return {
        err_desc: "No image given",
      };
    }

    const imgbb: IMGBB | null = await createImgbbUrl(lecture.image);
    delete lecture.image;

    const lectureRef = ref(database, "lectures");
    const newLectureRef = push(lectureRef);
    const lectureData = {
      ...lecture,
      imageUrl: imgbb?.url,
    };

    await update(newLectureRef, lectureData);

    return newLectureRef.key || "";
  } catch (error) {
    console.error("Error creating lecture:", error);
    return {
      err_desc: "Unable to create lecture",
    };
  }
}

export async function getAllLecture(): Promise<Lecture[]> {
  try {
    const lecturesRef = ref(database, "lectures");
    const snapshot = await get(lecturesRef);

    if (snapshot.exists()) {
      const lecturesData = snapshot.val();
      return Object.entries(lecturesData).map(([id, data]: [string, any]) => ({
        id,
        date: data.date,
        desc: data.desc,
        facebook: data.facebook,
        imageUrl: data.imageUrl,
        insta: data.insta,
        linkedin: data.linkedin,
        link: data.link,
        name: data.name,
        time: data.time,
      })) as Lecture[];
    } else {
      return [];
    }
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
    const lectureRef = ref(database, `lectures/${id}`);
    if (updatedData.image) {
      const imgbb: IMGBB | null = await createImgbbUrl(updatedData.image);
      delete updatedData.image;
      if (imgbb) updatedData.imageUrl = imgbb.url as string;
    }
    await update(lectureRef, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating lecture:", error);
    return false;
  }
}

export async function deleteLecture(id: string): Promise<void> {
  try {
    const lectureRef = ref(database, `lectures/${id}`);
    await remove(lectureRef);
  } catch (error) {
    console.error("Error deleting lecture: ", id, error);
    throw new Error("Failed to delete lecture");
  }
}

export async function getLectureById(id: string): Promise<Lecture | null> {
  try {
    const lectureRef = ref(database, `lectures/${id}`);
    const snapshot = await get(lectureRef);

    if (snapshot.exists()) {
      console.log(snapshot.val());
      return snapshot.val() as Lecture;
    } else {
      throw new Error("Lecture not found");
    }
  } catch (error) {
    console.error("Error fetching lecture: ", error);
    throw new Error("Failed to fetch lecture");
  }
}
