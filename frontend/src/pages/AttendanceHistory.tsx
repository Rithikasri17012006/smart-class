import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

import { useClassrooms } from "@/lib/classrooms.api";
import { useStudents } from "@/lib/students.api";
import { useAttendanceHistory } from "@/lib/attendanceHistory.api";

export default function AttendanceHistory() {
  const { data: classrooms = [], isLoading: classroomsLoading } = useClassrooms();
  const { data: students = [], isLoading: studentsLoading } = useStudents();

  const [filterClassroom, setFilterClassroom] = useState<string>("all");

  // default range: this month -> today
  const today = new Date().toISOString().split("T")[0];
  const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const [from, setFrom] = useState(firstDay);
  const [to, setTo] = useState(today);

  const classroomIdToQuery = filterClassroom === "all" ? "" : filterClassroom;

  const { data: records = [], isLoading: historyLoading } = useAttendanceHistory(
    classroomIdToQuery,
    from,
    to
  );

  // helpers
  const studentName = (id: string) =>
    students.find((s: any) => s._id === id)?.name ?? "Unknown";

  const classroomName = (id: string) =>
    classrooms.find((c: any) => c._id === id)?.name ?? "Unknown";

  // If backend populated student object, normalize studentId
 const normalized = useMemo(() => {
  return records.map((r: any) => {
    const classroomObj = typeof r.classroom === "string" ? null : r.classroom;
    const studentObj = typeof r.student === "string" ? null : r.student;

    const classroomId =
      typeof r.classroom === "string" ? r.classroom : r.classroom?._id;

    const studentId =
      typeof r.student === "string" ? r.student : r.student?._id;

    return {
      _id: r._id,
      date: r.date,
      status: r.status,
      classroomId,
      classroomLabel: classroomObj
        ? `${classroomObj.name} (${classroomObj.roomNumber})`
        : classroomName(classroomId),
      studentId,
      studentName: studentObj?.name ?? studentName(studentId),
    };
  });
}, [records, classrooms, students]);

  // Calculate attendance percentage per student (based on fetched history range)
  const studentStats = useMemo(() => {
    const stats: Record<string, { total: number; present: number }> = {};

    normalized.forEach((a) => {
      if (!a.studentId) return;
      if (!stats[a.studentId]) stats[a.studentId] = { total: 0, present: 0 };
      stats[a.studentId].total++;
      if (a.status === "present") stats[a.studentId].present++;
    });

    return stats;
  }, [normalized]);

  const getPercentage = (studentId: string) => {
    const s = studentStats[studentId];
    if (!s || s.total === 0) return 0;
    return Math.round((s.present / s.total) * 100);
  };

  const isLoading = classroomsLoading || studentsLoading || historyLoading;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* From date */}
        <div className="relative">
          <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="date"
            className="pl-9 w-48"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        {/* To date */}
        <div className="relative">
          <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="date"
            className="pl-9 w-48"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <Select value={filterClassroom} onValueChange={setFilterClassroom}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Filter classroom" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classrooms</SelectItem>
            {classrooms.map((c: any) => (
              <SelectItem key={c._id} value={c._id}>
                {c.name}
              </SelectItem>
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : normalized.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No attendance records found.
                  </TableCell>
                </TableRow>
              ) : (
                normalized.map((a) => (
                  <TableRow key={a._id}>
                    <TableCell>{a.date}</TableCell>
                    <TableCell className="font-medium">{a.studentName}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {a.classroomLabel}
                    </TableCell>
                    <TableCell>
                      <Badge variant={a.status === "present" ? "secondary" : "destructive"}>
                        {a.status === "present" ? "Present" : "Absent"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {a.studentId ? `${getPercentage(a.studentId)}%` : "—"}
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