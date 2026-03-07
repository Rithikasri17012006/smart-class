import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

export type AttendanceHistoryRow = {
  _id: string;
  date: string;
  status: "present" | "absent";
  student: { _id: string; name: string; registerNumber: string };
  classroom: string;
};

export function useAttendanceHistory(classroomId: string, from: string, to: string) {
  return useQuery({
    queryKey: ["attendance-history", classroomId, from, to],
    enabled: !!classroomId && !!from && !!to,
    queryFn: async () => {
      const res = await api.get<AttendanceHistoryRow[]>(
        `/api/attendance/history?classroomId=${classroomId}&from=${from}&to=${to}`
      );
      return res.data;
    },
  });
}