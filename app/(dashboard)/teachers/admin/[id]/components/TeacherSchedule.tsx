"use client";

import {
  BookOpen,
  Clock3,
  GraduationCap,
  MapPin,
} from "lucide-react";

interface TeacherScheduleProps {
  schedules: any[];
}

const DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

const COLORS = [
  "border-l-purple-500 bg-purple-50",
  "border-l-blue-500 bg-blue-50",
  "border-l-green-500 bg-green-50",
  "border-l-orange-500 bg-orange-50",
  "border-l-pink-500 bg-pink-50",
  "border-l-cyan-500 bg-cyan-50",
];

// ==========================================================
// NORMALISATION DES JOURS
// ==========================================================

const normalizeDay = (value: any): string => {
  if (!value) {
    return "";
  }

  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

// ==========================================================
// JOUR D'UNE SÉANCE
// ==========================================================

const getScheduleDay = (schedule: any): string => {
  // On privilégie le label fourni par Django
  if (schedule.weekday_label) {
    return normalizeDay(
      schedule.weekday_label
    );
  }

  return normalizeDay(
    schedule.weekday
  );
};

// ==========================================================
// MATIÈRE / COURS À AFFICHER
// ==========================================================

const getScheduleTitle = (
  schedule: any
): string => {

  // Primaire :
  // la matière réellement enseignée peut être
  // portée par lesson_subject
  if (
    schedule.lesson_subject_name
  ) {
    return schedule.lesson_subject_name;
  }

  // Secondaire :
  // matière portée par l'affectation
  if (
    schedule.subject_name
  ) {
    return schedule.subject_name;
  }

  // Si aucune matière n'est disponible
  if (
    schedule.assignment_type_label
  ) {
    return schedule.assignment_type_label;
  }

  return "Cours";
};

// ==========================================================
// CLASSE
// ==========================================================

const getClassroomName = (
  schedule: any
): string => {

  return (
    schedule.classroom_name ||
    "Classe non définie"
  );
};

// ==========================================================
// COMPOSANT
// ==========================================================

export default function TeacherSchedule({
  schedules,
}: TeacherScheduleProps) {

  // ========================================================
  // COULEURS PAR COURS
  // ========================================================

  const colorMap =
    new Map<string, string>();

  let colorIndex = 0;

  schedules.forEach(
    (schedule) => {

      const title =
        getScheduleTitle(
          schedule
        );

      if (
        !colorMap.has(title)
      ) {

        colorMap.set(
          title,
          COLORS[
            colorIndex %
              COLORS.length
          ]
        );

        colorIndex++;
      }
    }
  );

  // ========================================================
  // SÉANCES PAR JOUR
  // ========================================================

  const getByDay = (
    day: string
  ) => {

    const normalizedDay =
      normalizeDay(day);

    return schedules
      .filter(
        (schedule) =>
          getScheduleDay(
            schedule
          ) === normalizedDay
      )
      .sort(
        (a, b) =>
          String(
            a.start_time || ""
          ).localeCompare(
            String(
              b.start_time || ""
            )
          )
      );
  };

  return (

    <div className="
      grid
      gap-5
      sm:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-5
    ">

      {DAYS.map(
        (day) => {

          const daySchedules =
            getByDay(day);

          return (

            <div
              key={day}
              className="
                rounded-2xl
                border
                bg-white
                shadow-sm
                overflow-hidden
              "
            >

              {/* ========================================= */}
              {/* JOUR */}
              {/* ========================================= */}

              <div className="
                bg-[#6214BE]
                px-4
                py-3
                text-center
              ">

                <h2 className="
                  font-semibold
                  text-white
                ">
                  {day}
                </h2>

              </div>

              {/* ========================================= */}
              {/* COURS */}
              {/* ========================================= */}

              <div className="
                space-y-3
                p-4
              ">

                {daySchedules.length === 0 && (

                  <div className="
                    rounded-xl
                    border
                    border-dashed
                    p-6
                    text-center
                    text-sm
                    text-gray-400
                  ">
                    Aucun cours
                  </div>

                )}

                {daySchedules.map(
                  (schedule: any) => {

                    const title =
                      getScheduleTitle(
                        schedule
                      );

                    const color =
                      colorMap.get(
                        title
                      ) ||
                      COLORS[0];

                    return (

                      <div
                        key={
                          schedule.id
                        }
                        className={`
                          rounded-xl
                          border
                          border-l-4
                          p-4
                          shadow-sm
                          ${color}
                        `}
                      >

                        {/* ================================= */}
                        {/* MATIÈRE / COURS */}
                        {/* ================================= */}

                        <div className="
                          flex
                          items-start
                          gap-2
                        ">

                          <BookOpen
                            size={18}
                            className="
                              mt-0.5
                              shrink-0
                              text-[#6214BE]
                            "
                          />

                          <div>

                            <h3 className="
                              font-semibold
                              text-gray-900
                            ">
                              {title}
                            </h3>

                            {/* Type d'affectation */}

                            {schedule.assignment_type_label && (
                              <p className="
                                mt-1
                                text-xs
                                text-gray-500
                              ">
                                {
                                  schedule
                                    .assignment_type_label
                                }
                              </p>
                            )}

                          </div>

                        </div>

                        {/* ================================= */}
                        {/* INFORMATIONS */}
                        {/* ================================= */}

                        <div className="
                          mt-4
                          space-y-2
                          text-sm
                          text-gray-700
                        ">

                          {/* Horaire */}

                          <div className="
                            flex
                            items-center
                            gap-2
                          ">

                            <Clock3
                              size={15}
                              className="
                                shrink-0
                                text-gray-500
                              "
                            />

                            <span>

                              {schedule.start_time ||
                                "--:--"}

                              {" - "}

                              {schedule.end_time ||
                                "--:--"}

                            </span>

                          </div>

                          {/* Classe */}

                          <div className="
                            flex
                            items-center
                            gap-2
                          ">

                            <GraduationCap
                              size={15}
                              className="
                                shrink-0
                                text-gray-500
                              "
                            />

                            <span>

                              {getClassroomName(
                                schedule
                              )}

                            </span>

                          </div>

                          {/* Salle */}

                          {schedule.room && (

                            <div className="
                              flex
                              items-center
                              gap-2
                            ">

                              <MapPin
                                size={15}
                                className="
                                  shrink-0
                                  text-gray-500
                                "
                              />

                              <span>
                                {schedule.room}
                              </span>

                            </div>

                          )}

                        </div>

                      </div>

                    );
                  }
                )}

              </div>

            </div>

          );
        }
      )}

    </div>

  );
}