import { api } from "../api";
import { Subject } from "@/types/subject";

export interface SubjectsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Subject[];
}

export async function getSubjects(): Promise<SubjectsResponse> {

    const response = await api.get(
        "/academics/subjects/"
    );

    return response.data;

}