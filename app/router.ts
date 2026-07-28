"use client";

import { useRouter } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";

export function useAppRouter() {
  const router = useRouter();
  const loader = useTopLoader();

  const push = (href: string) => {
    loader.start();
    router.push(href);
  };

  const replace = (href: string) => {
    loader.start();
    router.replace(href);
  };

  const back = () => {
    loader.start();
    router.back();
  };

  return {
    ...router,
    push,
    replace,
    back,
  };
}