"use client";
import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import ScheduleFilter from "./components/ScheduleFilters";
import WeeklyScheduleGrid from "./components/WeeklyScheduleGrid";
import ClassScheduleModal from "./components/ClassScheduleModal";

import {
    createSchedule,
    deleteSchedule,
    getWeeklySchedule,
    updateSchedule,
    getScheduleFilters,
    getScheduleFormData,
} from "@/lib/api/classSchedules";

import {
    ClassSchedule,
    ClassSchedulePayload,
    ScheduleFilter as ScheduleFiltersType,
    Weekday,
    WeeklyScheduleResponse,
    WeeklyTimeSlot,
    ScheduleFiltersResponse,
    ScheduleFormDataResponse,
} from "@/types/classSchedule";

export default function ClassSchedulesPage() {

    const [weeklySchedule, setWeeklySchedule] =
        useState<WeeklyScheduleResponse | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [filters, setFilters] =
        useState<ScheduleFiltersType>({});

    const [modalOpen, setModalOpen] =
        useState(false);

    const [selectedSchedule, setSelectedSchedule] =
        useState<ClassSchedule | null>(null);

    const [selectedWeekday, setSelectedWeekday] =
        useState<Weekday>("MONDAY");

    const [selectedTimeSlot, setSelectedTimeSlot] =
        useState("");

    const [scheduleFilters, setScheduleFilters] =
        useState<ScheduleFiltersResponse>({
            classrooms: [],
            teachers: [],
        });
    
    const [formData, setFormData] =
        useState<ScheduleFormDataResponse>({
            assignments: [],
            subjects: [],
        });

    async function loadSchedule() {

        setLoading(true);

        try {

            const data =
                await getWeeklySchedule(filters);

            setWeeklySchedule(data);

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadSchedule();
        loadFormData();

    }, [filters]);

    function handleCreate(
        weekday: Weekday,
        slot: WeeklyTimeSlot
    ) {

        setSelectedSchedule(null);

        setSelectedWeekday(weekday);

        setSelectedTimeSlot(slot.id);

        setModalOpen(true);

    }

    function handleEdit(
        schedule: ClassSchedule
    ) {

        setSelectedSchedule(schedule);

        setModalOpen(true);

    }

    

      async function handleSubmit(payload: ClassSchedulePayload) {
          try {
              if (selectedSchedule) {
                  await updateSchedule(selectedSchedule.id, payload);
              } else {
                  await createSchedule(payload);
              }

              setModalOpen(false);
              loadSchedule();

          } catch (error) {
              if (axios.isAxiosError(error)) {
                  const data = error.response?.data;
               
                  // Message renvoyé par DRF
                  if (typeof data === "string") {
                      return;
                  }

                  // Erreurs de validation
                  if (typeof data === "object") {
                      const message = Object.values(data)
                          .flat()
                          .join("\n");

                          toast.error(message);
                      return;
                  }
              }

              toast.error("Une erreur est survenue.");
          }
      }

    async function handleDelete() {

        if (!selectedSchedule)
            return;

        await deleteSchedule(
            selectedSchedule.id
        );

        setModalOpen(false);

        loadSchedule();

    }

    async function loadFormData() {
      
     

      const [filtersData, formDataResponse] = await Promise.all([
  
          getScheduleFilters(),
  
          getScheduleFormData(),
  
      ]);
  
      setScheduleFilters(filtersData);
  
      setFormData(formDataResponse);
  
  }

    if (loading) {

        return (

            <div className="p-6">

                Chargement...

            </div>

        );

    }

    if (!weeklySchedule) {

        return (

            <div className="p-6">

                Impossible de charger l'emploi du temps.

            </div>

        );

    }

    return (

        <div className="space-y-6 p-6">

            <div>

                <h1 className="text-2xl font-bold">

                    Emploi du temps

                </h1>

                <p className="text-sm text-gray-500">

                    Gestion des heures de cours

                </p>

            </div>

            <ScheduleFilter

                filters={filters}

                onChange={setFilters}

                classrooms={scheduleFilters.classrooms}
                teachers={scheduleFilters.teachers}

            />

            <WeeklyScheduleGrid

                weekdays={weeklySchedule.weekdays}

                timeSlots={weeklySchedule.time_slots}

                grid={weeklySchedule.grid}

                onCellClick={handleCreate}

                onScheduleClick={handleEdit}

            />

            <ClassScheduleModal

                open={modalOpen}

                schedule={selectedSchedule}

                weekdays={weeklySchedule.weekdays}

                timeSlots={weeklySchedule.time_slots}

                assignments={formData.assignments}

                subjects={formData.subjects}

                initialWeekday={selectedWeekday}

                initialTimeSlot={selectedTimeSlot}

                onClose={() => setModalOpen(false)}

                onSubmit={handleSubmit}

            />

        </div>

    );

}