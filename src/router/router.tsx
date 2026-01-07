import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RequireAuth from "@/router/RequireAuth";

import Dashboard from "@/components/Dashboard";
import LoginUser from "@/components/Authentication/LoginUser";
import RegisterUser from "@/components/Authentication/RegisterUser";
import TaskManagement from "@/components/TaskManagement/TaskManagement";
import AddEditForm from "@/components/TaskManagement/AddEditForm";
import NotFound from "@/common/NotFound";

import { ROUTE_NAMES } from "@/components/utils/constant";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: ROUTE_NAMES.LOGIN, element: <LoginUser /> },
      { path: ROUTE_NAMES.REGISTER, element: <RegisterUser /> },

      {
        element: <RequireAuth />,
        children: [
          { path: ROUTE_NAMES.DASHBOARD, element: <Dashboard /> },
          { path: ROUTE_NAMES.ADD_EDIT_FORM, element: <AddEditForm /> },
          { path: ROUTE_NAMES.TASK_MANAGEMENT, element: <TaskManagement /> },
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);
