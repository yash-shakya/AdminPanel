import { getFirestore } from "firebase/firestore";
import fireapp from "@/app/firebase.config";

// Get Firestore instance
const db = getFirestore(fireapp);

export { db };
