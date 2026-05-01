import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <div className="flex p-5">
      <div className="flex-6 hidden md:block">
        <div className="relative text-static-white overflow-hidden max-lg:hidden">
          <div className="h-[calc(100dvh-40px)] overflow-hidden rounded-3xl">
            <img
              className="inline-block w-full h-full object-cover align-top select-none transition-opacity opacity-100"
              src="/assets/images/banner.webp"
              alt="Auth Background"
            />
          </div>
          <div className="absolute top-19 left-10 right-10 max-2xl:top-8 max-2xl:left-8 max-2xl:right-8">
            <div className="mb-4 text-white text-[40px] 2xl:text-[67px] 2xl:font-semibold">
              Generate anything you can imagine with AI
            </div>
            <div className="text-white font-light">
              Turn your ideas into reality—fast.
            </div>
          </div>
        </div>
      </div>
      <div className="flex-6">
        <div className="2xl:pl-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;