import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateSpacePage from "../pages/create-space";
import HomePage from "../pages/home";
import LoginPage from "../pages/login";
import ProfilePage from "../pages/profile";
import SpacesPage from "../pages/spaces";
import ProtectedRoute from "./ProtectedRoute";
import RootLayout from "./RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/create-space",
        element: (
          <ProtectedRoute>
            <CreateSpacePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/spaces",
        element: (
          <ProtectedRoute>
            <SpacesPage />,
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />,
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
