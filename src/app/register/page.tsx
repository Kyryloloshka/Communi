"use client";
import { Button } from "@/components/ui/button";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { auth, db } from "@/lib/firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

export interface ErrorForm {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  tag?: string;
}

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ErrorForm>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [tag, setTag] = useState("");
  const [tagMessage, setTagMessage] = useState("");

  const checkIfTagExists = async (tagValue: string): Promise<boolean> => {
    try {
      const q = query(collection(db, "users"), where("tag", "==", tagValue));
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot.docs);
      return querySnapshot.docs.length > 0;
    } catch (error) {
      console.error("Error checking tag existence:", error);
      return false;
    }
  };

  const checkIfEmailExists = async (email: string): Promise<boolean> => {
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot.docs);
      return querySnapshot.docs.length > 0;
    } catch (error) {
      console.error("Error checking tag existence:", error);
      return false;
    }
  };

  const checkTag = async (tagValue: string) => {
    if (tagValue.trim().length < 5) {
      setTagMessage("Tag must be at least 5 characters long!");
    } else if (!/^[a-zA-Z_0-9]+$/.test(tagValue.trim())) {
      setTagMessage("Only letters, digits, and underscores are allowed!");
    } else if (!/^[a-zA-Z][a-zA-Z0-9_]*[a-zA-Z0-9]$/.test(tagValue.trim())) {
      setTagMessage("The tag is not acceptable");
    } else {
      setTagMessage("Tag is ok!");
    }
    if (await checkIfTagExists("@" + tagValue)) {
      setTagMessage("Tag already exists!");
    }
  };

  const validateForm = async () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const newErrors = {} as ErrorForm;

    if (!name.trim()) {
      newErrors.name = "Name is required!";
    }
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = "Email is required!";
    } else if (await checkIfEmailExists(email)) {
      newErrors.email = "Email already exists!";
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long!";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords are not the same!";
    }
    if (tag.trim().length < 5) {
      newErrors.tag = "Tag must be at least 5 characters long!";
    } else if (!/^[a-zA-Z_0-9]+$/.test(tag.trim())) {
      newErrors.tag = "Only letters, digits, and underscores are allowed!";
    } else if (!/^[a-zA-Z][a-zA-Z0-9_]*[a-zA-Z0-9]$/.test(tag.trim())) {
      newErrors.tag = "The tag is not acceptable";
    } else if (await checkIfTagExists("@" + tag)) {
      newErrors.tag = "Tag already exists!";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSumbit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (await validateForm()) {
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredentials.user;
        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, {
          name,
          email,
          avatarUrl: `https://ui-avatars.com/api/?background=F1CD78&color=000&name=${name}`,
          tag: "@" + tag,
        });
        router.push("/");
        setErrors({});
      } else {
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen m-2">
      <form
        action=""
        onSubmit={handleSumbit}
        className="space-y-2 sm:space-y-4 w-full max-w-md shadow-primary rounded-md py-5 px-4 sm:p-10 flex flex-col gap-2"
      >
        <h1 className="text-2xl text-center font-semibold text-primary-500">
          Communi
        </h1>
        <div className="space-y-2">
          <label htmlFor="name" className="block">
            Name
          </label>
          <input
            placeholder="Enter your name"
            type="text"
            id="name"
            className="w-full border px-3 py-2 rounded dark:bg-dark-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-red-400">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="block">
            Email
          </label>
          <input
            placeholder="Enter your email"
            type="email"
            id="email"
            className="w-full border px-3 py-2 rounded dark:bg-dark-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-red-400">{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="block">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            id="password"
            className="w-full border px-3 py-2 rounded dark:bg-dark-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="text-red-400">{errors.password}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm password"
            id="confirmPassword"
            className="w-full border px-3 py-2 rounded dark:bg-dark-4"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <p className="text-red-400">{errors.confirmPassword}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="tag" className="block">
            @username
          </label>
          <input
            placeholder="Enter your unique tag"
            type="text"
            id="tag"
            className="w-full border px-3 py-2 rounded dark:bg-dark-4"
            value={tag}
            onChange={(e) => {
              setTag(e.target.value);
              checkTag(e.target.value);
            }}
          />
          {tagMessage && (
            <p
              className={`${
                tagMessage === "" || tagMessage === "Tag is ok!"
                  ? "text-green-500"
                  : "text-red-400"
              }`}
            >
              {tagMessage}
            </p>
          )}
        </div>
        <div className="flex flex-auto flex-wrap gap-1 self-center align-center justify-center">
          <span className="text-center">Already have an Account? </span>
          <Link className="text-primary-500 hover:underline" href="/login">
            Sign in
          </Link>
        </div>
        <Button
          className="overflow-hidden flex-auto"
          variant="primary"
          type="submit"
          onClick={() => console.log("Register")}
        >
          {loading ? <span className="loader"></span> : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default Register;
