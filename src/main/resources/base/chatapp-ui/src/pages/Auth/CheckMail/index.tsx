import { Link, useLocation } from "react-router-dom";
import { Image } from "primereact/image";

const CheckEmailPage: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email;

  return (
    <>
      <div className="h-[calc(100dvh-40px)] flex">
        <div
          className="flex flex-col items-center m-auto gap-5"
          style={{ maxWidth: "370px" }}
        >
          <Image src="/favicon.svg" alt="Private Area" width="60px" />
          <div className="flex flex-col gap-4 text-center">
            <h1 className="text-3xl font-bold mt-4">Check your email</h1>
            <p>
              We sent a password reset link to {email}.
            </p>
          </div>
            <div className="text-center mt-4">
              <Link
                to="/"
                className="text-blue-600 no-underline font-small text-sm hover:underline"
              >
                Back to login page
              </Link>
            </div>
        </div>
      </div>
    </>
  );
};

export default CheckEmailPage;