import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";

export type AttendanceStatus = "present" | "absent";

export type AttendanceRow = {
  _id: string;
  date: string;
  student: { _id: string; name: string; registerNumber: string };
  classroom: { _id: string; name: string; roomNumber: string };
  status: AttendanceStatus;
};

export function useAttendance(date?: string, classroomId?: string, p0?: any) {
  return useQuery({
    queryKey: ["attendance", date || "none", classroomId || "none"],
    enabled: !!date && !!classroomId,
    queryFn: async () => {
      const res = await api.get<AttendanceRow[]>(
        `/api/attendance?date=${date}&classroomId=${classroomId}`
      );
      return res.data;
    },
  });
}

export function useSaveAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      date: string;
      classroomId: string;
      records: { studentId: string; status: AttendanceStatus }[];
    }) => {
      const res = await api.post("/api/attendance", payload);
      return res.data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["attendance", vars.date, vars.classroomId] });
    },
  });
}