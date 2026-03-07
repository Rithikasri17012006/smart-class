import { Card, CardContent } from "@/components/ui/card";
import { School, Users, ClipboardCheck, Armchair } from "lucide-react";
import { motion } from "framer-motion";
import { useDashboardStats } from "@/lib/dashboard.api";

export default function Dashboard() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) return <div className="p-6">Loading...</div>;

  const metrics = [
    { label: "Total Classrooms", value: data?.classroomsCount ?? 0, icon: School, color: "text-primary" },
    { label: "Total Students", value: data?.studentsCount ?? 0, icon: Users, color: "text-secondary" },
    { label: "Today's Occupancy", value: data?.presentToday ?? 0, icon: ClipboardCheck, color: "text-primary" },
    { label: "Available Seats", value: data?.availableSeats ?? 0, icon: Armchair, color: "text-secondary" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        >
          <Card className="group cursor-default transition-shadow hover:shadow-lg">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${m.color}`}>
                <m.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="text-3xl font-bold">{m.value}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}