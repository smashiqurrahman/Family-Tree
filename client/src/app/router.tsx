import { createBrowserRouter } from "react-router-dom";

import HomePage from "../pages/Home/HomePage";
import SignInPage from "../pages/Auth/SignInPage";
import SignUpPage from "../pages/Auth/SignUpPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import TreeWorkspacePage from "../pages/Trees/TreeWorkspacePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/trees/:treeId",
    element: <TreeWorkspacePage />,
  },
]);