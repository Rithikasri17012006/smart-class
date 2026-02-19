import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";

export type Classroom = {
  _id: string;
  name: string;
  roomNumber: string;
  capacity: number;
};

export function useClassrooms() {
  return useQuery({
    queryKey: ["classrooms"],
    queryFn: async () => {
      const res = await api.get<Classroom[]>("/api/classrooms");
      return res.data;
    },
  });
}

export function useCreateClassroom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Classroom, "_id">) => {
      const res = await api.post("/api/classrooms", payload);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["classrooms"] }),
  });
}

export function useUpdateClassroom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; data: Partial<Omit<Classroom, "_id">> }) => {
      const res = await api.put(`/api/classrooms/${payload.id}`, payload.data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["classrooms"] }),
  });
}

export function useDeleteClassroom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/classrooms/${id}`);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["classrooms"] }),
  });
}
