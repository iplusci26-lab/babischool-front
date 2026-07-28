import { api } from "@/lib/api";

import { StaffFormData } from "../types";

export async function getStaff() {

    const res =
        await api.get("/auth/staff/");

    return res.data;

}

export async function getRoles() {

    const res =
        await api.get("/auth/role");

    return res.data.results || res.data;

}

export async function createStaff(
    data: StaffFormData
) {

    await api.post(
        "/auth/staff/",
        {
            ...data,
            user_type: "staff",
        }
    );

}

export async function updateStaff(
    id: string,
    data: any,
) {

    await api.patch(
        `/auth/staff/${id}/`,
        data
    );

}

export async function deleteStaff(
    id: string
) {

    await api.delete(
        `/auth/staff/${id}/`
    );

}