import type { RouteObject } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import SSOCallback from "../../pages/Auth/SSOCallback";
import SignInPage from "../../pages/Auth/SignIn";
import SignUpPage from "../../pages/Auth/SignUp";
import ForgotPassPage from "../../pages/Auth/ForgotPass";
import CheckEmailPage from "../../pages/Auth/CheckMail";
import PasswordResetPage from "../../pages/Auth/PasswordReset";

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
    path: "signin/oauth",
    element: <SSOCallback />,
  },
];

export default routes;
