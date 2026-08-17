import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json'; 

let app: FirebaseApp | undefined;
export let auth: Auth | undefined;
export let storage: FirebaseStorage | undefined;

try {
  if (firebaseConfig && Object.keys(firebaseConfig).length > 0) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    storage = getStorage(app);
  }
} catch (e) {
  console.warn("Failed to initialize Firebase SDK. Cloud features will be unavailable.", e);
}

export const googleAuthProvider = new GoogleAuthProvider();

export const signIn = async () => {
  if (!auth) throw new Error("Firebase Auth not initialized");
  const result = await signInWithPopup(auth, googleAuthProvider);
  const token = await result.user.getIdToken();
  return { user: result.user, token };
};

export const signOut = async () => {
  if (!auth) throw new Error("Firebase Auth not initialized");
  await fbSignOut(auth);
};
