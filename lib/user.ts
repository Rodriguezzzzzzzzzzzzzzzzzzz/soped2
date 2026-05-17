import { db } from "./firebase"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"

export type UserRole = "admin" | "chair" | "delegate"

export async function ensureUserProfile(user: any) {
  if (!user?.uid) return

  const ref = doc(db, "users", user.uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email || "",
      role: "delegate",
      createdAt: serverTimestamp(),
    })
  }
}

export async function getUserProfile(uid: string) {
  const ref = doc(db, "users", uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) return null
  return snap.data() as {
    uid: string
    email: string
    role: UserRole
    createdAt?: any
  }
}