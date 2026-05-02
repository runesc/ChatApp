import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import type { DialogProps } from "../../@types/dialog";

const DialogPopUp: React.FC<DialogProps> = ({
  visible,
  title,
  content,
  children,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      header={title}
      visible={visible}
      className="w-[500px]"
      onHide={() => {
        if (!visible) return;
        onClose();
      }}
    >
      <div className="flex flex-col gap-4">
        {children ? children : <p>{content}</p>}
       <div className="flex justify-end gap-2 mt-4">
         <Button label="Cancel" onClick={onClose} className="p-button-text" />
        <Button label="Confirm" onClick={onConfirm} autoFocus />
       </div>
      </div>
    </Dialog>
  );
};

export default DialogPopUp;