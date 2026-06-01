import { useRef } from "react";
import { SpeedDial } from "primereact/speeddial";
import { Toast } from "primereact/toast";
import type { MenuItem } from "primereact/menuitem";

export default function ContextualButton() {
  const toast = useRef<Toast>(null);
  const items: MenuItem[] = [
    {
      label: "Add file",
      icon: "pi pi-file",
      command: () => {
        toast.current?.show({
          severity: "info",
          summary: "Add",
          detail: "Data Added",
        });
      },
    },
    {
      label: "Photos & Videos",
      icon: "pi pi-images",
      command: () => {
        toast.current?.show({
          severity: "success",
          summary: "Update",
          detail: "Data Updated",
        });
      },
    },
    {
      label: "Camera",
      icon: "pi pi-camera",
      command: () => {
        toast.current?.show({
          severity: "error",
          summary: "Delete",
          detail: "Data Deleted",
        });
      },
    },
    {
      label: "Sticker",
      icon: "pi pi-face-smile",
      command: () => {
        console.log("upload");
      },
    },
  ];

  return (
    <div className="relative w-10 h-10 mt-1">
      <Toast ref={toast} />
      <SpeedDial
        model={items}
        direction="up"
        style={{ top: 0, left: 0, width: "100%", height: "100%" }}
        buttonClassName="p-button-rounded w-2xl "
        showIcon="pi pi-plus"
        hideIcon="pi pi-times"
        buttonStyle={{ width: "45px", height: "45px", minHeight: "45px" }}
      />
    </div>
  );
}