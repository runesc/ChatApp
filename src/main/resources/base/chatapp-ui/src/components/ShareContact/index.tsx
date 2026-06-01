
import { useState } from "react";
import { useSelector } from "react-redux";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import type { RootState } from "../../store";

const ShareContact = () => {
  const [hasQrCode, setHasQrCode] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="flex gap-4">
      <div className="w-[50vw]">
        <div className="flex flex-col gap-2 h-full justify-center">
          <h3 className="text-lg font-bold">Añadir contacto</h3>
          <p className="text-sm text-gray-500">
            Puedes añadir un contacto escaneando su código QR o ingresando su id
            de usuario
          </p>
          <form
            className="mt-4"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="flex gap-2">
              <InputText
                placeholder="ID de usuario"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="flex-1"
              />
              <Button label="Añadir" disabled={!userId} />
            </div>
          </form>
        </div>
      </div>
      <div className="border-r-1 border-zinc-200" />
      <div className="w-[50vw] ">
        <h3 className="text-lg font-bold">Compartir QR</h3>
        <p className="text-sm text-gray-500">
          Comparte tu código QR para que otros puedan añadirte como contacto
        </p>
        <div className="flex items-center mt-4">
          <div className="relative w-32 h-32 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
            {!hasQrCode ? (
              <>
                <Image
                  src="/assets/images/qr-dummy.png"
                  alt="QR Code"
                  className="w-full h-full object-cover blur-md"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <Avatar
                    image={
                      user?.photo || "/assets/images/avatar-placeholder.png"
                    }
                    shape="circle"
                    size="xlarge"
                    className="border-2 border-white shadow-md"
                  />
                </div>
              </>
            ) : (
              <Image
                src="/assets/images/qr-dummy.png"
                alt="QR Code"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="ml-4 flex flex-col gap-2">
            {!user ? (
              <>
                <Skeleton width="12rem" height="1.75rem" />
                <Skeleton width="18rem" height="1.25rem" />
              </>
            ) : (
              <>
                <p className="m-0 text-xl font-semibold text-gray-900">
                  {user.name} {user.last_name}
                </p>
                <p
                  className={`m-0 text-sm font-medium ${
                    hasQrCode ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {hasQrCode
                    ? "QR code generated"
                    : "Necesitas generar tu QR para obtener tu ID de usuario"}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="p-2">
          {!hasQrCode && (
            <Button label="Generate" onClick={() => setHasQrCode(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareContact;