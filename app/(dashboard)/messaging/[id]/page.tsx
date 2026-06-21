"use client";

import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  useParams
} from "next/navigation";

import { api } from "@/lib/api";

import ConversationHeader from "../components/ConversationHeader";
import MessageBubble from "../components/MessageBubble";
import MessageComposer from "../components/MessageComposer";
import { WS_ENDPOINTS } from "@/lib/wsEndpoints";

export default function ConversationPage() {

  const params = useParams();

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const socketRef =
    useRef<WebSocket | null>(null);

  const [conversation, setConversation] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

    const addMessage =
      (
        message: any
      ) => {

        setConversation(
          (prev: any) => {

            if (!prev) {
              return prev;
            }

            return {

              ...prev,

              messages: [

                ...prev.messages,

                message
              ]
            };
          }
        );
      };

  const loadConversation =
    async () => {

      try {

        const res =
          await api.get(
            `/messaging/conversations/${params.id}/`
          );

        setConversation(
          res.data
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    if (!params?.id) {
      return;
    }

    loadConversation();

  }, [params?.id]);

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [conversation]);

  useEffect(() => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (
      !token ||
      !params?.id
    ) {
      return;
    }

    const wsBase =
      process.env.NEXT_PUBLIC_API_URL
        ?.replace(
          "http",
          "ws"
        );

    socketRef.current =
      new WebSocket(
        `${wsBase}${WS_ENDPOINTS.messages}?token=${token}`
      );

    socketRef.current.onmessage =
      (event) => {

        const data =
          JSON.parse(
            event.data
          );

        if (
          data.conversation_id ===
          params.id
        ) {

          setConversation(
            (prev: any) => {
        
              if (!prev) {
                return prev;
              }
        
              return {
        
                ...prev,
        
                messages: [
        
                  ...prev.messages,
        
                  data
                ]
              };
            }
          );
        }
      };

    return () => {

      socketRef.current?.close();
    };

  }, [params?.id]);

  if (loading) {

    return (

      <div className="p-10">

        Chargement...

      </div>
    );
  }

  if (!conversation) {

    return (

      <div className="p-10">

        Conversation introuvable

      </div>
    );
  }

  return (

    <div className="h-[calc(100vh-80px)] flex flex-col">

      <ConversationHeader
        conversation={conversation}
      />

      {conversation.messages.length === 0 && (

        <div className="h-full flex items-center justify-center">

          <div className="text-center text-gray-500">

            Aucun message

            <div className="text-sm mt-1">

              Commencez la conversation

            </div>

          </div>

        </div>

      )}

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">

        {conversation.messages.map(
          (message: any) => (

            <MessageBubble
              key={message.id}
              message={message}
              currentUser={
                conversation.current_user_id
              }
            />

          )
        )}

        <div ref={messagesEndRef} />

      </div>

      <MessageComposer
        conversationId={
          conversation.id
        }
        onSent={addMessage}
      />

    </div>
  );
}