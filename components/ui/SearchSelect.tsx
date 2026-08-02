"use client";

import {
  Check,
  ChevronDown,
  Search,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export interface SearchSelectOption {
  value: string;
  label: string;
}

interface SearchSelectProps {
  label?: string;

  placeholder?: string;

  value: string;

  options: SearchSelectOption[];

  onChange: (
    value: string
  ) => void;

  disabled?: boolean;

  clearable?: boolean;

  emptyMessage?: string;
}

export default function SearchSelect({

  label,

  placeholder = "Sélectionner...",

  value,

  options,

  onChange,

  disabled = false,

  clearable = true,

  emptyMessage = "Aucun résultat",

}: SearchSelectProps) {

  const [open, setOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const containerRef =
    useRef<HTMLDivElement>(null);

  const selected =
    options.find(
      (option) =>
        option.value === value
    );

  const filteredOptions =
    useMemo(() => {

      if (!search.trim()) {
        return options;
      }

      return options.filter(
        (option) =>
          option.label
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [
      options,
      search,
    ]);

  useEffect(() => {

    function handleClickOutside(
      event: MouseEvent
    ) {

      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {

        setOpen(false);

      }

    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);

  return (

    <div
      ref={containerRef}
      className="relative w-full"
    >

      {label && (

        <label className="mb-2 block text-sm font-medium text-gray-700">

          {label}

        </label>

      )}

      <button

        type="button"

        disabled={disabled}

        onClick={() => {

          if (!disabled) {

            setOpen(!open);

          }

        }}

        className={`
          flex
          w-full
          items-center
          justify-between
          rounded-2xl
          border
          bg-white
          px-4
          py-3
          shadow-sm
          transition-all

          ${
            disabled
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "hover:border-[#6214BE] hover:shadow-md"
          }

          ${
            open
              ? "border-[#6214BE]"
              : "border-gray-200"
          }
        `}
      >

        <span
          className={
            selected
              ? "text-gray-900"
              : "text-gray-400"
          }
        >

          {selected?.label ??
            placeholder}

        </span>

        <div className="flex items-center gap-2">

          {clearable &&
            value &&
            !disabled && (

              <span

              

                onClick={(e) => {

                  e.stopPropagation();

                  onChange("");

                  setSearch("");

                }}

                className="
                  rounded-full
                  p-1
                  text-gray-400
                  transition
                  hover:bg-gray-100
                  hover:text-gray-700
                "
              >

                <X size={15} />

              </span>

            )}

          <ChevronDown
            size={18}
            className={`
              text-gray-500
              transition-transform
              duration-200
              ${
                open
                  ? "rotate-180"
                  : ""
              }
            `}
          />

        </div>

      </button>

      {open && !disabled && (

        <div
          className="
            absolute
            z-50
            mt-2
            w-full
            overflow-hidden
            rounded-2xl
            border
            bg-white
            shadow-xl
            animate-in
            fade-in
            zoom-in-95
          "
        >

          {/* Recherche */}

          <div className="border-b p-3">

            <div className="relative">

              <Search
                size={16}
                className="
                  absolute
                  left-3
                  top-3
                  text-gray-400
                "
              />

              <input

                autoFocus

                value={search}

                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }

                placeholder="Rechercher..."

                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  py-2
                  pl-10
                  pr-3
                  outline-none
                  transition
                  focus:border-[#6214BE]
                "
              />

            </div>

          </div>

          {/* Liste */}

          <div
            className="
              max-h-64
              overflow-y-auto
            "
          >

            {filteredOptions.length === 0 && (

              <div className="p-5 text-center text-sm text-gray-400">

                {emptyMessage}

              </div>

            )}

            {filteredOptions.map(
              (option) => (

                <button

                  key={option.value}

                  type="button"

                  onClick={() => {

                    onChange(
                      option.value
                    );

                    setSearch("");

                    setOpen(false);

                  }}

                  className={`
                    flex
                    w-full
                    items-center
                    justify-between
                    px-4
                    py-3
                    transition

                    ${
                      value === option.value
                        ? "bg-violet-50"
                        : "hover:bg-gray-50"
                    }
                  `}
                >

                  <span>

                    {option.label}

                  </span>

                  {value ===
                    option.value && (

                    <Check
                      size={18}
                      className="text-[#6214BE]"
                    />

                  )}

                </button>

              )
            )}

          </div>

        </div>

      )}

    </div>

  );

}