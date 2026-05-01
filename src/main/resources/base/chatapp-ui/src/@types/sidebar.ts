export interface SidebarLinks {
  label: string;
  icon: React.ReactNode;
  to?: string;
  actions?: () => void;
}