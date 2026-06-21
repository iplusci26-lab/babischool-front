"use client";

import {
  useState
} from "react";

import {
  Send,
  Paperclip,
  X
} from "lucide-react";

import { api } from "@/lib/api";

interface Props {

  conversationId: string;

  onSent?: (message: any) => void;
}

export default function MessageComposer({

  conversationId,

  onSent

}: Props) {

  const [message, setMessage] =
    useState("");

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const send = async () => {

    if (
      !message.trim() &&
      !file
    ) {
      return;
    }

    try {

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "conversation_id",
        conversationId
      );

      formData.append(
        "body",
        message
      );

      if (file) {

        formData.append(
          "attachment",
          file
        );
      }

      const res = await api.post(

        "/messaging/send/",

        formData,

        {

          headers: {

            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      setMessage("");

      setFile(null);

      onSent?.(res.data);

    } catch (error: any) {

      alert(JSON.stringify(error.response?.data, null, 2));

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="bg-white border-t p-4">

      {/* FICHIER SELECTIONNÉ */}

      {file && (

        <div className="mb-3 flex items-center justify-between rounded-2xl border bg-gray-50 px-4 py-3">

          <div className="flex items-center gap-2">

            <Paperclip
              size={16}
            />

            <span className="text-sm">

              {file.name}

            </span>

          </div>

          <button
            onClick={() =>
              setFile(null)
            }
          >

            <X
              size={16}
            />

          </button>

        </div>
      )}

      <div className="flex items-end gap-3">

        {/* PIECE JOINTE */}

        <label className="cursor-pointer h-12 w-12 rounded-2xl border flex items-center justify-center hover:bg-gray-50">

          <Paperclip
            size={18}
          />

          <input
            type="file"
            hidden
            onChange={(e) =>
              setFile(
                e.target.files?.[0] ||
                null
              )
            }
          />

        </label>

        {/* MESSAGE */}

        <textarea

          rows={1}

          value={message}

          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }

          onKeyDown={(e) => {

            if (
              e.key === "Enter" &&
              !e.shiftKey
            ) {

              e.preventDefault();

              send();
            }
          }}

          placeholder="Écrire un message..."

          className="flex-1 resize-none rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"

        />

        {/* ENVOI */}

        <button

          disabled={loading}

          onClick={send}

          className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center disabled:opacity-50"

        >

          {loading ? (

            <span className="text-xs">

              ...

            </span>

          ) : (

            <Send
              size={18}
            />

          )}

        </button>

      </div>

    </div>
  );
}