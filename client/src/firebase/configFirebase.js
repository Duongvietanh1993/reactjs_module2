import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCGRty4KGTm7-utUGISG0nSLnoPdgQ2FDo",
  authDomain: "fir-login-with-e3ed6.firebaseapp.com",
  projectId: "fir-login-with-e3ed6",
  storageBucket: "fir-login-with-e3ed6.appspot.com",
  messagingSenderId: "344242607430",
  appId: "1:344242607430:web:f5ca4fdf574aa1b8cc0147"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
const storage = getStorage(app);
export { storage };
