export type CampusId = 'diem1' | 'diem2';

export interface SchoolClass {
  id: string; // '1A', '2A', etc.
  name: string;
  grade: number; // 1 to 5
  campus: CampusId;
  gvcn: string; // Teacher name
  studentsCount?: number;
}

export type SubjectCategory = 'TA' | 'TH' | 'ART' | 'PE' | 'TC' | 'MAIN' | 'ACTIVITY' | 'OFF';

export interface Subject {
  code: string; // 'TOAN', 'TV', 'TA', 'TH', 'GDTC', 'MT', 'AN', 'TNXH', 'KH', 'LS_DL', 'DD', 'HDTN', 'TC'
  name: string;
  shortName: string;
  category: SubjectCategory;
  defaultTeacher?: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
}

export interface Teacher {
  id: string;
  name: string;
  role: 'GVCN' | 'SPECIALIST';
  assignedClass?: string; // e.g. '1A' for GVCN
  classId?: string; // Alias for assignedClass
  roleTitle?: string; // e.g. 'Tổ Trưởng Chuyên Môn', 'Tổ Phó Chuyên Môn'
  quota?: number; // Target weekly periods (17 for Trang, 18 for Bé Năm, 19 for other GVCN)
  targetPeriods?: number; // Alias for quota
  subjects: string[]; // Subject codes
  color: string;
}

export interface TimeSlot {
  id: string; // e.g. "T2_S_1"
  day: number; // 2..6 (Thứ 2 đến Thứ 6)
  dayName: string; // 'Thứ Hai', etc.
  session: 'S' | 'C'; // Sáng, Chiều
  sessionName: string; // 'Sáng', 'Chiều'
  period: number; // 1..4 (Sáng) or 1..3 (Chiều)
  timeLabel: string; // e.g. '07:30 - 08:05'
  isFridayAfternoon?: boolean;
}

export interface ScheduledLesson {
  classId: string;
  slotId: string;
  subjectCode: string;
  subjectName: string;
  teacherName: string;
  category: SubjectCategory;
  isLocked?: boolean;
  notes?: string;
}

// Matrix: [classId][slotId] => ScheduledLesson
export type ScheduleMatrix = Record<string, Record<string, ScheduledLesson>>;

export interface ConstraintViolation {
  id: string;
  type: 'HARD' | 'SOFT';
  code: string;
  title: string;
  description: string;
  severity: 'error' | 'warning';
  classId?: string;
  teacherName?: string;
  slotId?: string;
  day?: number;
}

export interface SubjectAssignment {
  classId: string;
  subjectCode: string;
  subjectName: string;
  teacherName: string;
  periodsPerWeek: number;
  isExtracurricular?: boolean; // Bồi dưỡng môn / Tăng cường
  isHdtn2?: boolean; // Tiết 2 HĐTN do GV tăng cường/bộ môn dạy
}

export interface GVCNPolicy {
  classId: string;
  gvcnName: string;
  targetPeriods: number; // Standard 19 periods
  afternoonOffDays: number[]; // e.g. [3, 5] for Tuesday & Thursday afternoon off
  tcSubject: 'TOAN' | 'TV' | 'BOTH'; // 1-2 periods of Tăng cường Toán/TV
  tcPeriods: number; // 1 or 2
}

export interface SpecialistPolicy {
  teacherId: string;
  teacherName: string;
  mainSubjects: string[];
  boiDuongSubject: string; // Môn bồi dưỡng phụ trách
  kiemNhiemHdtn: boolean; // Kiêm nhiệm dạy HĐTN tiết 2
  assignedClasses: string[];
}

export interface HardConstraintsConfig {
  noTeacherCollision: boolean; // Không trùng giờ giáo viên (0 xung đột)
  fixedMondayFlagSalute: boolean; // Tiết 1 Thứ Hai: Chào cờ (SHDC) do GVCN phụ trách
  fixedFridayClassActivity: boolean; // Tiết 4 Thứ Sáu: Sinh hoạt lớp (SHL) do GVCN phụ trách
  strictQuotaFulfilled: boolean; // Đảm bảo đủ 100% định mức số tiết/tuần (32 tiết/lớp)
  fridayAfternoonOff: boolean; // Nghỉ sinh hoạt chuyên môn chiều Thứ 6 toàn trường
  limitBghQuota: boolean; // Giới hạn tiết dạy BGH (Thầy Quan Phó Hiệu trưởng: đúng 2 tiết)
  bghTeacherName?: string;
  bghMaxPeriods?: number;
  bghSubjectCode?: string;
  bghGrades?: number[];
  maxComputerRoomSimultaneous: number; // Giới hạn số lớp học Tin học đồng thời (số phòng máy)
}

export interface SoftConstraintsConfig {
  prioritizeMorningCoreSubjects: boolean; // Toán & Tiếng Việt ưu tiên xếp buổi sáng (Tiết 1, 2, 3)
  avoidNoonPE: boolean; // Thể dục (GDTC) tránh tiết trưa nắng nóng (Tiết 4 sáng, Tiết 3 chiều)
  avoidMondayPeriod1PE: boolean; // Thể dục tránh xếp vào tiết đầu tuần sau Chào cờ
  spreadSubjectsEvenly: boolean; // Rải đều các môn trong tuần (tránh dồn quá nhiều tiết khó 1 ngày)
  minimizeTeacherGaps: boolean; // Hạn chế tiết trống (lủng tiết) trong buổi dạy của GV
  maxPeriodsPerSessionPerTeacher: number; // Giới hạn số tiết tối đa trong 1 buổi của GV (mặc định 4)
  allowDoublePeriodsForReading: boolean; // Ưu tiên xếp cặp 2 tiết liền cho phân môn Tập đọc (TV)
  gvcnAfternoonOffAllowance: boolean; // GVCN được nghỉ ít nhất 1-2 buổi chiều trong tuần
}

export interface ConstraintConfig {
  hard: HardConstraintsConfig;
  soft: SoftConstraintsConfig;
}

export interface SchoolProfile {
  id: string;
  name: string;
  branch: string;
  academicYear: string;
  standardPeriods: number; // Standard 32 periods
  classes: SchoolClass[];
  teachers: Teacher[];
  assignments: SubjectAssignment[];
}

