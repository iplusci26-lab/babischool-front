"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Loader2,
  Search,
  UserX,
} from "lucide-react";

import { api } from "@/lib/api";

/* ============================================================
 * TYPES
 * ============================================================ */

interface StaffAbsence {
  id: string | number;
  date: string;
  weekday: string;
  staff_name: string;
  status: string;
  check_in: string | null;
  check_out: string | null;
  remarks: string | null;
}

interface StaffAbsenceHistory {
  staff_id: string;
  staff_name: string;
  absence_count: number;
  absences: StaffAbsence[];
}

interface StaffAttendanceHistoryResponse {
  count: number;
  results: StaffAbsenceHistory[];
}

type PeriodFilter =
  | "day"
  | "week"
  | "month"
  | "all";

/* ============================================================
 * COMPONENT
 * ============================================================ */

export default function StaffAttendanceHistory() {

  const [history, setHistory] = useState<
    StaffAbsenceHistory[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [period, setPeriod] =
    useState<PeriodFilter>("month");

  const [selectedDate, setSelectedDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [selectedMonth, setSelectedMonth] =
    useState(
      new Date()
        .toISOString()
        .slice(0, 7)
    );

  const [search, setSearch] =
    useState("");

  const [openStaff, setOpenStaff] =
    useState<string | null>(null);


  /* ==========================================================
   * CHARGEMENT HISTORIQUE
   * ========================================================== */

  const loadHistory = useCallback(
    async () => {

      setLoading(true);
      setError(null);

      try {

        const params: Record<
          string,
          string
        > = {};

        /* ==========================
         * JOUR
         * ========================== */

        if (period === "day") {

          params.period = "day";

          params.date =
            selectedDate;
        }


        /* ==========================
         * SEMAINE
         * ========================== */

        else if (period === "week") {

          params.period = "week";

          params.date =
            selectedDate;
        }


        /* ==========================
         * MOIS
         * ========================== */

        else if (period === "month") {

          params.period = "month";

          const [
            year,
            month,
          ] =
            selectedMonth.split("-");

          params.year = year;
          params.month = month;
        }


        /* ==========================
         * TOUT
         * ========================== */

        else if (period === "all") {

          /*
           * Le backend retourne
           * tout l'historique.
           *
           * On envoie explicitement
           * period=all pour rendre
           * le comportement clair.
           */

          params.period = "all";
        }


        const response =
          await api.get<
            StaffAttendanceHistoryResponse
          >(
            "/attendance/staff-attendance/history/",
            {
              params,
            }
          );


        const results =
          Array.isArray(
            response.data?.results
          )
            ? response.data.results
            : [];


        setHistory(results);

        /*
         * Lorsqu'on change de filtre,
         * on referme l'accordéon.
         */

        setOpenStaff(null);

      } catch (err: any) {

        console.error(
          "Erreur historique personnel :",
          err
        );

        setError(
          err?.response?.data?.detail ??
          err?.response?.data?.message ??
          err?.message ??
          "Impossible de charger l'historique des absences."
        );

      } finally {

        setLoading(false);
      }

    },
    [
      period,
      selectedDate,
      selectedMonth,
    ]
  );


  /* ==========================================================
   * CHARGEMENT INITIAL + FILTRES
   * ========================================================== */

  useEffect(() => {

    loadHistory();

  }, [loadHistory]);


  /* ==========================================================
   * RECHERCHE
   * ========================================================== */

  const filteredHistory =
    history.filter(
      (staff) =>
        staff.staff_name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );


  /* ==========================================================
   * ACCORDÉON
   * ========================================================== */

  const toggleStaff = (
    staffId: string
  ) => {

    setOpenStaff(
      (current) =>
        current === staffId
          ? null
          : staffId
    );
  };


  /* ==========================================================
   * FORMAT DATE
   * ========================================================== */

  const formatDate = (
    date: string
  ) => {

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "fr-FR",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };


  /* ==========================================================
   * FORMAT HEURE
   * ========================================================== */

  const formatTime = (
    time: string | null
  ) => {

    if (!time) {
      return "—";
    }

    return time.slice(0, 5);
  };


  /* ==========================================================
   * STATUT
   * ========================================================== */

  const getStatusLabel = (
    status: string
  ) => {

    switch (status) {

      case "absent":
        return "Absente";

      case "late":
        return "Retard";

      case "excused":
        return "Justifiée";

      case "present":
        return "Présente";

      default:
        return status;
    }
  };


  /* ==========================================================
   * LOADING
   * ========================================================== */

  if (loading) {

    return (
      <div className="flex items-center justify-center rounded-xl border bg-white py-16">

        <div className="flex items-center gap-3 text-gray-500">

          <Loader2
            size={20}
            className="animate-spin"
          />

          Chargement de l'historique...

        </div>

      </div>
    );
  }


  /* ==========================================================
   * ERREUR
   * ========================================================== */

  if (error) {

    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">

        {error}

        <button
          type="button"
          onClick={loadHistory}
          className="ml-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
          Réessayer
        </button>

      </div>
    );
  }


  /* ==========================================================
   * RENDER
   * ========================================================== */

  return (
    <div className="space-y-5">


      {/* ======================================================
       * FILTRES
       * ====================================================== */}

      <div className="rounded-xl border bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">


          {/* ==========================
           * PÉRIODE
           * ========================== */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Période
            </label>

            <div className="flex rounded-lg bg-gray-100 p-1">

              {(
                [
                  ["day", "Jour"],
                  ["week", "Semaine"],
                  ["month", "Mois"],
                  ["all", "Tout"],
                ] as [
                  PeriodFilter,
                  string
                ][]
              ).map(
                ([
                  value,
                  label,
                ]) => (

                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setPeriod(value)
                    }
                    className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                      period === value
                        ? "bg-white text-[#6214BE] shadow-sm"
                        : "text-gray-600 hover:text-[#6214BE]"
                    }`}
                  >
                    {label}
                  </button>

                )
              )}

            </div>

          </div>


          {/* ==========================
           * DATE
           * ========================== */}

          {(
            period === "day" ||
            period === "week"
          ) && (

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Date
              </label>

              <div className="relative">

                <Calendar
                  size={17}
                  className="absolute left-3 top-3 text-gray-400"
                />

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) =>
                    setSelectedDate(
                      e.target.value
                    )
                  }
                  className="rounded-lg border py-2 pl-10 pr-3 outline-none focus:border-[#6214BE] focus:ring-1 focus:ring-[#6214BE]"
                />

              </div>

            </div>

          )}


          {/* ==========================
           * MOIS
           * ========================== */}

          {period === "month" && (

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Mois
              </label>

              <div className="relative">

                <Calendar
                  size={17}
                  className="absolute left-3 top-3 text-gray-400"
                />

                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) =>
                    setSelectedMonth(
                      e.target.value
                    )
                  }
                  className="rounded-lg border py-2 pl-10 pr-3 outline-none focus:border-[#6214BE] focus:ring-1 focus:ring-[#6214BE]"
                />

              </div>

            </div>

          )}


          {/* ==========================
           * RECHERCHE
           * ========================== */}

          <div className="relative w-full lg:w-72">

            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Rechercher un membre du personnel..."
              className="w-full rounded-lg border py-2 pl-10 pr-4 outline-none focus:border-[#6214BE] focus:ring-1 focus:ring-[#6214BE]"
            />

          </div>

        </div>

      </div>


      {/* ======================================================
       * RÉSUMÉ
       * ====================================================== */}

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-lg font-semibold text-gray-900">
            Historique des absences
          </h2>

          <p className="text-sm text-gray-500">

            {filteredHistory.length} membre
            {filteredHistory.length > 1
              ? "s"
              : ""}{" "}
            du personnel concerné
            {filteredHistory.length > 1
              ? "s"
              : ""}

          </p>

        </div>


        <div className="flex items-center gap-2 text-sm text-gray-500">

          <UserX size={18} />

          Absences

        </div>

      </div>


      {/* ======================================================
       * AUCUNE DONNÉE
       * ====================================================== */}

      {filteredHistory.length === 0 ? (

        <div className="rounded-xl border bg-white p-10 text-center">

          <UserX
            size={35}
            className="mx-auto mb-3 text-gray-300"
          />

          <p className="font-medium text-gray-700">
            Aucune absence
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Aucun membre du personnel n'est
            absent pour la période sélectionnée.
          </p>

        </div>

      ) : (

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">


          {/* ==================================================
           * HEADER
           * ================================================== */}

          <div className="grid grid-cols-[1fr_180px_60px] border-b bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700">

            <div>
              Personnel
            </div>

            <div>
              Nombre d'absences
            </div>

            <div />

          </div>


          {/* ==================================================
           * PERSONNEL
           * ================================================== */}

          {filteredHistory.map(
            (staff, index) => {

              const isOpen =
                openStaff ===
                staff.staff_id;

              /*
               * Le backend trie déjà par
               * nombre d'absences décroissant.
               *
               * On garde donc les 5 premiers.
               */

              const isTopFive =
                index < 5;

              return (

                <div
                  key={staff.staff_id}
                  className="border-b last:border-b-0"
                >


                  {/* ==========================================
                   * LIGNE PRINCIPALE
                   * ========================================== */}

                  <button
                    type="button"
                    onClick={() =>
                      toggleStaff(
                        staff.staff_id
                      )
                    }
                    className={`grid w-full grid-cols-[1fr_180px_60px] items-center px-5 py-4 text-left transition ${
                      isTopFive
                        ? "bg-red-50 hover:bg-red-100"
                        : "hover:bg-gray-50"
                    }`}
                  >


                    {/* ======================
                     * NOM
                     * ====================== */}

                    <div className="flex items-center gap-3">

                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                          isTopFive
                            ? "bg-red-100 text-red-700"
                            : "bg-violet-100 text-violet-700"
                        }`}
                      >
                        {staff.staff_name
                          .split(" ")
                          .slice(0, 2)
                          .map(
                            (name) =>
                              name[0]
                          )
                          .join("")}
                      </div>


                      <div>

                        <p
                          className={`font-semibold ${
                            isTopFive
                              ? "text-red-800"
                              : "text-gray-900"
                          }`}
                        >
                          {staff.staff_name}
                        </p>


                        {isTopFive && (

                          <p className="text-xs font-medium text-red-600">
                            Top 5 des absences
                          </p>

                        )}

                      </div>

                    </div>


                    {/* ======================
                     * NOMBRE ABSENCES
                     * ====================== */}

                    <div>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                          isTopFive
                            ? "bg-red-200 text-red-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >

                        {staff.absence_count}{" "}
                        absence
                        {staff.absence_count >
                        1
                          ? "s"
                          : ""}

                      </span>

                    </div>


                    {/* ======================
                     * CHEVRON
                     * ====================== */}

                    <div className="flex justify-center">

                      {isOpen ? (

                        <ChevronUp
                          size={20}
                          className={
                            isTopFive
                              ? "text-red-600"
                              : "text-gray-500"
                          }
                        />

                      ) : (

                        <ChevronDown
                          size={20}
                          className={
                            isTopFive
                              ? "text-red-600"
                              : "text-gray-500"
                          }
                        />

                      )}

                    </div>

                  </button>


                  {/* ==========================================
                   * ACCORDÉON
                   * ========================================== */}

                  {isOpen && (

                    <div className="border-t bg-gray-50/70 px-5 py-4">

                      <div className="space-y-3">

                        {staff.absences.map(
                          (absence) => (

                            <div
                              key={
                                absence.id
                              }
                              className="rounded-xl border bg-white p-4 shadow-sm"
                            >


                              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


                                {/* =========================
                                 * DATE
                                 * ========================= */}

                                <div>

                                  <div className="flex items-center gap-2">

                                    <Calendar
                                      size={17}
                                      className="text-[#6214BE]"
                                    />

                                    <p className="font-semibold text-gray-900">
                                      {formatDate(
                                        absence.date
                                      )}
                                    </p>

                                  </div>

                                  <p className="mt-1 text-sm text-gray-500">
                                    {absence.weekday}
                                  </p>

                                </div>


                                {/* =========================
                                 * STATUT
                                 * ========================= */}

                                <div>

                                  <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                    {getStatusLabel(
                                      absence.status
                                    )}
                                  </span>

                                </div>


                                {/* =========================
                                 * HORAIRES
                                 * ========================= */}

                                {/**<div className="lg:min-w-[220px]">

                                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">

                                    <Clock
                                      size={16}
                                    />

                                    <span>
                                      Entrée :{" "}
                                      {formatTime(
                                        absence.check_in
                                      )}
                                    </span>

                                  </div>

                                  <div className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-700">

                                    <Clock
                                      size={16}
                                    />

                                    <span>
                                      Sortie :{" "}
                                      {formatTime(
                                        absence.check_out
                                      )}
                                    </span>

                                  </div>

                                </div>*/}

                              </div>


                              {/* =========================
                               * REMARQUE
                               * ========================= */}

                              {absence.remarks && (

                                <div className="mt-4 border-t pt-3">

                                  <p className="text-xs font-medium text-gray-500">
                                    Remarque
                                  </p>

                                  <p className="mt-1 text-sm text-gray-700">
                                    {absence.remarks}
                                  </p>

                                </div>

                              )}

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  )}

                </div>

              );

            }
          )}

        </div>

      )}

    </div>
  );
}