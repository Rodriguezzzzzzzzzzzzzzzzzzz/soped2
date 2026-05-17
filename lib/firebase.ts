import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

// Obtener perfil de usuario
export async function getUserProfile(uid: string) {
  const ref = doc(db, "users", uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) return null

  return snap.data()
}

// Crear perfil de usuario si no existe
export async function createUserProfile(uid: string, email: string) {
  const ref = doc(db, "users", uid)

  await setDoc(ref, {
    uid,
    email,
    name: "Usuario",
    role: "delegate",
    organization: "SoPeD",
    createdAt: serverTimestamp()
  })
}

// Asegurar que el usuario exista en Firestore
export async function ensureUserProfile(user: { uid: string; email: string | null }) {
  if (!user?.uid) return

  const ref = doc(db, "users", user.uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    await createUserProfile(user.uid, user.email || "")
  }

  return getUserProfile(user.uid)
}