import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableHead, TableBody, TableRow, TableCell,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

export default function AttendanceHistory() {
  const { attendance, students, classrooms } = useAppStore();
  const [filterClassroom, setFilterClassroom] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  const studentName = (id: string) => students.find((s) => s.id === id)?.name ?? "Unknown";
  const classroomName = (id: string) => classrooms.find((c) => c.id === id)?.name ?? "Unknown";

  const filtered = useMemo(() => {
    return attendance.filter((a) => {
      const matchClassroom = filterClassroom === "all" || a.classroomId === filterClassroom;
      const matchDate = !filterDate || a.date === filterDate;
      return matchClassroom && matchDate;
    });
  }, [attendance, filterClassroom, filterDate]);

  // Calculate attendance percentage per student
  const studentStats = useMemo(() => {
    const stats: Record<string, { total: number; present: number }> = {};
    const relevantRecords = attendance.filter(
      (a) => filterClassroom === "all" || a.classroomId === filterClassroom
    );
    relevantRecords.forEach((a) => {
      if (!stats[a.studentId]) stats[a.studentId] = { total: 0, present: 0 };
      stats[a.studentId].total++;
      if (a.status === "present") stats[a.studentId].present++;
    });
    return stats;
  }, [attendance, filterClassroom]);

  const getPercentage = (studentId: string) => {
    const s = studentStats[studentId];
    if (!s || s.total === 0) return 0;
    return Math.round((s.present / s.total) * 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative">
          <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="date"
            className="pl-9 w-48"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <Select value={filterClassroom} onValueChange={setFilterClassroom}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Filter classroom" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classrooms</SelectItem>
            {classrooms.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="hidden sm:table-cell">Classroom</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Attendance %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No attendance records found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.date}</TableCell>
                    <TableCell className="font-medium">{studentName(a.studentId)}</TableCell>
                    <TableCell className="hidden sm:table-cell">{classroomName(a.classroomId)}</TableCell>
                    <TableCell>
                      <Badge variant={a.status === "present" ? "secondary" : "destructive"}>
                        {a.status === "present" ? "Present" : "Absent"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {getPercentage(a.studentId)}%
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
