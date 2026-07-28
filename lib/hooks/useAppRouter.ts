"use client";

import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { startTransition } from "react";
import NProgress from "nprogress";

export function useAppRouter() {
  const router: AppRouterInstance = useRouter();

  const push = (href: string) => {
    NProgress.start();

    startTransition(() => {
      router.push(href);
    });
  };

  const replace = (href: string) => {
    NProgress.start();

    startTransition(() => {
      router.replace(href);
    });
  };

  return {
    ...router,
    push,
    replace,
  };
}