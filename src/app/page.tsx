"use client"
 
import { Button } from "@/components/ui/button"
import { User, getAuth, signOut } from "firebase/auth"
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

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Home() {
  const auth = getAuth(app);
  const [user, setUser] = useState<DocumentData | null | undefined>(null);
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const userData = ({id: userDoc.id, ...userDoc.data()});
        setUser(userData)
      } else {
        setUser(null)
        router.push('/login')
      }
    })
    return () => unsubscribe();
  }, [auth, router])

  const handleLogout = () => {
    signOut(auth).then(() => {
      router.push('/login')
    }).catch((error) => {
      console.log(error)
    })
  }

  return (
    <div className="flex h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25} className="min-w-[200px]">
          <div className="h-8 w-full flex items-center gap-2 p-3 bg-dark-3">
            <Sheet>
              <SheetTrigger>
                <div className='burger'>
                </div>
              </SheetTrigger>
              <SheetContent side={"left"} className='w-[260px]'>
                <Button variant={"primary"} onClick={handleLogout}>Logout</Button>
              </SheetContent>
            </Sheet>
          </div>
          <Users userData={user} setSelectedChat={setSelectedChat}/>
        </ResizablePanel>
        <ResizableHandle className="bg-dark-5"/>
        <ResizablePanel defaultSize={75} className="min-w-[300px]">
          <Chat user={user} selectedChat={selectedChat}/>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
