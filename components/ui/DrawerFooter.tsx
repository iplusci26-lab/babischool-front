"use client";

import { ReactNode } from "react";

interface DrawerFooterProps {

  children: ReactNode;

}

export default function DrawerFooter({

  children,

}: DrawerFooterProps) {

  return (

    <div
      className="
        flex
        justify-end
        gap-3
        border-t
        bg-white
        p-6
      "
    >

      {children}

    </div>

  );

}