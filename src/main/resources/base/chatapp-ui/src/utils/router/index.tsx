import type { RouteObject } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import SSOCallback from "../../pages/Auth/SSOCallback";
import SignInPage from "../../pages/Auth/SignIn";
import SignUpPage from "../../pages/Auth/SignUp";
import ForgotPassPage from "../../pages/Auth/ForgotPass";
import CheckEmailPage from "../../pages/Auth/CheckMail";
import PasswordResetPage from "../../pages/Auth/PasswordReset";
import AppLayout from "../../layouts/AppLayout";

import ProtectedRoute from "../../components/guards/ProtectedRoute";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <SignInPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      },
      {
        path: "verify-email",
        element: <CheckEmailPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassPage />,
      },
      {
        path: "reset-password",
        element: <PasswordResetPage />,
      },
    ],
  },
  {
    path: "app",
    element: <ProtectedRoute><AppLayout/></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <div>App Home</div>,
      },
      {
        path: "chat/:id",
        element: <div>Chat Page</div>,
      }
    ],
  },
  {
    path: "signin/oauth",
    element: <SSOCallback />,
  },
];

export default routes;
