"use client";
import { getAuth } from "firebase/auth";
import { app, db } from "@/lib/firebase/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import Chat from "@/components/Chat";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { ChatData, SelectedChatData, User } from "@/types";
import LeftBar from "@/components/LeftBar";

export default function Home() {
  const auth = getAuth(app);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState<SelectedChatData | null>(
    null
  );
  const [searchResults, setSearchResults] = useState([] as any);
  const [searchTag, setSearchTag] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        const userData = { id: userDoc.id, ...userDoc.data() };
        setUser(userData as User);
      } else {
        setUser(null);
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

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

  useEffect(() => {
    let focusListener: () => void;
    let blurListener: () => void;

    const setUserFocusListeners = () => {
      focusListener = () => {
        if (user && user.id) {
          updateUserStatus(user.id, "online");
        }
      };

      blurListener = () => {
        if (user && user.id) {
          updateUserStatus(user.id, "offline");
        }
      };

      window.addEventListener("focus", focusListener);
      window.addEventListener("blur", blurListener);
    };

    const removeUserFocusListeners = () => {
      window.removeEventListener("focus", focusListener);
      window.removeEventListener("blur", blurListener);
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
          <LeftBar
            searchTag={searchTag}
            user={user}
            setSearchTag={setSearchTag}
            setSearchResults={setSearchResults}
            setSelectedChat={setSelectedChat}
            searchResults={searchResults}
            selectedChat={selectedChat}
          />
        </ResizablePanel>
        <ResizableHandle className="bg-dark-5" />
        <ResizablePanel defaultSize={75} className="min-w-[300px]">
          <Chat selectedChat={selectedChat} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
