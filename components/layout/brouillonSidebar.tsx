"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  Wallet,
  CalendarCheck,
  ClipboardList,
  MessageSquare,
  BookOpen,
  Layers3,
  CalendarDays,
  UserCog,
  FileSpreadsheet,
  PenSquare,
} from "lucide-react";

const menu = [

  {
    section: "Principal",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    section: "Académique",
    items: [
      {
        label: "Inscription",
        href: "/admissions",
        icon: ClipboardList,
      },

      {
        label: "Élèves",
        href: "/students",
        icon: GraduationCap,
      },

      {
        label: "Classes",
        href: "/classrooms",
        icon: School,
      },

      {
        label: "Matières",
        href: "/subjects",
        icon: BookOpen,
      },

      {
        label: "Affectations",
        href: "/assignments",
        icon: Layers3,
      },

      {
        label: "Emploi du temps",
        href: "/schedules",
        icon: CalendarDays,
      },

      {
        label: "Professeurs",
        href: "/teachers",
        icon: UserCog,
      },

      {
        label: "Évaluations",
        href: "/assessments",
        icon: FileSpreadsheet,
      },

      {
        label: "Notes",
        href: "/grades",
        icon: PenSquare,
      },
    ],
  },

  {
    section: "Gestion",
    items: [
      {
        label: "Finance",
        href: "/finance",
        icon: Wallet,
      },

      {
        label: "Présences",
        href: "/attendance",
        icon: CalendarCheck,
      },

      {
        label: "Messages",
        href: "/messaging",
        icon: MessageSquare,
      },
    ],
  },
];

export default function Sidebar() {

  const pathname = usePathname();

  return (

    <div className="h-screen w-72 bg-[#6214BE] text-white flex flex-col p-4 overflow-y-auto">

      {/* LOGO */}

      <div className="mb-8">

        <div className="text-2xl font-bold">
          School SaaS
        </div>

        <div className="text-sm text-white/70">
          Gestion scolaire
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

              {group.items.map((item) => {

                const isActive = pathname.startsWith(
                  item.href
                );

                const Icon = item.icon;

                return (

                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3
                      px-4 py-3 rounded-xl
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-white text-[#6214BE] font-semibold shadow"
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