import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Classroom, Student, AttendanceRecord,
  initialClassrooms, initialStudents, initialAttendance,
} from "./mock-data";

interface AppState {
  classrooms: Classroom[];
  students: Student[];
  attendance: AttendanceRecord[];
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  addClassroom: (c: Omit<Classroom, "id">) => void;
  updateClassroom: (c: Classroom) => void;
  deleteClassroom: (id: string) => void;
  addStudent: (s: Omit<Student, "id">) => void;
  updateStudent: (s: Student) => void;
  deleteStudent: (id: string) => void;
  saveAttendance: (records: AttendanceRecord[]) => void;
}

const AppContext = createContext<AppState | null>(null);

let idCounter = 100;
const genId = (prefix: string) => `${prefix}${++idCounter}`;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [classrooms, setClassrooms] = useState<Classroom[]>(initialClassrooms);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => setIsLoggedIn(true), []);
  const logout = useCallback(() => setIsLoggedIn(false), []);

  const addClassroom = useCallback((c: Omit<Classroom, "id">) => {
    setClassrooms((prev) => [...prev, { ...c, id: genId("c") }]);
  }, []);
  const updateClassroom = useCallback((c: Classroom) => {
    setClassrooms((prev) => prev.map((x) => (x.id === c.id ? c : x)));
  }, []);
  const deleteClassroom = useCallback((id: string) => {
    setClassrooms((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const addStudent = useCallback((s: Omit<Student, "id">) => {
    setStudents((prev) => [...prev, { ...s, id: genId("s") }]);
  }, []);
  const updateStudent = useCallback((s: Student) => {
    setStudents((prev) => prev.map((x) => (x.id === s.id ? s : x)));
  }, []);
  const deleteStudent = useCallback((id: string) => {
    setStudents((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const saveAttendance = useCallback((records: AttendanceRecord[]) => {
    setAttendance((prev) => {
      const key = (r: AttendanceRecord) => `${r.date}-${r.studentId}`;
      const newKeys = new Set(records.map(key));
      return [...prev.filter((r) => !newKeys.has(key(r))), ...records];
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        classrooms, students, attendance, isLoggedIn,
        login, logout,
        addClassroom, updateClassroom, deleteClassroom,
        addStudent, updateStudent, deleteStudent,
        saveAttendance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used within AppProvider");
  return ctx;
}
