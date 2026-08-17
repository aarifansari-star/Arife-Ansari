import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import firebaseConfig from '../../firebase-applet-config.json'; 

if (!getApps().length) {
  initializeApp({
    projectId: firebaseConfig.projectId,
    storageBucket: `${firebaseConfig.projectId}.appspot.com`, // Usually the default bucket
  });
}

export const adminAuth = getAuth();
export const adminStorage = getStorage();
