import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useMutation } from "@tanstack/react-query";
import { useGoogleSSO } from "../../../hooks/useGoogleSSO";
import AuthorizationService from "../../../services/auth";
import type { APIResponse, APIError } from "../../../@types/api";
import type { ResetPasswordCredentials } from "../../../@types/auth";

const ForgotPassPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [credentials, setCredentials] = useState<ResetPasswordCredentials>({
    email: "",
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
      "Authentication Failed",
      err.error_msg || err.detail || "An error occurred. Please try again.",
    ),
  );

  const forgotMutation = useMutation({
    mutationFn: async (creds: ResetPasswordCredentials) => {
      const session: APIResponse = await AuthorizationService.forgotPassword(
        creds.email,
      );
      return session;
    },
    onSuccess: () => {
      setCredentials({ email: "" });
      navigate("/verify-email", { state: { email: credentials.email } });
    },
    onError: (error: APIError) => {
      showError(
        "Request Failed",
        error.error_msg || error.detail || "Could not send reset email.",
      );
    },
  });

  const validateCredentials = () => {
    if (!credentials.email) {
      showError("Missing information", "Please enter your email to continue.");
      return false;
    }

    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!validateCredentials()) return;
    forgotMutation.mutate(credentials);
  };

  const isPending = forgotMutation.isPending || googleSSO.isPending;

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
            <h1 className="text-3xl font-bold mt-4">Forget password?</h1>
            <p>
              Lost your key? Reset your password and regain access to your
              account.
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
                disabled={isPending}
                type="email"
                placeholder="Email"
                className="p-3"
              />
            </div>

            <Button
              label="Reset Password"
              className="w-full py-3 mt-2 bg-blue-600 border-none border-round-xl font-medium text-white shadow-1 hover:bg-blue-700"
              loading={isPending}
            />

            <div className="text-center mt-4">
              <Link
                to="/"
                className="text-blue-600 no-underline font-small text-sm hover:underline"
              >
                Back to login page
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassPage;
