import LayoutView from "@/components/LayoutView";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";
import {
  setAuthUser,
  setAuthChecked,
  setAuthenticated,
} from "@/store/appSlice";
import { useEffect } from "react";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
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
  }, []);
  return (
    <>
      <LayoutView />
    </>
  );
};
export default App;
