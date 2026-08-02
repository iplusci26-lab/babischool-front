"use client";

import { ReactNode } from "react";

interface DrawerContentProps {

  children: ReactNode;

}

export default function DrawerContent({

  children,

}: DrawerContentProps) {

  return (

    <div
      className="
        flex-1
        overflow-y-auto
        p-6
      "
    >

      {children}

    </div>

  );

}