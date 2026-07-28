"use client";

import { X, User, Phone, Shield, Briefcase } from "lucide-react";
import { formatPersonName } from "@/lib/formatters";

import {
    Staff
} from "../types";

interface StaffDetailsModalProps {
    staff: Staff;
    onClose: () => void;
}

export default function StaffDetailsModal({
    staff,
    onClose,
}: StaffDetailsModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

            <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">

                {/* HEADER */}

                <div className="bg-[#6214BE] px-6 py-5 text-white flex items-center justify-between">

                    <div>

                        <h2 className="text-xl font-semibold">
                            Détails du personnel
                        </h2>

                        <p className="text-sm text-violet-100 mt-1">
                            Consultez les informations du collaborateur.
                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-white/20 transition"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* BODY */}

                <div className="p-6 space-y-6">

                    {/* Avatar */}

                    <div className="flex items-center gap-4">

                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">

                            <User
                                size={30}
                                className="text-[#6214BE]"
                            />

                        </div>

                        <div>

                            <h3 className="text-xl font-semibold">
                            {formatPersonName(
                                    staff.last_name,
                                    staff.first_name,
                                )}

                            </h3>

                            <p className="text-gray-500">

                                Personnel BabiSchool

                            </p>

                        </div>

                    </div>

                    {/* Informations */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <InfoCard
                            icon={<Phone size={18} />}
                            label="Téléphone"
                            value={staff.phone}
                        />

                        <InfoCard
                            icon={<Shield size={18} />}
                            label="Accès"
                            value={staff.role?.name || "-"}
                        />

                        <InfoCard
                            icon={<Briefcase size={18} />}
                            label="Fonction"
                            value={staff.function || "-"}
                        />

                        <InfoCard
                            icon={<User size={18} />}
                            label="Type utilisateur"
                            value={staff.user_type}
                        />

                    </div>

                </div>

                {/* FOOTER */}

                <div className="border-t px-6 py-4 flex justify-end">

                    <button
                        onClick={onClose}
                        className="rounded-lg border px-5 py-2 hover:bg-gray-50"
                    >
                        Fermer
                    </button>

                </div>

            </div>

        </div>
    );
}

interface InfoCardProps {
    icon: React.ReactNode;
    label: string;
    value?: string;
}

function InfoCard({
    icon,
    label,
    value,
}: InfoCardProps) {

    return (

        <div className="rounded-xl border p-4">

            <div className="flex items-center gap-2 text-[#6214BE]">

                {icon}

                <span className="text-sm font-medium">

                    {label}

                </span>

            </div>

            <p className="mt-3 text-base font-semibold text-gray-800">

                {value || "-"}

            </p>

        </div>

    );

}