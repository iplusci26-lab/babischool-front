import { api } from "../api";
import { Subject } from "@/types/subject";


export async function getSubjects(): Promise<Subject[]> {

    const response = await api.get(
        "/academics/subjects/"
    );

    return response.data;

}