import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { useMutation } from "@tanstack/react-query";
import AuthorizationService from "../../../services/auth";
import type { APIResponse, APIError } from "../../../@types/api";
import type { PasswordResetCredentials } from "../../../@types/auth";

const credentialsInitialState: PasswordResetCredentials = {
  password: "",
  confirmPassword: "",
};

const PasswordResetPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const toast = useRef<Toast>(null);
  const [credentials, setCredentials] = useState<PasswordResetCredentials>({
    ...credentialsInitialState,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (credentials: PasswordResetCredentials) => {
      const response: APIResponse = await AuthorizationService.resetPassword(
        credentials.password,
        token! as string,
      );
      return response;
    },
    onSuccess: (data: APIResponse) => {
      if (data.status_code !== 200) {
        showError(
          "Password Reset Failed",
          data.error_msg ||
            "An error occurred during password reset. Please try again.",
        );
        return;
      }
      navigate("/");
    },
    onError: (error: APIError) => {
      showError(
        "Password Reset Failed",
        error.error_msg ||
          error.detail ||
          "An error occurred during password reset. Please try again.",
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

  const validateCredentials = () => {
    if (!credentials.password || !credentials.confirmPassword) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!token) {
      showError(
        "Invalid action",
        "The password reset link is invalid or has expired.",
      );
      return;
    }
    if (!validateCredentials()) return;
    resetPasswordMutation.mutate(credentials);
  };

  useEffect(() => {
    if (!token) {
      showError("Invalid link", "No reset token found.");
      navigate("/");
    }
  }, [token, navigate]);

  const isPending = resetPasswordMutation.isPending;
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
            <h1 className="text-3xl font-bold mt-4">Reset Password</h1>
            <p>Lost your key? Reset your password and regain control.</p>
          </div>

          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
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
              label="Reset Password"
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

export default PasswordResetPage;