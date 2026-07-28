import { api } from "../api";

import { AcademicYear } from "@/types/academicYear";

export async function getAcademicYears(): Promise<AcademicYear[]> {
  const response = await api.get("/academics/academic-years/");

  return response.data;
}