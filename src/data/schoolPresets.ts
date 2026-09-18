import { ConstraintConfig, SchoolClass, SchoolProfile, SubjectAssignment, Teacher } from '../types';
import { ALL_CLASSES, ALL_TEACHERS, SCHOOL_INFO } from './initialData';
import { MASTER_BLUEPRINT } from '../solver/scheduleBlueprint';

export const DEFAULT_CONSTRAINTS: ConstraintConfig = {
  hard: {
    noTeacherCollision: true,
    fixedMondayFlagSalute: true,
    fixedFridayClassActivity: true,
    strictQuotaFulfilled: true,
    fridayAfternoonOff: true,
    limitBghQuota: true,
    bghTeacherName: 'Quan',
    bghMaxPeriods: 2,
    bghSubjectCode: 'DD',
    bghGrades: [5],
    maxComputerRoomSimultaneous: 2,
  },
  soft: {
    prioritizeMorningCoreSubjects: true,
    avoidNoonPE: true,
    avoidMondayPeriod1PE: true,
    spreadSubjectsEvenly: true,
    minimizeTeacherGaps: true,
    maxPeriodsPerSessionPerTeacher: 4,
    allowDoublePeriodsForReading: true,
    gvcnAfternoonOffAllowance: true,
  },
};

// Generate assignments for Tan Thanh school based on the official blueprint
export function getTanThanhAssignments(): SubjectAssignment[] {
  const assignments: SubjectAssignment[] = [];

  for (const c of ALL_CLASSES) {
    const classSlots = MASTER_BLUEPRINT[c.id] || {};
    const countMap: Record<string, { subjectCode: string; teacherName: string; count: number }> = {};

    for (const [, slot] of Object.entries(classSlots)) {
      if (!slot?.subjectCode || slot.subjectCode === 'OFF') continue;
      const key = `${slot.subjectCode}__${slot.teacherName}`;
      if (!countMap[key]) {
        countMap[key] = {
          subjectCode: slot.subjectCode,
          teacherName: slot.teacherName,
          count: 0,
        };
      }
      countMap[key].count++;
    }

    for (const item of Object.values(countMap)) {
      assignments.push({
        classId: c.id,
        subjectCode: item.subjectCode,
        subjectName: item.subjectCode,
        teacherName: item.teacherName,
        periodsPerWeek: item.count,
      });
    }
  }

  return assignments;
}

// Preset 1: Tiểu học Tân Thạnh (Phân hiệu Tân Bình - 10 lớp)
export const PRESET_TAN_THANH: SchoolProfile = {
  id: 'tan_thanh',
  name: SCHOOL_INFO.name,
  branch: SCHOOL_INFO.branch,
  academicYear: SCHOOL_INFO.academicYear,
  standardPeriods: 32,
  classes: JSON.parse(JSON.stringify(ALL_CLASSES)),
  teachers: JSON.parse(JSON.stringify(ALL_TEACHERS)),
  assignments: getTanThanhAssignments(),
};

// Preset 2: Trường Tiểu học Chu Văn An (8 Lớp)
export const PRESET_CHU_VAN_AN_CLASSES: SchoolClass[] = [
  { id: '1A', name: 'Lớp 1A', grade: 1, campus: 'diem1', gvcn: 'Cô Minh Thư', studentsCount: 30 },
  { id: '1B', name: 'Lớp 1B', grade: 1, campus: 'diem1', gvcn: 'Cô Kim Oanh', studentsCount: 29 },
  { id: '2A', name: 'Lớp 2A', grade: 2, campus: 'diem1', gvcn: 'Thầy Thanh Sơn', studentsCount: 32 },
  { id: '2B', name: 'Lớp 2B', grade: 2, campus: 'diem1', gvcn: 'Cô Bích Ngọc', studentsCount: 31 },
  { id: '3A', name: 'Lớp 3A', grade: 3, campus: 'diem1', gvcn: 'Cô Thu Hương', studentsCount: 33 },
  { id: '3B', name: 'Lớp 3B', grade: 3, campus: 'diem1', gvcn: 'Thầy Quang Huy', studentsCount: 30 },
  { id: '4A', name: 'Lớp 4A', grade: 4, campus: 'diem1', gvcn: 'Cô Hồng Nhung', studentsCount: 32 },
  { id: '4B', name: 'Lớp 4B', grade: 4, campus: 'diem1', gvcn: 'Thầy Đức Trọng', studentsCount: 31 },
];

export const PRESET_CHU_VAN_AN_TEACHERS: Teacher[] = [
  // GVCN (8 GV)
  { id: 'T_Thu', name: 'Cô Minh Thư', role: 'GVCN', assignedClass: '1A', roleTitle: 'GVCN Lớp 1A', quota: 19, subjects: ['TV', 'TOAN', 'TNXH', 'DD', 'HDTN', 'TC'], color: '#3B82F6' },
  { id: 'T_Oanh', name: 'Cô Kim Oanh', role: 'GVCN', assignedClass: '1B', roleTitle: 'GVCN Lớp 1B', quota: 19, subjects: ['TV', 'TOAN', 'TNXH', 'DD', 'HDTN', 'TC'], color: '#EC4899' },
  { id: 'T_Son', name: 'Thầy Thanh Sơn', role: 'GVCN', assignedClass: '2A', roleTitle: 'GVCN Lớp 2A • Tổ trưởng', quota: 17, subjects: ['TV', 'TOAN', 'TNXH', 'DD', 'HDTN', 'TC'], color: '#06B6D4' },
  { id: 'T_Ngoc', name: 'Cô Bích Ngọc', role: 'GVCN', assignedClass: '2B', roleTitle: 'GVCN Lớp 2B', quota: 19, subjects: ['TV', 'TOAN', 'TNXH', 'DD', 'HDTN', 'TC'], color: '#F43F5E' },
  { id: 'T_Huong', name: 'Cô Thu Hương', role: 'GVCN', assignedClass: '3A', roleTitle: 'GVCN Lớp 3A', quota: 19, subjects: ['TV', 'TOAN', 'TNXH', 'DD', 'HDTN', 'TC'], color: '#0EA5E9' },
  { id: 'T_Huy', name: 'Thầy Quang Huy', role: 'GVCN', assignedClass: '3B', roleTitle: 'GVCN Lớp 3B', quota: 19, subjects: ['TV', 'TOAN', 'TNXH', 'DD', 'HDTN', 'TC'], color: '#E11D48' },
  { id: 'T_Nhung', name: 'Cô Hồng Nhung', role: 'GVCN', assignedClass: '4A', roleTitle: 'GVCN Lớp 4A', quota: 19, subjects: ['TV', 'TOAN', 'KH', 'LS_DL', 'DD', 'HDTN', 'TC'], color: '#6366F1' },
  { id: 'T_Trong', name: 'Thầy Đức Trọng', role: 'GVCN', assignedClass: '4B', roleTitle: 'GVCN Lớp 4B', quota: 19, subjects: ['TV', 'TOAN', 'KH', 'LS_DL', 'DD', 'HDTN', 'TC'], color: '#D97706' },
  // GV Chuyên môn (5 GV)
  { id: 'T_Anh_Linh', name: 'Cô Mai Linh', role: 'SPECIALIST', roleTitle: 'Giáo viên Tiếng Anh', quota: 20, subjects: ['TA', 'BD_TA'], color: '#CA8A04' },
  { id: 'T_Tin_Hai', name: 'Thầy Hoàng Hải', role: 'SPECIALIST', roleTitle: 'Giáo viên Tin học & CN', quota: 16, subjects: ['TH', 'BD_TH'], color: '#0284C7' },
  { id: 'T_TD_Long', name: 'Thầy Quốc Long', role: 'SPECIALIST', roleTitle: 'Giáo viên Thể dục (GDTC)', quota: 20, subjects: ['GDTC', 'BD_TD'], color: '#16A34A' },
  { id: 'T_Nhac_Lan', name: 'Cô Xuân Lan', role: 'SPECIALIST', roleTitle: 'Giáo viên Âm nhạc', quota: 16, subjects: ['AN', 'BD_AN'], color: '#DB2777' },
  { id: 'T_My_Hoa', name: 'Cô Mỹ Hoa', role: 'SPECIALIST', roleTitle: 'Giáo viên Mỹ thuật', quota: 16, subjects: ['MT', 'BD_MT'], color: '#9333EA' },
];

export function generateStandardAssignments(classes: SchoolClass[], teachers: Teacher[]): SubjectAssignment[] {
  const assignments: SubjectAssignment[] = [];
  const gvcnMap: Record<string, string> = {};
  for (const c of classes) {
    gvcnMap[c.id] = c.gvcn;
  }

  // Find specialist teachers
  const engTeacher = teachers.find(t => t.subjects.includes('TA'))?.name || 'Cô Mai Linh';
  const itTeacher = teachers.find(t => t.subjects.includes('TH'))?.name || 'Thầy Hoàng Hải';
  const peTeacher = teachers.find(t => t.subjects.includes('GDTC'))?.name || 'Thầy Quốc Long';
  const musicTeacher = teachers.find(t => t.subjects.includes('AN'))?.name || 'Cô Xuân Lan';
  const artTeacher = teachers.find(t => t.subjects.includes('MT'))?.name || 'Cô Mỹ Hoa';

  for (const c of classes) {
    const gvcn = gvcnMap[c.id] || teachers[0]?.name || 'GVCN';
    const isGrade1or2 = c.grade <= 2;
    const isGrade3 = c.grade === 3;
    const isGrade4or5 = c.grade >= 4;

    // Fixed & Class activities
    assignments.push({ classId: c.id, subjectCode: 'SHDC', subjectName: 'Chào cờ', teacherName: gvcn, periodsPerWeek: 1 });
    assignments.push({ classId: c.id, subjectCode: 'SHL', subjectName: 'Sinh hoạt lớp', teacherName: gvcn, periodsPerWeek: 1 });
    assignments.push({ classId: c.id, subjectCode: 'HDTN_CD', subjectName: 'HĐTN (Chủ đề)', teacherName: gvcn, periodsPerWeek: 1 });

    // Main subjects
    assignments.push({ classId: c.id, subjectCode: 'TOAN', subjectName: 'Toán', teacherName: gvcn, periodsPerWeek: 5 });
    assignments.push({ classId: c.id, subjectCode: 'TV', subjectName: 'Tiếng Việt', teacherName: gvcn, periodsPerWeek: isGrade1or2 ? 8 : 7 });
    assignments.push({ classId: c.id, subjectCode: 'DD', subjectName: 'Đạo đức', teacherName: gvcn, periodsPerWeek: 1 });

    // Science / Social
    if (isGrade1or2 || isGrade3) {
      assignments.push({ classId: c.id, subjectCode: 'TNXH', subjectName: 'Tự nhiên & Xã hội', teacherName: gvcn, periodsPerWeek: isGrade3 ? 3 : 2 });
    } else {
      assignments.push({ classId: c.id, subjectCode: 'KH', subjectName: 'Khoa học', teacherName: gvcn, periodsPerWeek: 2 });
      assignments.push({ classId: c.id, subjectCode: 'LS_DL', subjectName: 'Lịch sử & Địa lý', teacherName: gvcn, periodsPerWeek: 2 });
    }

    // Specialist subjects
    const engPeriods = isGrade1or2 ? 2 : 4;
    assignments.push({ classId: c.id, subjectCode: 'TA', subjectName: 'Tiếng Anh', teacherName: engTeacher, periodsPerWeek: engPeriods });

    if (!isGrade1or2) {
      assignments.push({ classId: c.id, subjectCode: 'TH', subjectName: 'Tin học & CN', teacherName: itTeacher, periodsPerWeek: 2 });
    }

    assignments.push({ classId: c.id, subjectCode: 'GDTC', subjectName: 'Giáo dục thể chất', teacherName: peTeacher, periodsPerWeek: 2 });
    assignments.push({ classId: c.id, subjectCode: 'AN', subjectName: 'Âm nhạc', teacherName: musicTeacher, periodsPerWeek: 1 });
    assignments.push({ classId: c.id, subjectCode: 'MT', subjectName: 'Mỹ thuật', teacherName: artTeacher, periodsPerWeek: 1 });

    // Calculate current total
    const currentSum = assignments
      .filter(a => a.classId === c.id)
      .reduce((sum, a) => sum + a.periodsPerWeek, 0);

    const neededTc = 32 - currentSum;
    if (neededTc > 0) {
      const tcToan = Math.min(2, Math.floor(neededTc / 2));
      const tcTv = neededTc - tcToan;
      if (tcToan > 0) {
        assignments.push({ classId: c.id, subjectCode: 'TC_TOAN', subjectName: 'Tăng cường Toán', teacherName: gvcn, periodsPerWeek: tcToan });
      }
      if (tcTv > 0) {
        assignments.push({ classId: c.id, subjectCode: 'TC_TV', subjectName: 'Tăng cường Tiếng Việt', teacherName: gvcn, periodsPerWeek: tcTv });
      }
    }
  }

  return assignments;
}

export const PRESET_CHU_VAN_AN: SchoolProfile = {
  id: 'chu_van_an',
  name: 'TRƯỜNG TIỂU HỌC CHU VĂN AN',
  branch: 'CƠ SỞ CHÍNH',
  academicYear: '2026 - 2027',
  standardPeriods: 32,
  classes: PRESET_CHU_VAN_AN_CLASSES,
  teachers: PRESET_CHU_VAN_AN_TEACHERS,
  assignments: generateStandardAssignments(PRESET_CHU_VAN_AN_CLASSES, PRESET_CHU_VAN_AN_TEACHERS),
};

// Preset 3: Trường Tiểu học Lê Hồng Phong (12 Lớp)
export const PRESET_LE_HONG_PHONG_CLASSES: SchoolClass[] = [
  { id: '1A', name: 'Lớp 1A', grade: 1, campus: 'diem1', gvcn: 'Cô Cẩm Vân', studentsCount: 32 },
  { id: '1B', name: 'Lớp 1B', grade: 1, campus: 'diem1', gvcn: 'Cô Thúy Hằng', studentsCount: 30 },
  { id: '1C', name: 'Lớp 1C', grade: 1, campus: 'diem1', gvcn: 'Cô Thanh Mai', studentsCount: 31 },
  { id: '2A', name: 'Lớp 2A', grade: 2, campus: 'diem1', gvcn: 'Thầy Hữu Phước', studentsCount: 33 },
  { id: '2B', name: 'Lớp 2B', grade: 2, campus: 'diem1', gvcn: 'Cô Bích Thủy', studentsCount: 32 },
  { id: '3A', name: 'Lớp 3A', grade: 3, campus: 'diem1', gvcn: 'Cô Mỹ Dung', studentsCount: 30 },
  { id: '3B', name: 'Lớp 3B', grade: 3, campus: 'diem1', gvcn: 'Thầy Tuấn Kiệt', studentsCount: 31 },
  { id: '4A', name: 'Lớp 4A', grade: 4, campus: 'diem1', gvcn: 'Cô Diệu Hiền', studentsCount: 34 },
  { id: '4B', name: 'Lớp 4B', grade: 4, campus: 'diem1', gvcn: 'Cô Ngọc Lan', studentsCount: 32 },
  { id: '5A', name: 'Lớp 5A', grade: 5, campus: 'diem1', gvcn: 'Thầy Trọng Nghĩa', studentsCount: 29 },
  { id: '5B', name: 'Lớp 5B', grade: 5, campus: 'diem1', gvcn: 'Cô Phương Thảo', studentsCount: 30 },
  { id: '5C', name: 'Lớp 5C', grade: 5, campus: 'diem1', gvcn: 'Thầy Hải Đăng', studentsCount: 31 },
];

export const PRESET_LE_HONG_PHONG_TEACHERS: Teacher[] = [
  { id: 'T_Van', name: 'Cô Cẩm Vân', role: 'GVCN', assignedClass: '1A', quota: 19, subjects: ['TV', 'TOAN', 'TNXH', 'DD', 'HDTN', 'TC'], color: '#3B82F6' },
  { id: 'T_Hang', name: 'Cô Thúy Hằng', role: 'GVCN', assignedClass: '1B', quota: 19, subjects: ['TV', 'TOAN', 'TNXH', 'DD', 'HDTN', 'TC'], color: '#EC4899' },
  { id: 'T_Mai', name: 'Cô Thanh Mai', role: 'GVCN', assignedClass: '1C', quota: 19, subjects: ['TV', 'TOAN', 'TNXH', 'DD', 'HDTN', 'TC'], color: '#F43F5E' },
  { id: 'T_Phuoc', name: 'Thầy Hữu Phước', role: 'GVCN', assignedClass: '2A', quota: 17, roleTitle: 'Tổ trưởng Khối 2', subjects: ['TV', 'TOAN', 'TNXH', 'DD', 'HDTN', 'TC'], color: '#06B6D4' },
  { id: 'T_Thuy', name: 'Cô Bích Thủy', role: 'GVCN', assignedClass: '2B', quota: 19, subjects: ['TV', 'TOAN', 'TNXH', 'DD', 'HDTN', 'TC'], color: '#0EA5E9' },
  { id: 'T_Dung', name: 'Cô Mỹ Dung', role: 'GVCN', assignedClass: '3A', quota: 19, subjects: ['TV', 'TOAN', 'TNXH', 'DD', 'HDTN', 'TC'], color: '#E11D48' },
  { id: 'T_Kiet', name: 'Thầy Tuấn Kiệt', role: 'GVCN', assignedClass: '3B', quota: 19, subjects: ['TV', 'TOAN', 'TNXH', 'DD', 'HDTN', 'TC'], color: '#8B5CF6' },
  { id: 'T_Hien', name: 'Cô Diệu Hiền', role: 'GVCN', assignedClass: '4A', quota: 19, subjects: ['TV', 'TOAN', 'KH', 'LS_DL', 'DD', 'HDTN', 'TC'], color: '#6366F1' },
  { id: 'T_Lan', name: 'Cô Ngọc Lan', role: 'GVCN', assignedClass: '4B', quota: 19, subjects: ['TV', 'TOAN', 'KH', 'LS_DL', 'DD', 'HDTN', 'TC'], color: '#D97706' },
  { id: 'T_Nghia', name: 'Thầy Trọng Nghĩa', role: 'GVCN', assignedClass: '5A', quota: 19, subjects: ['TV', 'TOAN', 'KH', 'LS_DL', 'DD', 'HDTN', 'TC'], color: '#B45309' },
  { id: 'T_Thao', name: 'Cô Phương Thảo', role: 'GVCN', assignedClass: '5B', quota: 19, subjects: ['TV', 'TOAN', 'KH', 'LS_DL', 'DD', 'HDTN', 'TC'], color: '#059669' },
  { id: 'T_Dang', name: 'Thầy Hải Đăng', role: 'GVCN', assignedClass: '5C', quota: 19, subjects: ['TV', 'TOAN', 'KH', 'LS_DL', 'DD', 'HDTN', 'TC'], color: '#0284C7' },
  // Specialist teachers
  { id: 'T_Anh_Linh', name: 'Cô Mai Linh', role: 'SPECIALIST', roleTitle: 'GV Tiếng Anh 1', quota: 20, subjects: ['TA'], color: '#CA8A04' },
  { id: 'T_Anh_Thanh', name: 'Thầy Văn Thanh', role: 'SPECIALIST', roleTitle: 'GV Tiếng Anh 2', quota: 20, subjects: ['TA'], color: '#EAB308' },
  { id: 'T_Tin_Hai', name: 'Thầy Hoàng Hải', role: 'SPECIALIST', roleTitle: 'GV Tin học', quota: 18, subjects: ['TH'], color: '#0284C7' },
  { id: 'T_TD_Long', name: 'Thầy Quốc Long', role: 'SPECIALIST', roleTitle: 'GV Thể dục 1', quota: 20, subjects: ['GDTC'], color: '#16A34A' },
  { id: 'T_TD_Hung', name: 'Thầy Việt Hùng', role: 'SPECIALIST', roleTitle: 'GV Thể dục 2', quota: 20, subjects: ['GDTC'], color: '#22C55E' },
  { id: 'T_Nhac_Lan', name: 'Cô Xuân Lan', role: 'SPECIALIST', roleTitle: 'GV Âm nhạc', quota: 20, subjects: ['AN'], color: '#DB2777' },
  { id: 'T_My_Hoa', name: 'Cô Mỹ Hoa', role: 'SPECIALIST', roleTitle: 'GV Mỹ thuật', quota: 20, subjects: ['MT'], color: '#9333EA' },
  { id: 'T_PHT_Binh', name: 'Thầy Quang Bình', role: 'SPECIALIST', roleTitle: 'Phó Hiệu trưởng', quota: 2, subjects: ['DD'], color: '#4F46E5' },
];

export const PRESET_LE_HONG_PHONG: SchoolProfile = {
  id: 'le_hong_phong',
  name: 'TRƯỜNG TIỂU HỌC LÊ HỒNG PHONG',
  branch: 'KHU TRUNG TÂM',
  academicYear: '2026 - 2027',
  standardPeriods: 32,
  classes: PRESET_LE_HONG_PHONG_CLASSES,
  teachers: PRESET_LE_HONG_PHONG_TEACHERS,
  assignments: generateStandardAssignments(PRESET_LE_HONG_PHONG_CLASSES, PRESET_LE_HONG_PHONG_TEACHERS),
};

export const ALL_PRESETS: Record<string, SchoolProfile> = {
  tan_thanh: PRESET_TAN_THANH,
  chu_van_an: PRESET_CHU_VAN_AN,
  le_hong_phong: PRESET_LE_HONG_PHONG,
};
