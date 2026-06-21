"use client";

import {

  ArrowLeft,

  User

} from "lucide-react";

import { useRouter } from "next/navigation";

export default function ConversationHeader({

  conversation

}: any) {

  const router = useRouter();

  return (

    <div className="bg-white border-b p-4 flex items-center gap-4">

      <button
        onClick={() =>
          router.push(
            "/messaging"
          )
        }
      >

        <ArrowLeft size={20} />

      </button>

      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">

        <User
          size={20}
          className="text-indigo-600"
        />

      </div>

      <div>

        <h2 className="font-bold">

          {conversation.student_name}

        </h2>

        <p className="text-sm text-gray-500">

          Parent : {conversation?.parent_name}

        </p>

      </div>

    </div>
  );
}