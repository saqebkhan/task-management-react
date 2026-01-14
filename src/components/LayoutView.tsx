import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { checkAuthState } from "@/components/Authentication/Authentication";

import { useAppSelector } from "@/store/hooks";
import ToastComponent from "@/common/ToastComponent";
import LoadingSpinner from "@/common/LoadingSpinner";
import Navbar from "./NavBar";

const App = () => {
  const { isAuthenticated, isLoading, toast } = useAppSelector(
    (state) => state.app
  );
  useEffect(() => {
    checkAuthState();
  }, []);
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
