"use client";

import { useMemo, useState } from "react";
import {
    Eye,
    Pencil,
    Trash2,
    Search,
    Users,
} from "lucide-react";
import { formatPersonName } from "@/lib/formatters";
import {
    Staff
} from "../types";


interface Role {
    id: string;
    name: string;
}

interface StaffTableProps {
    staff: Staff[];
    onView: (staff: Staff) => void;
    onEdit: (staff: Staff) => void;
    onDelete: (id: string) => void;
}

export default function StaffTable({
    staff,
    onView,
    onEdit,
    onDelete,
}: StaffTableProps) {

    const [search, setSearch] = useState("");

    const filteredStaff = useMemo(() => {

        return staff
            .filter((person) => {

                const value = search.toLowerCase();

                return (
                    `${person.first_name} ${person.last_name}`
                        .toLowerCase()
                        .includes(value) ||

                    person.phone
                        ?.toLowerCase()
                        .includes(value) ||

                    person.role?.name
                        ?.toLowerCase()
                        .includes(value)
                );

            })
            .sort((a, b) => {

                const last = a.last_name.localeCompare(
                    b.last_name
                );

                if (last !== 0) return last;

                return a.first_name.localeCompare(
                    b.first_name
                );

            });

    }, [staff, search]);

    return (

        <div className="rounded-2xl border bg-white shadow-sm">

            {/* HEADER */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b p-6">

                <div>

                    <h2 className="flex items-center gap-2 text-lg font-semibold">

                        <Users size={20} />

                        Personnel

                    </h2>

                    <p className="text-sm text-gray-500 mt-1">

                        {filteredStaff.length} membre(s) du personnel

                    </p>

                </div>

                <div className="relative w-full lg:w-80">

                    <Search
                        size={18}
                        className="absolute left-3 top-3 text-gray-400"
                    />

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Rechercher..."
                        className="w-full rounded-lg border py-2 pl-10 pr-4"
                    />

                </div>

            </div>

            {/* TABLE */}

            <div className="overflow-x-auto">

                <table className="min-w-full">

                    <thead className="bg-gray-50">

                        <tr>

                            <th className="px-6 py-3 text-left text-sm font-semibold">

                                Nom & prénom

                            </th>

                            <th className="px-6 py-3 text-left text-sm font-semibold">

                                Téléphone

                            </th>

                            <th className="px-4 py-3 text-left">
                                Fonction
                            </th>

                            <th className="px-6 py-3 text-left text-sm font-semibold">

                                Accès

                            </th>

                            <th className="px-6 py-3 text-center text-sm font-semibold">

                                Actions

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredStaff.length === 0 && (

                            <tr>

                                <td
                                    colSpan={4}
                                    className="py-10 text-center text-gray-500"
                                >

                                    Aucun personnel trouvé.

                                </td>

                            </tr>

                        )}

                        {filteredStaff.map((person, index) => (

                            <tr
                                key={person.id}
                                className={`border-t hover:bg-gray-50 ${
                                    index % 2 === 0
                                        ? "bg-white"
                                        : "bg-gray-50/40"
                                }`}
                            >

                                <td className="px-6 py-4">

                                    <div>

                                        <p className="font-medium">

                                        {formatPersonName(
                                            person.last_name,
                                            person.first_name,
                                        )}

                                        </p>

                                    </div>

                                </td>

                                <td className="px-6 py-4">

                                    {person.phone || "-"}

                                </td>

                                <td className="px-4 py-3">
                                    {person.function || "-"}
                                </td>

                                <td className="px-6 py-4">

                                    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">

                                        {person.role?.name || "-"}

                                    </span>

                                </td>

                                <td className="px-6 py-4">

                                    <div className="flex justify-center gap-2">

                                        <button
                                            onClick={() =>
                                                onView(person)
                                            }
                                            className="rounded-lg p-2 cursor-pointer text-green-600 hover:bg-green-50"
                                        >

                                            <Eye size={18} />

                                        </button>

                                        <button
                                            onClick={() =>
                                                onEdit(person)
                                            }
                                            className="rounded-lg p-2 cursor-pointer text-blue-600 hover:bg-blue-50"
                                        >

                                            <Pencil size={18} />

                                        </button>

                                        <button
                                            onClick={() =>
                                                onDelete(person.id)
                                            }
                                            className="rounded-lg p-2 cursor-pointer text-red-600 hover:bg-red-50"
                                        >

                                            <Trash2 size={18} />

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}