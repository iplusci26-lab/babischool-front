"use client";

import {
  useEffect,
  useRef
} from "react";

import {
  useMessagingStore
}
from "@/lib/store/messagingStore";

import { WS_ENDPOINTS } from "@/lib/wsEndpoints";

export function
useMessagingSocket() {

  const increment =
  useMessagingStore(
    state => state.increment
  );

  const socketRef =
  useRef<WebSocket | null>(
    null
  );

  useEffect(()=>{

    const token =
    localStorage.getItem(
      "token"
    );

    if(!token) return;

    const wsBase =
    process.env
    .NEXT_PUBLIC_API_URL
    ?.replace(
      "http",
      "ws"
    );

    socketRef.current =
    new WebSocket(

       `${wsBase}${WS_ENDPOINTS.messages}?token=${token}`

    );

    socketRef.current.onmessage =
    () => {

      increment();

    };

    return ()=>{

      socketRef.current?.close();

    };

  },[]);
}