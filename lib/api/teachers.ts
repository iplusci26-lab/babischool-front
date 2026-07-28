import { api } from "../api";
import { Teacher } from "@/types/teachers";

export async function getTeachers(): Promise<Teacher[]> {

    const response = await api.get(
        "/academics/teachers/"
    );

    return response.data;

}