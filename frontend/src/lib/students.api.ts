import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";

export type Student = {
  _id: string;
  name: string;
  registerNumber: string;
  department: string;
  classroom: string; // ObjectId
};

export function useStudents(classroomId?: string) {
  return useQuery({
    queryKey: ["students", classroomId || "all"],
    queryFn: async () => {
      const url = classroomId
        ? `/api/students?classroomId=${classroomId}`
        : "/api/students";
      const res = await api.get<Student[]>(url);
      return res.data;
    },
  });
}

export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Student, "_id">) => {
      const res = await api.post("/api/students", payload);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useUpdateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; data: Partial<Omit<Student, "_id">> }) => {
      const res = await api.put(`/api/students/${payload.id}`, payload.data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/students/${id}`);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}