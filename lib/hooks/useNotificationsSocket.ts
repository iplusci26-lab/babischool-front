"use client";

import {
  useEffect,
  useRef
} from "react";

import {
  useNotificationStore
} from "@/lib/store/notificationStore";

import { WS_ENDPOINTS } from "@/lib/wsEndpoints";

interface Props {
  onNotification?: (
    notification: any
  ) => void;
}

export function useNotificationsSocket({
  onNotification,
}: Props) {

  const socketRef =
    useRef<WebSocket | null>(
      null
    );

  const lastSoundRef =
    useRef(0);

  const addNotification =
    useNotificationStore(
      (state) =>
        state.addNotification
    );

  const wsBase = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (
      !token ||
      !wsBase
    ) {
      return;
    }

    const sound =
      new Audio(
        "/sounds/notification.mp3"
      );

    let reconnectTimer:
      NodeJS.Timeout;

    const connect = () => {

      socketRef.current =
        new WebSocket(
          `${wsBase}${WS_ENDPOINTS.notifications}?token=${token}`
        );

      socketRef.current.onmessage =
        (
          event
        ) => {

          const data =
            JSON.parse(
              event.data
            );

          const now =
            Date.now();

          if (
            now -
              lastSoundRef.current >
            1000
          ) {

            sound
              .play()
              .catch(
                () => {}
              );

            lastSoundRef.current =
              now;
          }

          addNotification(
            data
          );

          onNotification?.(
            data
          );
        };

      socketRef.current.onclose =
        () => {

          reconnectTimer =
            setTimeout(
              connect,
              5000
            );
        };
    };

    connect();

    return () => {

      clearTimeout(
        reconnectTimer
      );

      socketRef.current?.close();
    };

  }, []);
}