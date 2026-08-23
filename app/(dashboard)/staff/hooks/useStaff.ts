import { api } from "@/lib/api";

import {
    StaffFormData,
    StaffResponsibilityFormData,
} from "../types";


/* ==========================================================
 * STAFF
 * ========================================================== */

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


/* ==========================================================
 * RESPONSABILITÉS DU PERSONNEL
 * ========================================================== */

export async function getStaffResponsibilities(
    staffId: string
) {

    const res =
        await api.get(
            `/auth/staff/${staffId}/responsibilities/`
        );

    return res.data.results || res.data;

}


export async function createStaffResponsibility(
    staffId: string,
    data: StaffResponsibilityFormData
) {

    const res =
        await api.post(
            `/auth/staff/${staffId}/responsibilities/`,
            data
        );

    return res.data;

}


export async function updateStaffResponsibility(
    staffId: string,
    responsibilityId: string,
    data: StaffResponsibilityFormData
) {

    const res =
        await api.patch(
            `/auth/staff/${staffId}/responsibilities/${responsibilityId}/`,
            data
        );

    return res.data;

}


export async function deleteStaffResponsibility(
    staffId: string,
    responsibilityId: string
) {

    await api.delete(
        `/auth/staff/${staffId}/responsibilities/${responsibilityId}/`
    );

}


/* ==========================================================
 * STRUCTURE ACADÉMIQUE
 * ========================================================== */

export async function getClassroomLevels() {

    const res =
        await api.get(
            "/students/classroom-levels/"
        );

    return res.data.results || res.data;

}


export async function getClassrooms() {

    const res =
        await api.get(
            "/students/classrooms/"
        );

    return res.data.results || res.data;

}