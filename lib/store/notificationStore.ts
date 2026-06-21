import { create } from "zustand";


export interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  object_id?: string;
  group_key?: string;
  is_read: boolean;
  created_at: string;
  url?: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;

  setNotifications: (
    notifications: Notification[]
  ) => void;

  appendNotifications: (
    notifications: Notification[]
  ) => void;

  addNotification: (
    notification: Notification
  ) => void;

  markAsRead: (
    id: string
  ) => void;

  markAllRead: () => void;

  deleteNotification: (
    id: string
  ) => void;

  clearReadNotifications: () => void;

  setUnreadCount: (
    count: number
  ) => void;
}

export const useNotificationStore =
create<NotificationStore>((set) => ({

  notifications: [],

  unreadCount: 0,

  setUnreadCount: (count) =>
    set({
      unreadCount: count,
    }),

  setNotifications: (
    notifications
  ) =>
    set({
      notifications,
      unreadCount:
        notifications.filter(
          (n) => !n.is_read
        ).length,
    }),

  appendNotifications: (
    items
  ) =>
    set((state) => {

      const existingIds =
        new Set(
          state.notifications.map(
            (n) => n.id
          )
        );

      const newItems =
        items.filter(
          (item) =>
            !existingIds.has(
              item.id
            )
        );

      return {
        notifications: [
          ...state.notifications,
          ...newItems,
        ],
      };
    }),

  addNotification: (
    notification
  ) =>
    set((state) => {

      const exists =
        state.notifications.some(
          (n) =>
            n.id === notification.id
        );

      if (exists) {
        return state;
      }

      return {
        notifications: [
          notification,
          ...state.notifications,
        ],
        unreadCount:
          state.unreadCount + 1,
      };
    }),

  markAsRead: (id) =>
    set((state) => ({

      notifications:
        state.notifications.map(
          (n) =>
            n.id === id
              ? {
                  ...n,
                  is_read: true,
                }
              : n
        ),

      unreadCount:
        Math.max(
          0,
          state.unreadCount - 1
        ),
    })),

  markAllRead: () =>
    set((state) => ({
      notifications:
        state.notifications.map(
          (n) => ({
            ...n,
            is_read: true,
          })
        ),
      unreadCount: 0,
    })),

  deleteNotification: (
    id
  ) =>
    set((state) => {

      const notif =
        state.notifications.find(
          (n) => n.id === id
        );

      return {

        notifications:
          state.notifications.filter(
            (n) => n.id !== id
          ),

        unreadCount:
          notif &&
          !notif.is_read
            ? Math.max(
                0,
                state.unreadCount - 1
              )
            : state.unreadCount,
      };
    }),

  clearReadNotifications:
    () =>
      set((state) => ({
        notifications:
          state.notifications.filter(
            (n) => !n.is_read
          ),
      })),
}));