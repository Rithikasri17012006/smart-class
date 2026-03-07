import { useQuery } from "@tanstack/react-query";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export type DashboardStats = {
  today: string;
  classroomsCount: number;
  studentsCount: number;
  presentToday: number;
  totalCapacity: number;
  availableSeats: number;
};

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch(`${API}/api/dashboard`);
      if (!res.ok) throw new Error("Failed to load dashboard stats");
      return res.json();
    },
  });
}