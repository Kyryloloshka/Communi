import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const updateUserStatus = async (userId: string, status: string) => {
  const userRef = doc(db, "users", userId);
  try {
    await updateDoc(userRef, {
      onlineStatus: status,
      lastOnline: serverTimestamp(),
    });
    return;
  } catch (error) {
    console.error("Error updating user status:", error);
  }
};


export default updateUserStatus;