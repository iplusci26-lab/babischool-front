"use client";

import {
  BookOpen,
  GraduationCap,
  CalendarDays,
  Clock3,
} from "lucide-react";

interface TeacherStatsProps {
  assignments: any[];
  schedules: any[];
}

// ==========================================================
// JOURS DE LA SEMAINE
// ==========================================================

const WEEKDAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

// ==========================================================
// NORMALISATION DES JOURS
// ==========================================================

const normalizeDay = (
  value: any
): string => {
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
// CORRESPONDANCE DES VALEURS DJANGO
// ==========================================================

const DAY_MAPPING: Record<string, string> = {
  sunday: "dimanche",
  monday: "lundi",
  tuesday: "mardi",
  wednesday: "mercredi",
  thursday: "jeudi",
  friday: "vendredi",
  saturday: "samedi",

  sun: "dimanche",
  mon: "lundi",
  tue: "mardi",
  wed: "mercredi",
  thu: "jeudi",
  fri: "vendredi",
  sat: "samedi",

  dimanche: "dimanche",
  lundi: "lundi",
  mardi: "mardi",
  mercredi: "mercredi",
  jeudi: "jeudi",
  vendredi: "vendredi",
  samedi: "samedi",
};

// ==========================================================
// NORMALISATION COMPLÈTE D'UN JOUR
// ==========================================================

const getNormalizedDay = (
  value: any
): string => {
  const normalized =
    normalizeDay(value);

  return (
    DAY_MAPPING[normalized] ||
    normalized
  );
};

// ==========================================================
// RÉCUPÉRATION DU JOUR D'UNE SÉANCE
// ==========================================================

const getScheduleDay = (
  schedule: any
): string => {
  return getNormalizedDay(
    schedule.weekday_name ||
    schedule.weekday_label ||
    schedule.weekday
  );
};

// ==========================================================
// DÉTECTION DU TYPE D'AFFECTATION
// ==========================================================

const isPrimaryAssignment = (
  assignment: any
): boolean => {
  const type = String(
    assignment?.assignment_type || ""
  )
    .trim()
    .toLowerCase();

  const label = String(
    assignment?.assignment_type_label || ""
  )
    .trim()
    .toLowerCase();

  return (
    type === "primary" ||
    type === "primaire" ||
    type === "classroom" ||
    type === "class" ||
    label.includes("primaire") ||
    label.includes("titulaire")
  );
};

// ==========================================================
// COMPOSANT
// ==========================================================

export default function TeacherStats({
  assignments,
  schedules,
}: TeacherStatsProps) {

  // ========================================================
  // TYPE D'ENSEIGNANT
  // ========================================================

  const isPrimary =
    assignments.some(
      (assignment) =>
        isPrimaryAssignment(
          assignment
        )
    );

  // ========================================================
  // MATIÈRES DES AFFECTATIONS
  // ========================================================

  const assignmentSubjects =
    new Set(
      assignments
        .map(
          (assignment) =>
            assignment.subject_name
        )
        .filter(Boolean)
    );

  // ========================================================
  // MATIÈRES RÉELLEMENT ENSEIGNÉES
  //
  // Une matière peut être portée par :
  //
  // - lesson_subject_name
  // - subject_name
  //
  // Pour les cours groupés / primaire,
  // lesson_subject_name est prioritaire.
  // ========================================================

  const scheduleSubjects =
    new Set(
      schedules
        .map(
          (schedule) =>
            schedule.lesson_subject_name ||
            schedule.subject_name
        )
        .filter(Boolean)
    );

  // ========================================================
  // NOMBRE DE MATIÈRES
  // ========================================================

  const subjects = isPrimary
    ? scheduleSubjects
    : assignmentSubjects;

  // ========================================================
  // CLASSES
  // ========================================================

  const classrooms =
    new Set<string>();

  // ========================================================
  // CLASSES DEPUIS LES AFFECTATIONS
  // ========================================================

  assignments.forEach(
    (assignment) => {
      if (
        assignment.classroom_name
      ) {
        classrooms.add(
          assignment.classroom_name
        );
      }
    }
  );

  // ========================================================
  // CLASSES DEPUIS LES SÉANCES
  //
  // Compatible avec :
  //
  // - classroom_name
  // - classroom_names
  // - schedule_classes
  //
  // ========================================================

  schedules.forEach(
    (schedule) => {

      // ----------------------------------------------------
      // Classe simple
      // ----------------------------------------------------

      if (
        schedule.classroom_name
      ) {
        classrooms.add(
          schedule.classroom_name
        );
      }

      // ----------------------------------------------------
      // Liste de noms
      // ----------------------------------------------------

      if (
        Array.isArray(
          schedule.classroom_names
        )
      ) {
        schedule.classroom_names.forEach(
          (classroom: string) => {
            if (classroom) {
              classrooms.add(
                classroom
              );
            }
          }
        );
      }

      // ----------------------------------------------------
      // Classes participantes
      // ----------------------------------------------------

      if (
        Array.isArray(
          schedule.schedule_classes
        )
      ) {
        schedule.schedule_classes.forEach(
          (item: any) => {

            const classroomName =
              item.classroom_name ||
              item.classroom?.name;

            if (
              classroomName
            ) {
              classrooms.add(
                classroomName
              );
            }
          }
        );
      }

    }
  );

  // ========================================================
  // AUJOURD'HUI
  // ========================================================

  const todayLabel =
    WEEKDAYS[
      new Date().getDay()
    ];

  const today =
    getNormalizedDay(
      todayLabel
    );

  // ========================================================
  // SÉANCES D'AUJOURD'HUI
  // ========================================================

  const todaySchedules =
    schedules.filter(
      (schedule) => {

        const scheduleDay =
          getScheduleDay(
            schedule
          );

        return (
          scheduleDay === today
        );
      }
    );

  // ========================================================
  // DEBUG
  // ========================================================

  console.log(
    "================ TEACHER STATS ================"
  );

  console.log(
    "Type enseignant :",
    isPrimary
      ? "PRIMAIRE"
      : "SECONDAIRE"
  );

  console.log(
    "Matières :",
    Array.from(subjects)
  );

  console.log(
    "Nombre matières :",
    subjects.size
  );

  console.log(
    "Classes :",
    Array.from(classrooms)
  );

  console.log(
    "Nombre classes :",
    classrooms.size
  );

  console.log(
    "Séances semaine :",
    schedules.length
  );

  console.log(
    "Aujourd'hui (label) :",
    todayLabel
  );

  console.log(
    "Aujourd'hui (normalisé) :",
    today
  );

  console.log(
    "Jours des séances :",
    schedules.map(
      (schedule) => ({
        id: schedule.id,
        weekday: schedule.weekday,
        weekday_name:
          schedule.weekday_name,
        normalized:
          getScheduleDay(
            schedule
          ),
      })
    )
  );

  console.log(
    "Séances aujourd'hui :",
    todaySchedules.length
  );

  console.log(
    "Schedules aujourd'hui :",
    todaySchedules
  );

  // ========================================================
  // CARTES
  // ========================================================

  const cards = [

    // ======================================================
    // CARTE 1
    // ======================================================

    {
      title: isPrimary
        ? "Matières de la classe"
        : "Matières",

      value: subjects.size,

      icon: BookOpen,

      bg: "bg-purple-50",

      border:
        "border-purple-200",

      iconBg:
        "bg-purple-100",

      iconColor:
        "text-[#6214BE]",
    },

    // ======================================================
    // CARTE 2
    // ======================================================

    {
      title: "Classes",

      value: classrooms.size,

      icon: GraduationCap,

      bg: "bg-blue-50",

      border:
        "border-blue-200",

      iconBg:
        "bg-blue-100",

      iconColor:
        "text-blue-600",
    },

    // ======================================================
    // CARTE 3
    // ======================================================

    {
      title:
        "Séances de la semaine",

      value:
        schedules.length,

      icon: CalendarDays,

      bg: "bg-green-50",

      border:
        "border-green-200",

      iconBg:
        "bg-green-100",

      iconColor:
        "text-green-600",
    },

    // ======================================================
    // CARTE 4
    // ======================================================

    {
      title:
        "Aujourd'hui",

      value:
        todaySchedules.length,

      icon: Clock3,

      bg: "bg-orange-50",

      border:
        "border-orange-200",

      iconBg:
        "bg-orange-100",

      iconColor:
        "text-orange-600",
    },

  ];

  // ========================================================
  // RENDER
  // ========================================================

  return (

    <div
      className="
        grid
        grid-cols-1
        gap-4
        md:grid-cols-2
        xl:grid-cols-4
      "
    >

      {cards.map(
        (card) => {

          const Icon =
            card.icon;

          return (

            <div
              key={
                card.title
              }
              className={`
                rounded-2xl
                border
                ${card.border}
                ${card.bg}
                p-5
                shadow-sm
                transition-all
                hover:-translate-y-1
                hover:shadow-md
              `}
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <div>

                  <p
                    className="
                      text-sm
                      text-gray-600
                    "
                  >
                    {card.title}
                  </p>

                  <p
                    className="
                      mt-2
                      text-3xl
                      font-bold
                      text-gray-900
                    "
                  >
                    {card.value}
                  </p>

                </div>

                <div
                  className={`
                    rounded-xl
                    p-3
                    ${card.iconBg}
                  `}
                >

                  <Icon
                    className={
                      card.iconColor
                    }
                    size={24}
                  />

                </div>

              </div>

            </div>

          );

        }
      )}

    </div>

  );
}