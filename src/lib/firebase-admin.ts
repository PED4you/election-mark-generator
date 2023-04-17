// eslint-disable-next-line import/no-unresolved
import { cert, initializeApp } from "firebase-admin/app"
// eslint-disable-next-line import/no-unresolved
import { getFirestore } from "firebase-admin/firestore"

export default function getDb() {
  try {
    return getFirestore()
  } catch {
    initializeApp({
      credential: cert({
        projectId: process.env?.FIREBASE_PROJECT_ID ?? "",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/gm, "\n"),
      }),
    })
    return getFirestore()
  }
}
