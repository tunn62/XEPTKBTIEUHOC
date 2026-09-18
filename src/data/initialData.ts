import { SchoolClass, Subject, Teacher, TimeSlot } from '../types';

export const SCHOOL_INFO = {
  name: 'TRƯỜNG TIỂU HỌC TÂN THẠNH',
  branch: 'PHÂN HIỆU TÂN BÌNH',
  academicYear: '2026 - 2027',
  author: 'Chuyên gia Giáo dục & Kỹ sư Phần mềm Tối ưu hóa CSP',
  technology: 'Google OR-Tools (CP-SAT Solver) & OpenPyXL Excel Export',
  standardPeriods: 32,
};

export const CLASSES_DIEM1: SchoolClass[] = [
  { id: '1A', name: 'Lớp 1A', grade: 1, campus: 'diem1', gvcn: 'Chi', studentsCount: 32 },
  { id: '2A', name: 'Lớp 2A', grade: 2, campus: 'diem1', gvcn: 'Trang', studentsCount: 30 },
  { id: '3A', name: 'Lớp 3A', grade: 3, campus: 'diem1', gvcn: 'Dương', studentsCount: 33 },
  { id: '4A', name: 'Lớp 4A', grade: 4, campus: 'diem1', gvcn: 'Hằng', studentsCount: 31 },
  { id: '5A', name: 'Lớp 5A', grade: 5, campus: 'diem1', gvcn: 'Tuấn', studentsCount: 29 },
];

export const CLASSES_DIEM2: SchoolClass[] = [
  { id: '1B', name: 'Lớp 1B', grade: 1, campus: 'diem2', gvcn: 'Bé Năm', studentsCount: 28 },
  { id: '2B', name: 'Lớp 2B', grade: 2, campus: 'diem2', gvcn: 'Chinh', studentsCount: 29 },
  { id: '3B', name: 'Lớp 3B', grade: 3, campus: 'diem2', gvcn: 'Đạt', studentsCount: 30 },
  { id: '4B', name: 'Lớp 4B', grade: 4, campus: 'diem2', gvcn: 'Yến', studentsCount: 27 },
  { id: '5B', name: 'Lớp 5B', grade: 5, campus: 'diem2', gvcn: 'Huế', studentsCount: 31 },
];

export const ALL_CLASSES: SchoolClass[] = [...CLASSES_DIEM1, ...CLASSES_DIEM2];

export const GVCN_MAP: Record<string, string> = {
  '1A': 'Chi',
  '2A': 'Trang',
  '3A': 'Dương',
  '4A': 'Hằng',
  '5A': 'Tuấn',
  '1B': 'Bé Năm',
  '2B': 'Chinh',
  '3B': 'Đạt',
  '4B': 'Yến',
  '5B': 'Huế',
};

export const SPECIALIST_TEACHERS = ['Tâm', 'Thy', 'Phước', 'Thịnh', 'Nhàn', 'Nương', 'Phương', 'Quan'];

export const ALL_TEACHERS: Teacher[] = [
  // GVCN Điểm 1
  { id: 'Chi', name: 'Chi', role: 'GVCN', assignedClass: '1A', roleTitle: 'Giáo Viên Chủ Nhiệm', quota: 19, targetPeriods: 19, subjects: ['TV', 'TOAN', 'TNXH', 'DD', 'HDTN', 'TC'], color: '#3B82F6' },
  { id: 'Trang', name: 'Trang', role: 'GVCN', assignedClass: '2A', roleTitle: 'Tổ Trưởng Chuyên Môn', quota: 16, targetPeriods: 16, subjects: ['TV', 'TOAN', 'TNXH', 'DD', 'HDTN', 'TC'], color: '#06B6D4' },
  { id: 'Dương', name: 'Dương', role: 'GVCN', assignedClass: '3A', roleTitle: 'Giáo Viên Chủ Nhiệm', quota: 19, targetPeriods: 19, subjects: ['TV', 'TOAN', 'TNXH', 'DD', 'HDTN', 'TC'], color: '#0EA5E9' },
  { id: 'Hằng', name: 'Hằng', role: 'GVCN', assignedClass: '4A', roleTitle: 'Giáo Viên Chủ Nhiệm', quota: 19, targetPeriods: 19, subjects: ['TV', 'TOAN', 'KH', 'LS_DL', 'DD', 'HDTN', 'TC'], color: '#6366F1' },
  { id: 'Tuấn', name: 'Tuấn', role: 'GVCN', assignedClass: '5A', roleTitle: 'Giáo Viên Chủ Nhiệm', quota: 19, targetPeriods: 19, subjects: ['TV', 'TOAN', 'KH', 'LS_DL', 'DD', 'HDTN', 'TC'], color: '#8B5CF6' },
  // GVCN Điểm 2
  { id: 'Bé Năm', name: 'Bé Năm', role: 'GVCN', assignedClass: '1B', roleTitle: 'Tổ Phó Chuyên Môn', quota: 19, targetPeriods: 19, subjects: ['TV', 'TOAN', 'TNXH', 'DD', 'HDTN', 'TC'], color: '#EC4899' },
  { id: 'Chinh', name: 'Chinh', role: 'GVCN', assignedClass: '2B', roleTitle: 'Giáo Viên Chủ Nhiệm', quota: 19, targetPeriods: 19, subjects: ['TV', 'TOAN', 'TNXH', 'DD', 'HDTN', 'TC'], color: '#F43F5E' },
  { id: 'Đạt', name: 'Đạt', role: 'GVCN', assignedClass: '3B', roleTitle: 'Giáo Viên Chủ Nhiệm', quota: 19, targetPeriods: 19, subjects: ['TV', 'TOAN', 'TNXH', 'DD', 'HDTN', 'TC'], color: '#E11D48' },
  { id: 'Yến', name: 'Yến', role: 'GVCN', assignedClass: '4B', roleTitle: 'Giáo Viên Chủ Nhiệm', quota: 19, targetPeriods: 19, subjects: ['TV', 'TOAN', 'KH', 'LS_DL', 'DD', 'HDTN', 'TC'], color: '#D97706' },
  { id: 'Huế', name: 'Huế', role: 'GVCN', assignedClass: '5B', roleTitle: 'Giáo Viên Chủ Nhiệm', quota: 20, targetPeriods: 20, subjects: ['TV', 'TOAN', 'KH', 'LS_DL', 'DD', 'HDTN', 'TC'], color: '#B45309' },
  // Specialist Teachers
  { id: 'Nương', name: 'Nương', role: 'SPECIALIST', roleTitle: 'Giáo Viên Tiếng Anh', quota: 20, targetPeriods: 20, subjects: ['TA', 'BD_TA'], color: '#CA8A04' },
  { id: 'Phương', name: 'Phương', role: 'SPECIALIST', roleTitle: 'Giáo Viên Tin Học (Phụ trách CNTT)', quota: 10, targetPeriods: 10, subjects: ['TH'], color: '#0284C7' },
  { id: 'Thịnh', name: 'Thịnh', role: 'SPECIALIST', roleTitle: 'Giáo Viên GDTC', quota: 20, targetPeriods: 20, subjects: ['GDTC', 'BD_TD'], color: '#16A34A' },
  { id: 'Tâm', name: 'Tâm', role: 'SPECIALIST', roleTitle: 'Giáo Viên Âm Nhạc (10 chính + 10 BDAN)', quota: 20, targetPeriods: 20, subjects: ['AN', 'BD_AN'], color: '#DB2777' },
  { id: 'Thy', name: 'Thy', role: 'SPECIALIST', roleTitle: 'Giáo Viên Mỹ Thuật & HĐTN (10 chính + 10 BDMT + HĐTN)', quota: 22, targetPeriods: 22, subjects: ['MT', 'BD_MT', 'HDTN_CD'], color: '#9333EA' },
  { id: 'Phước', name: 'Phước', role: 'SPECIALIST', roleTitle: 'Giáo Viên TNXH & Tăng Cường (19 tiết)', quota: 19, targetPeriods: 19, subjects: ['TNXH', 'TC', 'TC_TOAN', 'TC_TV', 'HDTN_CD'], color: '#EA580C' },
  { id: 'Nhàn', name: 'Nhàn', role: 'SPECIALIST', roleTitle: 'Giáo Viên Tăng Cường', quota: 16, targetPeriods: 16, subjects: ['TC', 'HDTN_CD', 'TC_TV', 'TC_TOAN'], color: '#D97706' },
  { id: 'Quan', name: 'Quan', role: 'SPECIALIST', roleTitle: 'Phó Hiệu Trưởng (Phụ trách Đạo đức Khối 5)', quota: 2, targetPeriods: 2, subjects: ['DD'], color: '#4F46E5' },
];

export const SUBJECTS: Record<string, Subject> = {
  TOAN: {
    code: 'TOAN',
    name: 'Toán',
    shortName: 'Toán',
    category: 'MAIN',
    colorBg: '#EEF2FF',
    colorBorder: '#C7D2FE',
    colorText: '#312E81',
  },
  TV: {
    code: 'TV',
    name: 'Tiếng Việt',
    shortName: 'T.Việt',
    category: 'MAIN',
    colorBg: '#FEF2F2',
    colorBorder: '#FECACA',
    colorText: '#991B1B',
  },
  TA: {
    code: 'TA',
    name: 'Tiếng Anh',
    shortName: 'T.Anh',
    category: 'TA',
    defaultTeacher: 'Nương',
    colorBg: '#FEF08A', // Exactly from openpyxl: FEF08A (Vàng nhạt)
    colorBorder: '#FDE047',
    colorText: '#854D0E',
  },
  TH: {
    code: 'TH',
    name: 'Tin học & CN',
    shortName: 'Tin học',
    category: 'TH',
    defaultTeacher: 'Phương',
    colorBg: '#BAE6FD', // Exactly from openpyxl: BAE6FD (Xanh dương nhạt)
    colorBorder: '#7DD3FC',
    colorText: '#0369A1',
  },
  GDTC: {
    code: 'GDTC',
    name: 'Giáo dục Thể chất',
    shortName: 'Thể dục',
    category: 'PE',
    defaultTeacher: 'Thịnh',
    colorBg: '#BBF7D0', // Exactly from openpyxl: BBF7D0 (Xanh lá nhạt)
    colorBorder: '#86EFAC',
    colorText: '#166534',
  },
  MT: {
    code: 'MT',
    name: 'Mỹ thuật',
    shortName: 'Mỹ thuật',
    category: 'ART',
    colorBg: '#FBCFE8', // Exactly from openpyxl: FBCFE8 (Hồng/tím nhạt)
    colorBorder: '#F472B6',
    colorText: '#9D174D',
  },
  AN: {
    code: 'AN',
    name: 'Âm nhạc',
    shortName: 'Âm nhạc',
    category: 'ART',
    colorBg: '#FBCFE8', // Exactly from openpyxl: FBCFE8 (Hồng/tím nhạt)
    colorBorder: '#F472B6',
    colorText: '#9D174D',
  },
  TNXH: {
    code: 'TNXH',
    name: 'Tự nhiên & Xã hội',
    shortName: 'TN&XH',
    category: 'MAIN',
    colorBg: '#CCFBF1',
    colorBorder: '#99F6E4',
    colorText: '#115E59',
  },
  KH: {
    code: 'KH',
    name: 'Khoa học',
    shortName: 'Khoa học',
    category: 'MAIN',
    colorBg: '#CCFBF1',
    colorBorder: '#99F6E4',
    colorText: '#115E59',
  },
  LS_DL: {
    code: 'LS_DL',
    name: 'Lịch sử & Địa lý',
    shortName: 'LS&ĐL',
    category: 'MAIN',
    colorBg: '#F3E8FF',
    colorBorder: '#E9D5FF',
    colorText: '#6B21A8',
  },
  DD: {
    code: 'DD',
    name: 'Đạo đức',
    shortName: 'Đạo đức',
    category: 'MAIN',
    colorBg: '#FEF9C3',
    colorBorder: '#FEF08A',
    colorText: '#854D0E',
  },
  HDTN: {
    code: 'HDTN',
    name: 'HĐ Trải nghiệm',
    shortName: 'HĐTN',
    category: 'ACTIVITY',
    colorBg: '#F1F5F9',
    colorBorder: '#CBD5E1',
    colorText: '#334155',
  },
  SHDC: {
    code: 'SHDC',
    name: 'Sinh hoạt Dưới cờ',
    shortName: 'Chào cờ',
    category: 'ACTIVITY',
    colorBg: '#E2E8F0',
    colorBorder: '#94A3B8',
    colorText: '#1E293B',
  },
  SHL: {
    code: 'SHL',
    name: 'Sinh hoạt Lớp',
    shortName: 'S.H.Lớp',
    category: 'ACTIVITY',
    colorBg: '#E2E8F0',
    colorBorder: '#94A3B8',
    colorText: '#1E293B',
  },
  TC: {
    code: 'TC',
    name: 'Tăng cường / Kỹ năng',
    shortName: 'T.Cường',
    category: 'TC',
    colorBg: '#FED7AA', // Exactly from openpyxl: FED7AA (Cam nhạt)
    colorBorder: '#FDBA74',
    colorText: '#9A3412',
  },
  TC_TOAN: {
    code: 'TC_TOAN',
    name: 'Tăng cường Toán',
    shortName: 'TC-Toán',
    category: 'TC',
    colorBg: '#FED7AA',
    colorBorder: '#FDBA74',
    colorText: '#9A3412',
  },
  TC_TV: {
    code: 'TC_TV',
    name: 'Tăng cường Tiếng Việt',
    shortName: 'TC-T.Việt',
    category: 'TC',
    colorBg: '#FED7AA',
    colorBorder: '#FDBA74',
    colorText: '#9A3412',
  },
  HDTN_CD: {
    code: 'HDTN_CD',
    name: 'HĐTN (Tiết 2 - Theo chủ đề)',
    shortName: 'HĐTN(C.Đề)',
    category: 'ACTIVITY',
    colorBg: '#E0E7FF',
    colorBorder: '#C7D2FE',
    colorText: '#3730A3',
  },
  BD_TA: {
    code: 'BD_TA',
    name: 'Bồi dưỡng Tiếng Anh',
    shortName: 'BD-T.Anh',
    category: 'TA',
    defaultTeacher: 'Nương',
    colorBg: '#FEF08A',
    colorBorder: '#FDE047',
    colorText: '#854D0E',
  },
  BD_TH: {
    code: 'BD_TH',
    name: 'Bồi dưỡng Tin học',
    shortName: 'BD-Tin',
    category: 'TH',
    defaultTeacher: 'Phương',
    colorBg: '#BAE6FD',
    colorBorder: '#7DD3FC',
    colorText: '#0369A1',
  },
  BD_TD: {
    code: 'BD_TD',
    name: 'Bồi dưỡng Thể dục TT',
    shortName: 'BD-T.Dục',
    category: 'PE',
    defaultTeacher: 'Thịnh',
    colorBg: '#BBF7D0',
    colorBorder: '#86EFAC',
    colorText: '#166534',
  },
  BD_NT: {
    code: 'BD_NT',
    name: 'Bồi dưỡng Nghệ thuật',
    shortName: 'BD-N.Thuật',
    category: 'ART',
    colorBg: '#FBCFE8',
    colorBorder: '#F472B6',
    colorText: '#9D174D',
  },
  BD_AN: {
    code: 'BD_AN',
    name: 'Bồi dưỡng Âm nhạc',
    shortName: 'BD-Â.Nhạc',
    category: 'ART',
    defaultTeacher: 'Tâm',
    colorBg: '#FBCFE8',
    colorBorder: '#F472B6',
    colorText: '#9D174D',
  },
  BD_MT: {
    code: 'BD_MT',
    name: 'Bồi dưỡng Mỹ thuật',
    shortName: 'BD-M.Thuật',
    category: 'ART',
    defaultTeacher: 'Thy',
    colorBg: '#FBCFE8',
    colorBorder: '#F472B6',
    colorText: '#9D174D',
  },
  OFF: {
    code: 'OFF',
    name: 'Nghỉ chiều Thứ 6',
    shortName: 'Nghỉ',
    category: 'OFF',
    colorBg: '#DCFCE7',
    colorBorder: '#86EFAC',
    colorText: '#15803D',
  },
};

// Default policy for the 10 GVCN:
// - Cô Trang (GVCN 2A + Tổ Trưởng): 17 tiết
// - Cô Năm (GVCN 1B + Tổ Phó): 18 tiết
// - Các GVCN khác: 19 tiết
// - Tất cả GVCN đều được nghỉ ít nhất 2 buổi chiều trong tuần (Thứ 2 - Thứ 5).
export interface GvcnPolicy {
  targetPeriods: number;
  afternoonOffDays: number[];
  tcSubject: 'TOAN' | 'TV' | 'BOTH';
  tcPeriods: number;
  roleTitle: string;
}

export const DEFAULT_GVCN_POLICIES: Record<string, GvcnPolicy> = {
  '1A': { targetPeriods: 19, afternoonOffDays: [3, 5], tcSubject: 'BOTH', tcPeriods: 2, roleTitle: 'GVCN Lớp 1A (Cô Chi)' },
  '2A': { targetPeriods: 16, afternoonOffDays: [3, 5], tcSubject: 'BOTH', tcPeriods: 2, roleTitle: 'GVCN Lớp 2A • Tổ Trưởng (Cô Trang)' },
  '3A': { targetPeriods: 19, afternoonOffDays: [2, 4], tcSubject: 'BOTH', tcPeriods: 2, roleTitle: 'GVCN Lớp 3A (Cô Dương)' },
  '4A': { targetPeriods: 19, afternoonOffDays: [2, 4], tcSubject: 'TOAN', tcPeriods: 1, roleTitle: 'GVCN Lớp 4A (Cô Hằng)' },
  '5A': { targetPeriods: 19, afternoonOffDays: [2, 4], tcSubject: 'TOAN', tcPeriods: 1, roleTitle: 'GVCN Lớp 5A (Thầy Tuấn)' },
  '1B': { targetPeriods: 19, afternoonOffDays: [2, 4], tcSubject: 'BOTH', tcPeriods: 2, roleTitle: 'GVCN Lớp 1B • Tổ Phó (Cô Bé Năm)' },
  '2B': { targetPeriods: 19, afternoonOffDays: [2, 4], tcSubject: 'BOTH', tcPeriods: 2, roleTitle: 'GVCN Lớp 2B (Cô Chinh)' },
  '3B': { targetPeriods: 19, afternoonOffDays: [3, 5], tcSubject: 'BOTH', tcPeriods: 2, roleTitle: 'GVCN Lớp 3B (Thầy Đạt)' },
  '4B': { targetPeriods: 19, afternoonOffDays: [3, 5], tcSubject: 'TOAN', tcPeriods: 1, roleTitle: 'GVCN Lớp 4B (Cô Yến)' },
  '5B': { targetPeriods: 20, afternoonOffDays: [3, 5], tcSubject: 'TOAN', tcPeriods: 1, roleTitle: 'GVCN Lớp 5B (Cô Huế)' },
};

// Generate the 32 slots:
// Morning: Mon-Fri, 4 periods = 20 slots
// Afternoon: Mon-Thu, 3 periods = 12 slots (Fri afternoon off)
const DAY_NAMES: Record<number, string> = {
  2: 'Thứ Hai',
  3: 'Thứ Ba',
  4: 'Thứ Tư',
  5: 'Thứ Năm',
  6: 'Thứ Sáu',
};

const MORNING_TIMES = ['07:15 - 07:50', '07:55 - 08:30', '08:50 - 09:25', '09:30 - 10:05'];
const AFTERNOON_TIMES = ['13:45 - 14:20', '14:25 - 15:00', '15:15 - 15:50'];

export function generateSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const days = [2, 3, 4, 5, 6];

  for (const d of days) {
    // Sáng
    for (let p = 1; p <= 4; p++) {
      slots.push({
        id: `T${d}_S_${p}`,
        day: d,
        dayName: DAY_NAMES[d],
        session: 'S',
        sessionName: 'Sáng',
        period: p,
        timeLabel: MORNING_TIMES[p - 1],
      });
    }
    // Chiều
    if (d < 6) {
      for (let p = 1; p <= 3; p++) {
        slots.push({
          id: `T${d}_C_${p}`,
          day: d,
          dayName: DAY_NAMES[d],
          session: 'C',
          sessionName: 'Chiều',
          period: p,
          timeLabel: AFTERNOON_TIMES[p - 1],
        });
      }
    }
  }
  return slots;
}

export const TIME_SLOTS = generateSlots();
