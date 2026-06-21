"use client";

import {

  useEffect,

  useMemo,

  useState

} from "react";

import {

  Search,

  User,

  X

} from "lucide-react";

import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

export default function NewConversationModal({

  onClose,

  onSuccess

}: any) {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [students, setStudents] =
    useState<any[]>([]);

  const loadStudents = async () => {

    try {

      const res = await api.get(
        "/students/"
      );
      console.log(res.data.data);
      setStudents(
        res.data.data || res.data
      );

    } catch (error) {

      console.error(error);
    }
  };

  useEffect(() => {

    loadStudents();

  }, []);

  const filteredStudents =
    useMemo(() => {

      const keyword =
        search.toLowerCase();

      return students.filter(
        (student) => {

          const fullname = (

            `${student.first_name} ${student.last_name}`

          ).toLowerCase();

          return fullname.includes(
            keyword
          );
        }
      );

    }, [students, search]);

  const startConversation =
    async (
      studentId: string
    ) => {

      try {

        setLoading(true);

        const res =
          await api.post(

            "/messaging/start/",

            {
              student_id:
                studentId
            }
          );
          console.log(studentId)
        onSuccess?.();

        router.push(

          `/messaging/${res.data.conversation_id}`

        );

      } catch (error) {

        console.error(error);

        alert(
          "Erreur lors de la création de la conversation"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between p-6 border-b">

          <div>

            <h2 className="text-2xl font-bold">

              Nouveau message

            </h2>

            <p className="text-sm text-gray-500 mt-1">

              Sélectionnez un élève

            </p>

          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >

            <X size={20} />

          </button>

        </div>

        {/* SEARCH */}

        <div className="p-5 border-b">

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
              placeholder="Rechercher un élève..."
              className="w-full border rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>

        </div>

        {/* STUDENTS */}

        <div className="max-h-[500px] overflow-y-auto">

          {filteredStudents.map(
            (student) => (

              <button

                key={student.id}

                disabled={loading}

                onClick={() =>
                  startConversation(
                    student.id
                  )
                }

                className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 border-b text-left"
              >

                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">

                  <User
                    size={20}
                    className="text-indigo-600"
                  />

                </div>

                <div>

                  <h3 className="font-semibold">

                    {student.first_name}
                    {" "}
                    {student.last_name}

                  </h3>

                  {student.student_number && (

                    <p className="text-sm text-gray-500">

                      {student.student_number}

                    </p>

                  )}

                </div>

              </button>
            )
          )}

          {filteredStudents.length === 0 && (

            <div className="p-10 text-center text-gray-500">

              Aucun élève trouvé

            </div>

          )}

        </div>

      </div>

    </div>
  );
}