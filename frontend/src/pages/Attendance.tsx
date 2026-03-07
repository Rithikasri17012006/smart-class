import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Save, Users } from "lucide-react";

import { useClassrooms } from "@/lib/classrooms.api";
import { useStudents } from "@/lib/students.api";
import { useAttendance, useSaveAttendance } from "@/lib/attendance.api";

export default function Attendance() {
  const { toast } = useToast();

  const { data: classrooms = [], isLoading: classroomsLoading } = useClassrooms();
  const { data: students = [], isLoading: studentsLoading } = useStudents();

  const today = new Date().toISOString().split("T")[0];

  const [selectedClassroom, setSelectedClassroom] = useState<string>("");

  // Set default classroom once classrooms load
  useEffect(() => {
    if (!selectedClassroom && classrooms.length > 0) {
      setSelectedClassroom(classrooms[0]._id);
    }
  }, [classrooms, selectedClassroom]);

  // ✅ IMPORTANT: only call attendance query when classroom is selected
  const {
    data: todayAttendance = [],
    isLoading: attendanceLoading,
  } = useAttendance(today, selectedClassroom, {
    enabled: !!selectedClassroom,
  } as any);

  const saveAttendance = useSaveAttendance();

  // Students that belong to selected classroom (supports string OR populated object)
  const classroomStudents = useMemo(() => {
    if (!selectedClassroom) return [];

    return students.filter((s: any) => {
      const clsId =
        typeof s.classroom === "string"
          ? s.classroom
          : s.classroom?._id;

      return clsId === selectedClassroom;
    });
  }, [students, selectedClassroom]);

  // statuses map: studentId -> present?
  const [statuses, setStatuses] = useState<Record<string, boolean>>({});

  // Prefill statuses from DB attendance
  useEffect(() => {
    if (!selectedClassroom) return;

    const map: Record<string, boolean> = {};

    // default all absent for this classroom
    classroomStudents.forEach((s: any) => {
      map[s._id] = false;
    });

    // mark present from DB response
    todayAttendance.forEach((a: any) => {
      const sid =
        typeof a.student === "string"
          ? a.student
          : a.student?._id;

      if (sid && map.hasOwnProperty(sid)) {
        map[sid] = a.status === "present";
      }
    });

    setStatuses(map);
  }, [selectedClassroom, classroomStudents, todayAttendance]);

  const toggleStatus = (studentId: string) => {
    setStatuses((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const isPresent = (studentId: string) => statuses[studentId] ?? false;

  const presentCount = classroomStudents.filter((s: any) => isPresent(s._id)).length;

  const classroom = classrooms.find((c: any) => c._id === selectedClassroom);
  const capacity = classroom?.capacity ?? 0;
  const available = capacity - presentCount;
  const overCapacity = presentCount > capacity;

  const handleSave = () => {
    if (!selectedClassroom) return;

    const records: { studentId: string; status: "present" | "absent" }[] =
      classroomStudents.map((s: any) => ({
        studentId: s._id,
        status: isPresent(s._id) ? "present" : "absent",
      }));

    saveAttendance.mutate(
      { date: today, classroomId: selectedClassroom, records },
      {
        onSuccess: () => toast({ title: "Attendance saved successfully!" }),
        onError: (err: any) => {
          toast({
            title: "Failed to save attendance",
            description: err?.message ?? "Try again",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleClassroomChange = (value: string) => {
    setSelectedClassroom(value);
  };

  if (classroomsLoading || studentsLoading || (selectedClassroom && attendanceLoading)) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Select Classroom
          </label>
          <Select value={selectedClassroom} onValueChange={handleClassroomChange}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a classroom" />
            </SelectTrigger>
            <SelectContent>
              {classrooms.map((c: any) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name} ({c.roomNumber})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSave}
          disabled={!selectedClassroom || classroomStudents.length === 0 || saveAttendance.isPending}
        >
          <Save className="mr-2 h-4 w-4" />
          {saveAttendance.isPending ? "Saving..." : "Save Attendance"}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Capacity</p>
              <p className="text-xl font-bold">{capacity}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Users className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-xs text-muted-foreground">Present</p>
              <p className="text-xl font-bold">{presentCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className={overCapacity ? "border-destructive" : ""}>
          <CardContent className="flex items-center gap-3 p-4">
            {overCapacity && <AlertTriangle className="h-5 w-5 text-destructive" />}
            <div>
              <p className="text-xs text-muted-foreground">Available Seats</p>
              <p className="text-xl font-bold">{available}</p>
            </div>
            {overCapacity && (
              <Badge variant="destructive" className="ml-auto">
                Over Capacity
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Student List — {today}</CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedClassroom ? (
            <p className="text-center py-8 text-muted-foreground">
              Please select a classroom.
            </p>
          ) : classroomStudents.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No students in this classroom.
            </p>
          ) : (
            <div className="space-y-2">
              {classroomStudents.map((s: any) => (
                <div
                  key={s._id}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-sm text-muted-foreground">{s.registerNumber}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-medium ${
                        isPresent(s._id) ? "text-secondary" : "text-destructive"
                      }`}
                    >
                      {isPresent(s._id) ? "Present" : "Absent"}
                    </span>
                    <Switch
                      checked={isPresent(s._id)}
                      onCheckedChange={() => toggleStatus(s._id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}