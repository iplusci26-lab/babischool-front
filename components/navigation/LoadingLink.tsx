"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Loader2, LucideIcon } from "lucide-react";

interface LoadingLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  className?: string;
}

export default function LoadingLink({
  href,
  label,
  icon: Icon,
  className = "",
}: LoadingLinkProps) {
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);

  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={() => {
        if (!loading) {
          setLoading(true);
        }
      }}
      className={`
        relative
        flex items-center gap-3
        px-4 py-2
        rounded-xl
        transition-all
        duration-200

        ${
          isActive
            ? "bg-white text-[#6214BE] font-semibold border-l-4 border-black shadow"
            : "hover:bg-purple-500/40"
        }

        ${
          loading
            ? "pointer-events-none opacity-70"
            : ""
        }

        ${className}
      `}
    >
      <Icon size={20} />

      <span className="flex-1">
        {label}
      </span>

      {loading && (
        <Loader2
          size={18}
          className="animate-spin"
        />
      )}
    </Link>
  );
}