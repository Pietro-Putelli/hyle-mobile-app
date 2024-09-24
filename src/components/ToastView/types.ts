export interface ToastViewProps {
  isVisible: boolean;
  title: string;
  isSucceded?: boolean;
  setInfo: (info: any) => void;
}
