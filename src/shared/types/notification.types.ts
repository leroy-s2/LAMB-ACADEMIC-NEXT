export type NotificationType = 'payment' | 'grades' | 'document' | 'system' | 'message';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon?: React.ReactNode;
  action?: {
    label: string;
    href: string;
  };
}

export interface NotificationCategory {
  type: NotificationType;
  label: string;
  color: string;
  bgColor: string;
}
