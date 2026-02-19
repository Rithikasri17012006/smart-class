import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Save, Users } from "lucide-react";
import type { AttendanceRecord } from "@/lib/mock-data";

export default function Attendance() {
  const { classrooms, students, saveAttendance } = useAppStore();
  const { toast } = useToast();
  const [selectedClassroom, setSelectedClassroom] = useState(classrooms[0]?.id ?? "");
  const today = new Date().toISOString().split("T")[0];

  const classroomStudents = useMemo(
    () => students.filter((s) => s.classroomId === selectedClassroom),
    [students, selectedClassroom]
  );

  const [statuses, setStatuses] = useState<Record<string, boolean>>({});

  const toggleStatus = (studentId: string) => {
    setStatuses((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const isPresent = (studentId: string) => statuses[studentId] ?? false;
  const presentCount = classroomStudents.filter((s) => isPresent(s.id)).length;
  const classroom = classrooms.find((c) => c.id === selectedClassroom);
  const capacity = classroom?.capacity ?? 0;
  const available = capacity - presentCount;
  const overCapacity = presentCount > capacity;

  const handleSave = () => {
    const records: AttendanceRecord[] = classroomStudents.map((s, i) => ({
      id: `att-${Date.now()}-${i}`,
      date: today,
      studentId: s.id,
      classroomId: selectedClassroom,
      status: isPresent(s.id) ? "present" : "absent",
    }));
    saveAttendance(records);
    toast({ title: "Attendance saved successfully!" });
  };

  const handleClassroomChange = (value: string) => {
    setSelectedClassroom(value);
    setStatuses({});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Select Classroom</label>
          <Select value={selectedClassroom} onValueChange={handleClassroomChange}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {classrooms.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name} ({c.roomNumber})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSave} disabled={classroomStudents.length === 0}>
          <Save className="mr-2 h-4 w-4" />Save Attendance
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
            {overCapacity && <Badge variant="destructive" className="ml-auto">Over Capacity</Badge>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Student List — {today}</CardTitle>
        </CardHeader>
        <CardContent>
          {classroomStudents.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No students in this classroom.</p>
          ) : (
            <div className="space-y-2">
              {classroomStudents.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-sm text-muted-foreground">{s.registerNumber}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${isPresent(s.id) ? "text-secondary" : "text-destructive"}`}>
                      {isPresent(s.id) ? "Present" : "Absent"}
                    </span>
                    <Switch checked={isPresent(s.id)} onCheckedChange={() => toggleStatus(s.id)} />
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
