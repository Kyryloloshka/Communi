import React from "react";
import { SheetContent } from "./ui/sheet";
import { Button } from "./ui/button";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/firebase";
import { IUser } from "@/types";

const SheetProfile = ({user}: {user: IUser | null | undefined}) => {
  const router = useRouter();

  const handleLogout = () => {
    signOut(auth).then(() => {
      router.push('/login')
    }).catch((error) => {
      console.log(error)
    })
  }
  console.log(user);
  
  return <SheetContent side={"left"} className='w-[260px] p-4 outline-none flex flex-col gap-2'>
    {user && <>
        <div className="flex-auto">
          {user.avatarUrl && <img src={user.avatarUrl} alt={user.name} className='w-10 h-10 rounded-full' />}
          {user.name && <div className="">{user.name}</div>}
          {user.tag && <div className="text-xs text-gray-500">{user.tag}</div>}
        </div>
        <Button variant={"destructive"} onClick={() => handleLogout()}>Logout</Button>
      </>
    }
  </SheetContent>;
}

export default SheetProfile;
  