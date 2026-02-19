import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { School, Users, ClipboardCheck, Armchair } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { classrooms, students, attendance } = useAppStore();
  const today = new Date().toISOString().split("T")[0];
  const todayRecords = attendance.filter((a) => a.date === today);
  const presentToday = todayRecords.filter((a) => a.status === "present").length;
  const totalCapacity = classrooms.reduce((s, c) => s + c.capacity, 0);
  const availableSeats = totalCapacity - presentToday;

  const metrics = [
    { label: "Total Classrooms", value: classrooms.length, icon: School, color: "text-primary" },
    { label: "Total Students", value: students.length, icon: Users, color: "text-secondary" },
    { label: "Today's Occupancy", value: presentToday, icon: ClipboardCheck, color: "text-primary" },
    { label: "Available Seats", value: availableSeats, icon: Armchair, color: "text-secondary" },
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
