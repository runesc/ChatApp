export interface DialogProps {
  visible: boolean;
  title: string;
  width?: string;
  content?: string;
  children?: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}