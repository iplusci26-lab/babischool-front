"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { canAccess } from "@/lib/permissions";
import { useAuth } from "@/lib/hooks/useAuth";


import {
  LayoutDashboard,
  UserPlus,
  Users,
  GraduationCap,
  School,
  Wallet,
  CalendarCheck,
  MessageCircle,
  UserCog,
  BookOpen,
  ClipboardList,
  Calendar,
  Clock,
  Layers3,
  CalendarDays,
  FileSpreadsheet,
  PenSquare,
  MessageSquare,
  Briefcase,
  Settings,
  RefreshCcw,
  Bell,
  Megaphone

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
        { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { key: "term", label: "Période", href: "/terms", icon: GraduationCap },
        { key: "staff", label: "Personnel", href: "/staff", icon: UserCog },
        { key: "classroom", label: "Classes", href: "/classrooms", icon: School },
        { key: "admission", label: "Inscription", href: "/admissions", icon: ClipboardList },
        { key: "students", label: "Elèves", href: "/students", icon: GraduationCap },
        { key: "reinscription", label: "Réinscription", href: "/re-enrollment", icon: RefreshCcw},
      ],
    },


    {
      section: "Académique",
      items: [
        { key: "teachers", label: "Professeurs", href: "/teachers/admin", icon: UserCog },
        { key: "subjects", label: "Matières", href: "/subjects", icon: BookOpen },
        {/* key: "assignment", label: "Affectations", href: "/assignments", icon: Layers3 */},
        { key: "schedule", label: "Emploi du temps", href: "/schedule", icon: CalendarDays },
        { key: "evaluations", label: "Évaluations",href: "/assessments",icon: FileSpreadsheet,},
        { key: "grade", label: "Notes",href: "/grades",icon: PenSquare,},
        
      ],
    },

    {
      section: "Gestion",
      items: [
        { key: "finance", label: "Finance", href: "/finance", icon: Wallet },
        { key: "teacherAttendance",label: "Présence Prof", href: "/attendance/teachers", icon: Calendar },
        { key: "studentAttendance",label: "Présence Elève", href: "/attendance/students", icon: CalendarCheck },
        { key: "staffAttendance",label: "Présence Personnel", href: "/attendance/staff", icon: Users },
        { key: "settings",label: "Settings",href: "/settings",icon: Settings},
        
      ],
    },

    {
      section: "Communication",
      items: [
        { key: "announcements", label: "Annonces", href: "/annoucements", icon: Megaphone },
        { key: "messages", label: "Message", href: "/messaging", icon: MessageCircle },
      ],
    },
  ] 
  
  
  const renderItem = (item: any) => {
    const isActive = pathname.startsWith(item.href);
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
          isActive
            ? "bg-white text-black font-medium border-l-4 border-black"
            : "hover:bg-purple-500"
        }`}
      >
        <Icon size={18} />
        {item.label}
      </Link>
    );
  };


  return (
    <div className="h-screen w-64 bg-[#6214BE] text-white flex flex-col p-2  overflow-y-auto">

      {/* LOGO + SCHOOL */}
      <div className="mb-8 flex items-center gap-3">
        {school?.logo ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${school.logo}`}
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

              {group.items.filter(item => canAccess(item.key, user)).map((item) => {
                
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

