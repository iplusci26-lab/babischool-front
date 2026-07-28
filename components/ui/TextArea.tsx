"use client";

import { TextareaHTMLAttributes } from "react";

interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function TextArea({
  label,
  error,
  className = "",
  ...props
}: TextAreaProps) {
  return (
    <div className="space-y-1">

      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <textarea
        {...props}
        value={props.value ?? ""}
        className={`
          w-full
          rounded-lg
          border
          border-gray-300
          px-4
          py-2
          outline-none
          transition
          focus:border-violet-500
          focus:ring-2
          focus:ring-violet-200

          ${error ? "border-red-500" : ""}

          ${className}
        `}
      />

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

    </div>
  );
}