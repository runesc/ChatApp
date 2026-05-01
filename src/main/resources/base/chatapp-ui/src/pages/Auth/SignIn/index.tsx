import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useGoogleSSO } from "../../../hooks/useGoogleSSO.ts";
import secureLocalStorage from "../../../utils/secureStorage";
import AuthorizationService from "../../../services/auth";
import type { APIResponse, APIError } from "../../../@types/api";
import type { JWToken, OAuthTokenPayload } from "../../../@types/session";
import type { AuthCredentials } from "../../../@types/auth";
import { useFetchProfile } from "../../../hooks/useFetchProfile.ts";

const SignInPage: React.FC = () => {
  const navigate = useNavigate();

  const toast = useRef<Toast>(null);
  const [credentials, setCredentials] = useState<AuthCredentials>({
    email: "",
    password: "",
  });
  const { refetch: fetchUserProfile } = useFetchProfile();

  const loginMutation = useMutation({
    mutationFn: async (creds: AuthCredentials) => {
      const session: APIResponse<OAuthTokenPayload> =
        await AuthorizationService.emailSignIn(creds);

      return session;
    },
    onSuccess: async (session) => {
      const decodedToken = jwtDecode<JWToken>(session.data.oauthToken);

      secureLocalStorage.setItem("session", {
        access_token: decodedToken.access_token,
        expires_in: decodedToken.expires_in,
        refresh_token: decodedToken.refresh_token,
      });

      setCredentials({ email: "", password: "" });
      await fetchUserProfile();
      navigate("/app", { replace: true });
    },
    onError: (error: APIError) => {
      showError(
        "Login Failed",
        error.error_msg ||
          error.detail ||
          "An error occurred during login. Please check your credentials and try again.",
      );
    },
  });

  const showError = (summary: string, detail: string, life = 3000) => {
    toast.current?.show({
      severity: "error",
      summary,
      detail,
      life,
    });
  };
  const googleSSO = useGoogleSSO((err: APIError) =>
    showError(
      "Sign In Failed",
      err.error_msg ||
        err.detail ||
        "An error occurred during sign in. Please try again.",
    ),
  );

  const validateCredentials = () => {
    if (!credentials.email || !credentials.password) {
      showError(
        "Missing information",
        "Please enter your email and password to continue.",
      );
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!validateCredentials()) return;
    loginMutation.mutate(credentials);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const isPending = loginMutation.isPending || googleSSO.isPending;

  return (
    <>
      <Toast ref={toast} />
      <div className="h-[calc(100dvh-40px)] flex">
        <div
          className="flex flex-col items-center m-auto gap-5"
          style={{ maxWidth: "370px" }}
        >
          <Image src="/favicon.svg" alt="Private Area" width="60px" />
          <div className="flex flex-col gap-4 text-center">
            <h1 className="text-3xl font-bold mt-4">Welcome back!</h1>
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="text-purple-600">
                Sign up
              </Link>{" "}
              here
            </p>
          </div>
          <div className="w-full mt-3">
            <Button
              label="Continue with Google"
              className="w-full flex-row-reverse"
              loading={isPending}
              onClick={() => googleSSO.mutate()}
            >
              <Image
                src="/assets/images/google-icon.svg"
                alt="Google Icon"
                width="20"
                className="mr-2 inline-block align-middle"
              />
            </Button>
          </div>
          <div className="my-6 flex items-center">
            <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700 w-xs" />
            <span className="px-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
              or
            </span>
            <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700" />
          </div>

          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <InputText
                name="email"
                onChange={handleChange}
                value={credentials.email}
                type="email"
                placeholder="Email"
                className="p-3"
                disabled={isPending}
              />
            </div>

            <div className="flex flex-col">
              <Password
                name="password"
                onChange={handleChange}
                value={credentials.password}
                placeholder="Password"
                disabled={isPending}
                toggleMask
                feedback={false}
                inputClassName="p-3 w-full"
                className="w-full"
                pt={{
                  iconField: {
                    root: {
                      className: "w-100",
                    },
                  },
                }}
              />
            </div>

            <Button
              label="Login"
              className="w-full py-3 mt-2 bg-blue-600 border-none font-medium text-white hover:bg-blue-700"
              loading={isPending}
            />

            <div className="text-center mt-4">
              <Link
                to="/forgot-password"
                title="Forgotten Password?"
                className="text-blue-600 no-underline font-small text-sm hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignInPage;