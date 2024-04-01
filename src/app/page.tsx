"use client"
 
import { Button } from "@/components/ui/button"
import { User, getAuth } from "firebase/auth"
import { app, db } from "@/lib/firebase/firebase"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DocumentData, doc, getDoc } from "firebase/firestore"
import Users from "@/components/Users"
import Chat from "@/components/Chat"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function Home() {
  const auth = getAuth(app);
  const [user, setUser] = useState<DocumentData | null | undefined>(null);
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
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25} className="min-w-[200px] py-3">
          <Users user={user}/>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75} className="min-w-[300px]">
          <Chat user={user}/>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
