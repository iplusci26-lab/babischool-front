
"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Search,
  RefreshCw,
  Users,
  GraduationCap,
  School,
  Phone,
  ChevronLeft,
  ChevronRight,
  X,
  UserRound,
  MapPin,
  BriefcaseBusiness,
} from "lucide-react";

type Child = {
  student_id: string;
  first_name: string;
  last_name: string;
  student_number: string;
  relationship_type: string;
  school_id: string;
  school_name: string;
  classroom: string | null;
  academic_year: string | null;
  enrollment_status: string | null;
};

type Parent = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  phone: string;
  alternate_phone: string;
  email: string;
  occupation: string;
  address: string;
  children_count: number;
  children: Child[];
  created_at: string;
};

type PaginatedResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Parent[];
};

type SchoolOption = {
  id: string;
  name: string;
  code: string;
  city: string | null;
};

const PAGE_SIZE = 25;

export default function SupervisorParentsPage() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);

  const [search, setSearch] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [phone, setPhone] = useState("");
  const [parentName, setParentName] = useState("");
  const [childName, setChildName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSchools = useCallback(async () => {
    try {
      const response = await api.get<SchoolOption[]>(
        "/developer/supervisor/schools/"
      );
      setSchools(response.data);
    } catch {
      // Le chargement des parents reste possible si la liste des écoles échoue.
    }
  }, []);

  const loadParents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params: Record<string, string | number> = {
        page,
        page_size: PAGE_SIZE,
      };

      if (search.trim()) params.search = search.trim();
      if (schoolId) params.school_id = schoolId;
      if (phone.trim()) params.phone = phone.trim();
      if (parentName.trim()) params.parent_name = parentName.trim();
      if (childName.trim()) params.child_name = childName.trim();
      if (studentNumber.trim()) {
        params.student_number = studentNumber.trim();
      }

      const response = await api.get<PaginatedResponse>(
        "/developer/supervisor/parents/",
        { params }
      );

      setParents(response.data.results);
      setTotal(response.data.count);
    } catch (err: any) {
      setParents([]);
      setTotal(0);

      if (err.response?.status === 401) {
        setError("Session expirée ou utilisateur non connecté.");
      } else if (err.response?.status === 403) {
        setError(
          "Accès refusé. Cette page est réservée au superutilisateur."
        );
      } else {
        setError(
          err.response?.data?.detail ||
            "Impossible de charger les parents. Vérifie la connexion à l'API."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, schoolId, phone, parentName, childName, studentNumber]);

  useEffect(() => {
    void loadSchools();
  }, [loadSchools]);

  useEffect(() => {
    void loadParents();
  }, [loadParents]);

  const resetFilters = () => {
    setSearch("");
    setSchoolId("");
    setPhone("");
    setParentName("");
    setChildName("");
    setStudentNumber("");
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const formatDate = (value: string) => {
    if (!value) return "—";

    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "medium",
    }).format(new Date(value));
  };

  return (
    <div className="min-h-full space-y-6 bg-gray-50 p-4 md:p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#6214BE]">
            BabiSchool · Administration centrale
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
            Supervision des parents
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Annuaire transversal des parents et de leurs enfants, toutes écoles confondues.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadParents()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6214BE] px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-800 disabled:opacity-60"
        >
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          Actualiser
        </button>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Parents trouvés</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {total}
              </p>
            </div>
            <div className="rounded-xl bg-purple-100 p-3 text-[#6214BE]">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Écoles disponibles</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {schools.length}
              </p>
            </div>
            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
              <School size={24} />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Search size={19} className="text-[#6214BE]" />
          <h2 className="font-semibold text-gray-900">Recherche et filtres</h2>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            setPage(1);
            void loadParents();
          }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-gray-700">
              Recherche générale
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nom, téléphone, matricule, école…"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#6214BE] focus:ring-2 focus:ring-purple-100"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-gray-700">École</span>
            <select
              value={schoolId}
              onChange={(event) => {
                setSchoolId(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6214BE]"
            >
              <option value="">Toutes les écoles</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name} {school.city ? `— ${school.city}` : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-gray-700">
              Téléphone du parent
            </span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Numéro de téléphone"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#6214BE]"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-gray-700">
              Nom du parent
            </span>
            <input
              value={parentName}
              onChange={(event) => setParentName(event.target.value)}
              placeholder="Nom ou prénom"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#6214BE]"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-gray-700">
              Nom de l'enfant
            </span>
            <input
              value={childName}
              onChange={(event) => setChildName(event.target.value)}
              placeholder="Nom ou prénom de l'enfant"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#6214BE]"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-gray-700">
              Matricule
            </span>
            <input
              value={studentNumber}
              onChange={(event) => setStudentNumber(event.target.value)}
              placeholder="Matricule de l'enfant"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#6214BE]"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3 sm:col-span-2 xl:col-span-3">
            <button
              type="submit"
              className="rounded-xl bg-[#6214BE] px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-800"
            >
              Appliquer les filtres
            </button>

            <button
              type="button"
              onClick={resetFilters}
              className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </section>

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void loadParents()}
            className="font-semibold underline"
          >
            Réessayer
          </button>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-semibold text-gray-900">Annuaire des parents</h2>
          <p className="text-sm text-gray-500">
            {total === 0
              ? "Aucun résultat"
              : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(
                  page * PAGE_SIZE,
                  total
                )} sur ${total}`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-4">Parent</th>
                <th className="px-5 py-4">Téléphone</th>
                <th className="px-5 py-4">Enfants</th>
                <th className="px-5 py-4">Établissements</th>
                <th className="px-5 py-4">Inscription</th>
                <th className="px-5 py-4">Détails</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-gray-500">
                    <RefreshCw className="mx-auto mb-3 animate-spin text-[#6214BE]" />
                    Chargement des parents…
                  </td>
                </tr>
              ) : parents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-gray-500">
                    Aucun parent ne correspond à ces critères.
                  </td>
                </tr>
              ) : (
                parents.map((parent) => {
                  const schoolNames = Array.from(
                    new Set(parent.children.map((child) => child.school_name))
                  );

                  return (
                    <tr key={parent.id} className="transition hover:bg-purple-50/40">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-900">
                          {parent.display_name || "Nom non renseigné"}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {parent.email || "Aucun e-mail"}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 text-gray-700">
                          <Phone size={15} className="text-gray-400" />
                          {parent.phone || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 font-semibold text-[#6214BE]">
                          <GraduationCap size={15} />
                          {parent.children_count}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="max-w-56 space-y-1">
                          {schoolNames.map((name) => (
                            <div key={name} className="truncate text-gray-700">
                              {name}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-gray-500">
                        {formatDate(parent.created_at)}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedParent(parent)}
                          className="rounded-lg border border-purple-200 px-3 py-2 font-semibold text-[#6214BE] hover:bg-purple-50"
                        >
                          Consulter
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4">
          <span className="text-sm text-gray-500">
            Page {page} sur {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-lg border border-gray-300 p-2 text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Page précédente"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-lg border border-gray-300 p-2 text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Page suivante"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {selectedParent && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedParent(null);
            }
          }}
        >
          <aside className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6214BE]">
                  Fiche parent
                </p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {selectedParent.display_name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedParent(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Fermer"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-6 p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoItem
                  icon={<Phone size={17} />}
                  label="Téléphone"
                  value={selectedParent.phone}
                />
                <InfoItem
                  icon={<Phone size={17} />}
                  label="Téléphone secondaire"
                  value={selectedParent.alternate_phone}
                />
                <InfoItem
                  icon={<UserRound size={17} />}
                  label="E-mail"
                  value={selectedParent.email}
                />
                <InfoItem
                  icon={<BriefcaseBusiness size={17} />}
                  label="Profession"
                  value={selectedParent.occupation}
                />
                <InfoItem
                  icon={<MapPin size={17} />}
                  label="Adresse"
                  value={selectedParent.address}
                />
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Enfants ({selectedParent.children_count})
                </h3>

                <div className="space-y-3">
                  {selectedParent.children.map((child) => (
                    <article
                      key={`${child.student_id}-${child.school_id}`}
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-purple-100 p-2 text-[#6214BE]">
                          <GraduationCap size={22} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {child.first_name} {child.last_name}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            Matricule : {child.student_number || "—"}
                          </p>
                          <p className="mt-1 text-sm text-gray-700">
                            {child.school_name}
                          </p>
                          <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                            <div className="rounded-lg bg-gray-50 p-2">
                              <span className="block text-xs text-gray-500">Classe</span>
                              <span className="font-medium text-gray-800">
                                {child.classroom || "Non affecté"}
                              </span>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-2">
                              <span className="block text-xs text-gray-500">Année scolaire</span>
                              <span className="font-medium text-gray-800">
                                {child.academic_year || "—"}
                              </span>
                            </div>
                          </div>
                          <p className="mt-3 text-xs text-gray-500">
                            Relation : {child.relationship_type}
                            {child.enrollment_status
                              ? ` · Statut : ${child.enrollment_status}`
                              : ""}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-3">
      <div className="mb-2 flex items-center gap-2 text-gray-500">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="break-words text-sm font-medium text-gray-900">
        {value || "Non renseigné"}
      </p>
    </div>
  );
}
