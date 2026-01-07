import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import { Bars3Icon } from "@heroicons/react/24/outline";

import { RootState } from "@/store/store";
import {
  setLoading,
  logout,
  showToast,
} from "@/store/appSlice";
import { ROUTE_NAMES, TOAST_TYPES } from "@/components/utils/constant";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state: RootState) => state.app);

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));

      await signOut(getAuth());

      dispatch(logout());

      dispatch(
        showToast({
          message: "Successfully logged out",
          type: TOAST_TYPES.SUCCESS,
        })
      );

      navigate(ROUTE_NAMES.LOGIN);
    } catch (error: any) {
      dispatch(
        showToast({
          message: error.message,
          type: TOAST_TYPES.ERROR,
        })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const isActive = (route: string) =>
    location.pathname === route
      ? "text-indigo-200"
      : "hover:text-indigo-200";

  return (
    <>
      <nav className="bg-indigo-600 text-white shadow-md fixed w-full top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Title */}
            <div className="text-xl font-semibold">
              Task Manager
            </div>

            {/* Hamburger (mobile) */}
            <div className="lg:hidden flex items-center ml-auto">
              <button
                onClick={toggleMenu}
                className="text-white focus:outline-none"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
            </div>

            {/* Desktop menu */}
            <div className="hidden lg:flex space-x-6">
              <NavLink
                to={ROUTE_NAMES.DASHBOARD}
                className={isActive(ROUTE_NAMES.DASHBOARD)}
              >
                Dashboard
              </NavLink>

              <NavLink
                to={ROUTE_NAMES.TASK_MANAGEMENT}
                className={isActive(
                  ROUTE_NAMES.TASK_MANAGEMENT
                )}
              >
                Task Management
              </NavLink>
            </div>

            {/* User + Logout (Desktop) */}
            <div className="hidden lg:flex items-center space-x-4">
              <span className="font-medium">
                {user?.name || "Guest"}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-indigo-600 text-white absolute top-16 left-0 w-full py-4 px-6">
            <NavLink
              to={ROUTE_NAMES.DASHBOARD}
              className={`block mb-4 ${isActive(
                ROUTE_NAMES.DASHBOARD
              )}`}
              onClick={toggleMenu}
            >
              Dashboard
            </NavLink>

            <NavLink
              to={ROUTE_NAMES.TASK_MANAGEMENT}
              className={`block mb-4 ${isActive(
                ROUTE_NAMES.TASK_MANAGEMENT
              )}`}
              onClick={toggleMenu}
            >
              Task Management
            </NavLink>

            <span className="block font-medium my-4">
              {user?.name || "Guest"}
            </span>

            <button
              onClick={handleLogout}
              className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="pt-16" />
    </>
  );
};

export default Navbar;
