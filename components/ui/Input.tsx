"use client";

import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
} from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            {...props}
            className={`
              w-full
              rounded-lg
              border
              bg-white
              py-2.5
              text-sm
              text-gray-900
              placeholder:text-gray-400
              focus:outline-none
              focus:ring-2
              transition

              ${
                error
                  ? "border-red-400 focus:ring-red-200"
                  : "border-gray-300 focus:border-[#6214BE] focus:ring-[#6214BE]/20"
              }

              ${leftIcon ? "pl-10" : "pl-3"}

              ${rightIcon ? "pr-10" : "pr-3"}

              ${className}
            `}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="mt-1 text-xs text-red-600">
            {error}
          </p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-gray-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;