import { initializeApp } from "firebase/app";
import { onAuthStateChanged, getAuth } from "@firebase/auth";
import {
  setAuthChecked,
  setAuthenticated,
  setAuthUser,
} from "@/store/appSlice";
import { store } from "@/store/store";

const dispatch = store.dispatch;

const firebaseConfig = {
  apiKey: "AIzaSyDzNO9WQR83Kd3GVIyn5Ctr9O97ebJp5mk",
  authDomain: "task-management-ac.firebaseapp.com",
  projectId: "task-management-ac",
  storageBucket: "task-management-ac.firebasestorage.app",
  messagingSenderId: "941309929544",
  appId: "1:941309929544:web:c6fedc3346fbfaf447107d",
  measurementId: "G-LBC81007R1",
};

initializeApp(firebaseConfig);

export const checkAuthState = () => {
  const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      dispatch(
        setAuthUser({
          id: user.uid,
          name: user.displayName ?? "",
          email: user.email ?? "",
        })
      );
      dispatch(setAuthenticated(true));
    } else {
      dispatch(setAuthenticated(false));
    }

    dispatch(setAuthChecked(true));
  });

  return unsubscribe;
};
