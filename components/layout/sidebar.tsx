"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { canAccess } from "@/lib/permissions";
import { useAuth } from "@/lib/hooks/useAuth";


import {
  LayoutDashboard,
  CalendarRange,
  UsersRound,
  Building2,
  FilePlus2,
  Users,
  RefreshCcw,
  BookOpen,
  Presentation,
  GitBranchPlus,
  Clock3,
  CalendarDays,
  ClipboardCheck,
  NotebookPen,
  Banknote,
  UserCheck,
  BadgeCheck,
  BriefcaseBusiness,
  Settings,
  Users2,
  Megaphone,
  MessagesSquare,
} from "lucide-react";



export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  

  const [school, setSchool] = useState<any>(null);
  useEffect(() => {
    api.get("/auth/me/").then((res) => {
      setSchool(res.data.school);
    });
  }, []);

  const menu = [
    {
      section: "Principal",
      items: [
        {
          key: "dashboard",
          label: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          key: "term",
          label: "Période",
          href: "/terms",
          icon: CalendarRange,
        },
        {
          key: "staff",
          label: "Personnel",
          href: "/staff",
          icon: UsersRound,
        },
        {
          key: "classroom",
          label: "Classes",
          href: "/classrooms",
          icon: Building2,
        },
        {
          key: "admission",
          label: "Inscription",
          href: "/admissions",
          icon: FilePlus2,
        },
        {
          key: "students",
          label: "Élèves",
          href: "/students",
          icon: Users,
        },
        {
          key: "reinscription",
          label: "Réinscription",
          href: "/re-enrollment",
          icon: RefreshCcw,
        },
      ],
    },

    {
      section: "Académique",
      items: [
        {
          key: "subjects",
          label: "Matières",
          href: "/subjects",
          icon: BookOpen,
        },
        {
          key: "teachers",
          label: "Enseignants",
          href: "/teachers/admin",
          icon: Presentation,
        },
        {
          key: "assignment",
          label: "Affectations",
          href: "/assignments",
          icon: GitBranchPlus,
        },
        {
          key: "timeslot",
          label: "Heures de cours",
          href: "/timeslots",
          icon: Clock3,
        },
        {
          key: "schedule",
          label: "Emploi du temps",
          href: "/schedule",
          icon: CalendarDays,
        },
        {
          key: "evaluations",
          label: "Évaluations",
          href: "/assessments",
          icon: ClipboardCheck,
        },
        {
          key: "grade",
          label: "Notes",
          href: "/grades",
          icon: NotebookPen,
        },
      ],
    },

    {
      section: "Gestion",
      items: [
        {
          key: "finance",
          label: "Comptabilité",
          href: "/finance",
          icon: Banknote,
        },
        {
          key: "teacherAttendance",
          label: "Présence Enseignant",
          href: "/attendance/teachers",
          icon: UserCheck,
        },
        {
          key: "studentAttendance",
          label: "Présence Élève",
          href: "/attendance/students",
          icon: BadgeCheck,
        },
        {
          key: "staffAttendance",
          label: "Présence Administration",
          href: "/attendance/staff",
          icon: BriefcaseBusiness,
        },
        {
          key: "settings",
          label: "Paramètres",
          href: "/settings",
          icon: Settings,
        },
        {
          key: "parents",
          label: "Parents",
          href: "/dashboard/parents",
          icon: Users2,
        },
      ],
    },

    {
      section: "Communication",
      items: [
        {
          key: "announcements",
          label: "Annonces",
          href: "/annoucements",
          icon: Megaphone,
        },
        {
          key: "messages",
          label: "Messages",
          href: "/messaging",
          icon: MessagesSquare,
        },
      ],
    },
  ] 
  
  



  return (
    <div className="h-screen w-64 bg-[#6214BE] text-white flex flex-col p-2  overflow-y-auto">

      {/* LOGO + SCHOOL */}
      <div className="mb-8 flex items-center gap-3">
        {school?.logo ? (

      
          <img
            src={school.logo instanceof File? URL.createObjectURL(school.logo): school.logo}
            className="w-10 h-10  rounded object-cover"  
          />
        ) : (
          <div className="w-10 h-10 bg-white/20 rounded" />
        )}

        <div className="font-bold text-sm leading-tight">
          {school?.name || "Loading..."}
        </div>
      </div>

      {/* MENU */}

      <div className="flex flex-col gap-6">

        {menu.map((group) => (

          <div key={group.section}>

            {/* SECTION */}

            <div className="text-xs uppercase tracking-wider text-white/50 mb-2 px-3">
              {group.section}
            </div>

            {/* ITEMS */}

            <nav className="flex flex-col gap-1">

              {group.items.filter(item => item.key && canAccess(item.key, user)).map((item) => {
                
                const isActive = pathname.startsWith(
                  item.href ?? ""
                );

                const Icon = item.icon as React.ElementType;

                return (

                  <Link
                    key={item.href}
                    href={item.href ?? ""}
                    className={`
                      flex items-center gap-3
                      px-4 py-2 rounded-xl
                      transition
                      ${
                        isActive
                          ? "bg-white text-[#6214BE] font-semibold border-l-4 border-black shadow"
                          : "hover:bg-purple-500/40"
                      }
                    `}
                  >

                    <Icon size={20} />

                    <span>
                      {item.label}
                    </span>

                  </Link>
                );
              })}

            </nav>

          </div>

        ))}

      </div>

    </div>
  );
}

