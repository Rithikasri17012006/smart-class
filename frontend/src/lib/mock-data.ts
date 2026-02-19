export interface Classroom {
  id: string;
  name: string;
  roomNumber: string;
  capacity: number;
}

export interface Student {
  id: string;
  name: string;
  registerNumber: string;
  department: string;
  classroomId: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  classroomId: string;
  status: "present" | "absent";
}

export const initialClassrooms: Classroom[] = [
  { id: "c1", name: "Computer Science Lab", roomNumber: "101", capacity: 40 },
  { id: "c2", name: "Physics Hall", roomNumber: "202", capacity: 60 },
  { id: "c3", name: "Mathematics Room", roomNumber: "303", capacity: 35 },
  { id: "c4", name: "Chemistry Lab", roomNumber: "404", capacity: 30 },
];

export const initialStudents: Student[] = [
  { id: "s1", name: "Arjun Patel", registerNumber: "CS2024001", department: "Computer Science", classroomId: "c1" },
  { id: "s2", name: "Priya Sharma", registerNumber: "CS2024002", department: "Computer Science", classroomId: "c1" },
  { id: "s3", name: "Rahul Gupta", registerNumber: "PH2024001", department: "Physics", classroomId: "c2" },
  { id: "s4", name: "Ananya Singh", registerNumber: "PH2024002", department: "Physics", classroomId: "c2" },
  { id: "s5", name: "Vikram Kumar", registerNumber: "MA2024001", department: "Mathematics", classroomId: "c3" },
  { id: "s6", name: "Neha Reddy", registerNumber: "CH2024001", department: "Chemistry", classroomId: "c4" },
  { id: "s7", name: "Karthik Iyer", registerNumber: "CS2024003", department: "Computer Science", classroomId: "c1" },
  { id: "s8", name: "Divya Menon", registerNumber: "PH2024003", department: "Physics", classroomId: "c2" },
];

const today = new Date().toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

export const initialAttendance: AttendanceRecord[] = [
  { id: "a1", date: yesterday, studentId: "s1", classroomId: "c1", status: "present" },
  { id: "a2", date: yesterday, studentId: "s2", classroomId: "c1", status: "present" },
  { id: "a3", date: yesterday, studentId: "s3", classroomId: "c2", status: "absent" },
  { id: "a4", date: yesterday, studentId: "s4", classroomId: "c2", status: "present" },
  { id: "a5", date: yesterday, studentId: "s5", classroomId: "c3", status: "present" },
  { id: "a6", date: yesterday, studentId: "s6", classroomId: "c4", status: "present" },
  { id: "a7", date: today, studentId: "s1", classroomId: "c1", status: "present" },
  { id: "a8", date: today, studentId: "s2", classroomId: "c1", status: "absent" },
  { id: "a9", date: today, studentId: "s7", classroomId: "c1", status: "present" },
];
