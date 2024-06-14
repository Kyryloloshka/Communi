"use client";
import { db } from "@/lib/firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        try {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("__name__", "==", id));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            setUser({ id: userDoc.id, ...userDoc.data() });
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile ID: {id}</h1>
      {user ? (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>No user found</p>
      )}
    </div>
  );
};

export default ProfilePage;
