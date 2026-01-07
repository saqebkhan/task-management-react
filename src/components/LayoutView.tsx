import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hideToast } from "@/store/appSlice";
import ToastComponent from "@/common/ToastComponent";
import LoadingSpinner from "@/common/LoadingSpinner";
import Navbar from "./NavBar";

const App = () => {
  const dispatch = useAppDispatch();

  const { isAuthenticated, isLoading, toast } = useAppSelector(
    (state) => state.app
  );

  useEffect(() => {
    if (toast.isVisible) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.isVisible, dispatch]);

  return (
    <>
      {isAuthenticated && <Navbar />}
      {isLoading && <LoadingSpinner />}
      <Outlet />
      {toast.isVisible && <ToastComponent />}
    </>
  );
};

export default App;
