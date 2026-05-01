import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import secureLocalStorage from "../../../utils/secureStorage";
import AuthorizationService from "../../../services/auth";
import type { APIResponse, APIError } from "../../../@types/api";
import type { JWToken, OAuthTokenPayload } from "../../../@types/session";
import type { SignUpCredentials } from "../../../@types/auth";
import { useGoogleSSO } from "../../../hooks/useGoogleSSO";
const credentialsInitialState: SignUpCredentials = {
  name: "",
  last_name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [credentials, setCredentials] = useState<SignUpCredentials>({
    ...credentialsInitialState,
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
      "Sign Up Failed",
      err.error_msg ||
        err.detail ||
        "An error occurred during sign up. Please try again.",
    ),
  );

  const ClassicSignUpMutation = useMutation({
    mutationFn: async (credentials: SignUpCredentials) => {
      const response: APIResponse<OAuthTokenPayload> =
        await AuthorizationService.classicSignUp(credentials);
      return response;
    },
    onSuccess: (data: APIResponse<OAuthTokenPayload>) => {
      const { oauthToken } = data.data;

      const decodedToken = jwtDecode<JWToken>(oauthToken);
      if (decodedToken.access_token) {
        secureLocalStorage.setItem("session", {
          access_token: decodedToken.access_token,
          expires_in: decodedToken.expires_in,
          refresh_token: decodedToken.refresh_token,
        });

        navigate("/workspaces");
      }
    },
    onError: (error: APIError) => {
      showError(
        "Sign Up Failed",
        error.error_msg ||
          error.detail ||
          "An error occurred during sign up. Please try again.",
      );
    },
  });

  const validateCredentials = () => {
    if (
      !credentials.email ||
      !credentials.password ||
      !credentials.confirmPassword ||
      !credentials.name ||
      !credentials.last_name
    ) {
      showError(
        "Missing information",
        "Please fill in all the required fields.",
      );
      return false;
    }

    if (credentials.password !== credentials.confirmPassword) {
      showError(
        "Password mismatch",
        "The password and confirm password fields do not match.",
      );
      return false;
    }

    if (credentials.password.length < 8) {
      showError(
        "Weak password",
        "Password should be at least 8 characters long.",
      );
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!validateCredentials()) return;
    ClassicSignUpMutation.mutate(credentials);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const isPending = ClassicSignUpMutation.isPending || googleSSO.isPending;

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
            <h1 className="text-3xl font-bold mt-4">Create your account</h1>
            <p>
              Already have an account?{" "}
              <Link to="/" className="text-purple-600">
                Login
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
            <div className="flex flex-row gap-4">
              <InputText
                type="text"
                name="name"
                disabled={isPending}
                placeholder="Name"
                className="p-3 flex-auto w-full"
                onChange={handleChange}
                value={credentials.name}
              />
              <InputText
                name="last_name"
                type="text"
                placeholder="Last Name"
                className="p-3 flex-auto w-full"
                onChange={handleChange}
                disabled={isPending}
                value={credentials.last_name}
              />
            </div>
            <div className="flex flex-col">
              <InputText
                name="email"
                type="email"
                placeholder="Email"
                className="p-3"
                onChange={handleChange}
                disabled={isPending}
                value={credentials.email}
              />
            </div>

            <div className="flex flex-col">
              <Password
                name="password"
                placeholder="Password"
                toggleMask
                feedback={false}
                inputClassName="p-3 w-full"
                className="w-full"
                onChange={handleChange}
                value={credentials.password}
                disabled={isPending}
                pt={{
                  iconField: {
                    root: {
                      className: "w-100",
                    },
                  },
                }}
              />
            </div>
            <div className="flex flex-col">
              <Password
                name="confirmPassword"
                placeholder="Confirm Password"
                toggleMask
                feedback={false}
                inputClassName="p-3 w-full"
                className="w-full"
                onChange={handleChange}
                value={credentials.confirmPassword}
                disabled={isPending}
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
              label="Sign Up"
              className="w-full py-3 mt-2 bg-blue-600 border-none border-round-xl font-medium text-white shadow-1 hover:bg-blue-700"
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

export default SignUpPage;
