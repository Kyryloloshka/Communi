"use client"
import { getAuth } from "firebase/auth"
import { app, db } from "@/lib/firebase/firebase"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore"
import Users from "@/components/Users"
import SheetProfile from '@/components/SheetProfile';
import Chat from "@/components/Chat"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import {
  Sheet,
  SheetTrigger,
} from "@/components/ui/sheet"
import SearchUsersByTag from "@/components/SearchUsersByTag"
import SearchResultsComponent from "@/components/SearchResultsComponent"
import { IUser } from "@/types"

export default function Home() {
  const auth = getAuth(app);
  const [user, setUser] = useState<IUser | null>(null);
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchResults, setSearchResults] = useState([] as any);
  const [searchTag, setSearchTag] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const userData = ({id: userDoc.id, ...userDoc.data()});
        setUser(userData as IUser)
      } else {
        setUser(null)
        router.push('/login')
      }
    })
    return () => unsubscribe();
  }, [auth, router])

  const updateUserStatus = async (userId: string, status: string) => {
    const userRef = doc(db, 'users', userId);
    try {
      await updateDoc(userRef, {
        onlineStatus: status,
        lastOnline: serverTimestamp(),
      });
      return;
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };
  
  useEffect(() => {
    let focusListener: () => void;
    let blurListener: () => void;
  
    const setUserFocusListeners = () => {
      focusListener = () => {
        if (user && user.id) {
          updateUserStatus(user.id, 'online');
        }
      };
  
      blurListener = () => {
        if (user && user.id) {
          updateUserStatus(user.id, 'offline');
        }
      };
  
      window.addEventListener('focus', focusListener);
      window.addEventListener('blur', blurListener);
    };
  
    const removeUserFocusListeners = () => {
      window.removeEventListener('focus', focusListener);
      window.removeEventListener('blur', blurListener);
    };
  
    if (user) {
      setUserFocusListeners();
    }
  
    return () => {
      removeUserFocusListeners();
    };
  }, [user]);

  return (
    <div className="flex h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25} className="min-w-[200px]">
          <div className="h-12 w-full flex items-center gap-2 p-3">
            <Sheet>
              <SheetTrigger>
                <div className='burger'>
                </div>
              </SheetTrigger>
              <SheetProfile user={user} />
            </Sheet>
            <SearchUsersByTag searchTag={searchTag} setSearchTag={setSearchTag} setSearchResults={setSearchResults}/>
          </div>
          {searchTag.length > 0 ? <SearchResultsComponent setSearchTag={setSearchTag} setSelectedChat={setSelectedChat} userData={user} loading={false} searchResults={searchResults}/> :
          <Users userData={user} setSelectedChat={setSelectedChat} selectedChat={selectedChat}/>}
        </ResizablePanel>
        <ResizableHandle className="bg-dark-5"/>
        <ResizablePanel defaultSize={75} className="min-w-[300px]">
          <Chat selectedChat={selectedChat}/>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
