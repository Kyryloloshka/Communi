"use client"
 
import { Button } from "@/components/ui/button"
import { User, getAuth } from "firebase/auth"
import { app, db } from "@/lib/firebase/firebase"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DocumentData, doc, getDoc } from "firebase/firestore"

export default function Home() {
  const auth = getAuth(app);
  const [user, setUser] = useState<DocumentData | null>();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        setUser(userData)
      } else {
        setUser(null)
        router.push('/login')
      }
    })
    return () => unsubscribe();
  }, [auth, router])

  return (
    <div className="flex h-screen">
      <div className="flex-shrink-0 w-3/12"></div>
      <div className="flex-grow w-3/12"></div>
    </div>
  );
}
