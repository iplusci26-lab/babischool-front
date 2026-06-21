"use client";

import { useEffect, useMemo, useState } from "react";

import { Search, Plus, MessageSquare } from "lucide-react";

import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

import ConversationCard from "./components/ConversationCard";

import NewConversationModal from "./components/NewConversationModal";

export default function MessagingPage() {

  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [openNewConversation, setOpenNewConversation] =
    useState(false);

  const [conversations, setConversations] =
    useState<any[]>([]);

  const loadConversations = async () => {

    try {

      const res = await api.get(
        "/messaging/conversations/"
      );

      setConversations(
        res.data.results || res.data
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    loadConversations();

  }, []);

  const filteredConversations =
    useMemo(() => {

      return conversations.filter(
        (conversation) => {

          const keyword =
            search.toLowerCase();

          return (

            conversation.student_name
              ?.toLowerCase()
              .includes(keyword)

            ||

            conversation.parent_name
              ?.toLowerCase()
              .includes(keyword)
          );
        }
      );

    }, [search, conversations]);

  const totalUnread =
    conversations.reduce(

      (
        total,
        conversation
      ) => (

        total +
        (conversation.unread_count || 0)

      ),

      0
    );

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            Messagerie

          </h1>

          <p className="text-gray-500 mt-1">

            Communication avec les parents

          </p>

        </div>

        <button
          onClick={() =>
            setOpenNewConversation(true)
          }
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2"
        >

          <Plus size={18} />

          Nouveau message

        </button>

      </div>

      {/* KPI */}

      <div className="grid md:grid-cols-3 gap-5">

        <div className="bg-white border rounded-3xl p-5">

          <p className="text-gray-500 text-sm">

            Conversations

          </p>

          <h2 className="text-3xl font-bold mt-2">

            {conversations.length}

          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-5">

          <p className="text-gray-500 text-sm">

            Messages non lus

          </p>

          <h2 className="text-3xl font-bold mt-2 text-red-600">

            {totalUnread}

          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-5">

          <p className="text-gray-500 text-sm">

            Conversations actives

          </p>

          <h2 className="text-3xl font-bold mt-2 text-green-600">

            {conversations.length}

          </h2>

        </div>

      </div>

      {/* SEARCH */}

      <div className="bg-white border rounded-3xl p-4">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Rechercher un élève ou un parent..."
            className="w-full pl-11 pr-4 py-3 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
          />

        </div>

      </div>

      {/* LIST */}

      {loading ? (

        <div className="bg-white border rounded-3xl p-10 text-center">

          Chargement...

        </div>

      ) : filteredConversations.length === 0 ? (

        <div className="bg-white border rounded-3xl p-12 text-center">

          <MessageSquare
            size={50}
            className="mx-auto text-gray-300"
          />

          <h3 className="font-semibold text-lg mt-4">

            Aucune conversation

          </h3>

          <p className="text-gray-500 mt-2">

            Démarrez une conversation avec un parent.

          </p>

          <button
            onClick={() =>
              setOpenNewConversation(true)
            }
            className="mt-5 bg-indigo-600 text-white px-5 py-3 rounded-2xl"
          >

            Nouveau message

          </button>

        </div>

      ) : (

        <div className="grid gap-4">

          {filteredConversations.map(
            (conversation) => (

              <ConversationCard

                key={
                  conversation.id
                }

                conversation={
                  conversation
                }

                onClick={() =>
                  router.push(
                    `/messaging/${conversation.id}`
                  )
                }

              />
            )
          )}

        </div>

      )}

      {/* MODAL */}

      {openNewConversation && (

        <NewConversationModal

          onClose={() =>
            setOpenNewConversation(false)
          }

          onSuccess={() => {

            setOpenNewConversation(false);

            loadConversations();
          }}

        />

      )}

    </div>
  );
}