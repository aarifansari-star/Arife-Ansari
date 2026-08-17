import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json'; 

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const storage = getStorage(app);

export const signIn = async () => {
  const result = await signInWithPopup(auth, googleAuthProvider);
  const token = await result.user.getIdToken();
  return { user: result.user, token };
};

export const signOut = async () => {
  await fbSignOut(auth);
};
