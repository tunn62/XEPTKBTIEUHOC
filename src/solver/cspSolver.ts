import {
  ALL_CLASSES,
  ALL_TEACHERS,
  GVCN_MAP,
  SUBJECTS,
  TIME_SLOTS,
} from '../data/initialData';
import {
  ConstraintConfig,
  ConstraintViolation,
  ScheduledLesson,
  ScheduleMatrix,
  SchoolClass,
  SchoolProfile,
  Teacher,
} from '../types';
import { DEFAULT_CONSTRAINTS } from '../data/schoolPresets';
import { MASTER_BLUEPRINT, BlueprintSlot } from './scheduleBlueprint';

export interface SolverOptions {
  schoolProfile?: SchoolProfile;
  constraints?: ConstraintConfig;
  prioritizeMorningCoreSubjects?: boolean;
  reduceCampusTransitions?: boolean;
  evenTeacherDistribution?: boolean;
  customOverrides?: Record<string, Record<string, Partial<BlueprintSlot>>>;
}

export interface AssignmentCommand {
  classId: string;
  fromTeacher?: string;
  toTeacher: string;
  subjectCode: string;
  targetPeriodsCount?: number;
  slotIds?: string[];
  notes?: string;
}

export const isDiem1 = (classId: string): boolean => classId.endsWith('A');
export const isDiem2 = (classId: string): boolean => classId.endsWith('B');

export interface AuditOptions {
  classes?: SchoolClass[];
  teachers?: Teacher[];
  schoolProfile?: SchoolProfile;
  constraints?: ConstraintConfig;
}

/**
 * Validates a schedule matrix against enabled hard and soft constraints.
 */
export function auditSchedule(
  schedule: ScheduleMatrix,
  options?: AuditOptions
): ConstraintViolation[] {
  const violations: ConstraintViolation[] = [];
  const classes = options?.classes || options?.schoolProfile?.classes || ALL_CLASSES;
  const teachers = options?.teachers || options?.schoolProfile?.teachers || ALL_TEACHERS;
  const constraints = options?.constraints || DEFAULT_CONSTRAINTS;
  const hard = constraints.hard;
  const soft = constraints.soft;

  // 1. HARD: Teacher collision check per slot
  if (hard.noTeacherCollision) {
    for (const slot of TIME_SLOTS) {
      const teacherAssignments: Record<string, string[]> = {};

      for (const c of classes) {
        const lesson = schedule[c.id]?.[slot.id];
        if (lesson?.teacherName && lesson.subjectCode !== 'OFF') {
          if (!teacherAssignments[lesson.teacherName]) {
            teacherAssignments[lesson.teacherName] = [];
          }
          teacherAssignments[lesson.teacherName].push(c.id);
        }
      }

      for (const [teacher, assignedClasses] of Object.entries(teacherAssignments)) {
        if (assignedClasses.length > 1) {
          violations.push({
            id: `conflict_${slot.id}_${teacher}`,
            type: 'HARD',
            code: 'TEACHER_COLLISION',
            title: 'Trùng lịch Giáo viên',
            description: `Giáo viên ${teacher} bị xếp dạy đồng thời ${assignedClasses.length} lớp (${assignedClasses.join(', ')}) tại ${slot.dayName} ${slot.sessionName} Tiết ${slot.period}.`,
            severity: 'error',
            teacherName: teacher,
            slotId: slot.id,
            day: slot.day,
          });
        }
      }
    }
  }

  // 2. HARD: BGH Quota (e.g. Thầy Phan Ngọc Quan 2 tiết)
  if (hard.limitBghQuota && hard.bghTeacherName) {
    const bghName = hard.bghTeacherName;
    const maxP = hard.bghMaxPeriods ?? 2;
    const subj = hard.bghSubjectCode || 'DD';
    const grades = hard.bghGrades || [5];

    const bghAssignments: { classId: string; slotId: string; subjectCode: string }[] = [];
    for (const c of classes) {
      for (const slot of TIME_SLOTS) {
        const lesson = schedule[c.id]?.[slot.id];
        if (lesson && lesson.teacherName === bghName) {
          bghAssignments.push({ classId: c.id, slotId: slot.id, subjectCode: lesson.subjectCode });
        }
      }
    }

    if (bghAssignments.length > maxP) {
      violations.push({
        id: 'bgh_quota_exceeded',
        type: 'HARD',
        code: 'BGH_POLICY_VIOLATION',
        title: `BGH ${bghName} dạy quá định mức`,
        description: `BGH ${bghName} đang được phân công ${bghAssignments.length} tiết (Quy định: tối đa đúng ${maxP} tiết ${subj}).`,
        severity: 'error',
        teacherName: bghName,
      });
    }

    for (const a of bghAssignments) {
      const cls = classes.find(c => c.id === a.classId);
      const grade = cls?.grade ?? 0;
      if (!grades.includes(grade) || a.subjectCode !== subj) {
        violations.push({
          id: `bgh_invalid_${a.classId}_${a.slotId}`,
          type: 'HARD',
          code: 'BGH_INVALID_ASSIGNMENT',
          title: `BGH ${bghName} phân công sai quy chuẩn`,
          description: `BGH ${bghName} được xếp dạy môn ${a.subjectCode} tại lớp ${a.classId}. Quy định: chỉ dạy ${subj} khối ${grades.join(', ')}.`,
          severity: 'error',
          teacherName: bghName,
          classId: a.classId,
          slotId: a.slotId,
        });
      }
    }
  }

  // 3. HARD: Fixed Monday Flag Salute (SHDC at T2_S_1)
  if (hard.fixedMondayFlagSalute) {
    for (const c of classes) {
      const lesson = schedule[c.id]?.['T2_S_1'];
      if (!lesson || lesson.subjectCode !== 'SHDC') {
        violations.push({
          id: `flag_salute_${c.id}`,
          type: 'HARD',
          code: 'FIXED_FLAG_SALUTE_VIOLATION',
          title: `Lớp ${c.name} thiếu Chào cờ Tiết 1 Thứ Hai`,
          description: `Quy định bắt buộc: Tiết 1 Thứ Hai toàn trường phải Sinh hoạt Dưới cờ (SHDC). Hiện tại: ${lesson?.subjectName || 'Trống'}.`,
          severity: 'error',
          classId: c.id,
          slotId: 'T2_S_1',
        });
      }
    }
  }

  // 4. HARD: Fixed Friday Class Activity (SHL at T6_S_4)
  if (hard.fixedFridayClassActivity) {
    for (const c of classes) {
      const lesson = schedule[c.id]?.['T6_S_4'];
      if (!lesson || lesson.subjectCode !== 'SHL') {
        violations.push({
          id: `class_activity_${c.id}`,
          type: 'HARD',
          code: 'FIXED_CLASS_ACTIVITY_VIOLATION',
          title: `Lớp ${c.name} thiếu Sinh hoạt Lớp Tiết 4 Thứ Sáu`,
          description: `Quy định: Tiết 4 Thứ Sáu dành cho Sinh hoạt Lớp (SHL). Hiện tại: ${lesson?.subjectName || 'Trống'}.`,
          severity: 'error',
          classId: c.id,
          slotId: 'T6_S_4',
        });
      }
    }
  }

  // 5. HARD: Full 32 periods per class
  if (hard.strictQuotaFulfilled) {
    for (const c of classes) {
      let count = 0;
      for (const slot of TIME_SLOTS) {
        const subj = schedule[c.id]?.[slot.id]?.subjectCode;
        if (subj && subj !== 'OFF') {
          count++;
        }
      }
      if (count < 32) {
        violations.push({
          id: `missing_slots_${c.id}`,
          type: 'HARD',
          code: 'MISSING_SLOTS',
          title: `Lớp ${c.name} chưa đủ 32 tiết/tuần`,
          description: `Lớp ${c.name} hiện mới có ${count}/32 tiết học được xếp.`,
          severity: 'error',
          classId: c.id,
        });
      }
    }
  }

  // 6. HARD: Friday afternoon off
  if (hard.fridayAfternoonOff) {
    for (const c of classes) {
      for (const sid of ['T6_C_1', 'T6_C_2', 'T6_C_3']) {
        const lesson = schedule[c.id]?.[sid];
        if (lesson && lesson.subjectCode && lesson.subjectCode !== 'OFF') {
          violations.push({
            id: `friday_afternoon_${c.id}_${sid}`,
            type: 'HARD',
            code: 'FRIDAY_AFTERNOON_VIOLATION',
            title: `Vi phạm nghỉ Chiều Thứ Sáu tại lớp ${c.name}`,
            description: `Chiều Thứ Sáu toàn trường nghỉ sinh hoạt chuyên môn, nhưng lớp ${c.name} đang có tiết ${lesson.subjectName}.`,
            severity: 'error',
            classId: c.id,
            slotId: sid,
          });
        }
      }
    }
  }

  // 7. HARD: Computer room limit
  if (hard.maxComputerRoomSimultaneous > 0) {
    for (const slot of TIME_SLOTS) {
      let thCount = 0;
      const thClasses: string[] = [];
      for (const c of classes) {
        const lesson = schedule[c.id]?.[slot.id];
        if (lesson && (lesson.subjectCode === 'TH' || lesson.subjectCode === 'BD_TH')) {
          thCount++;
          thClasses.push(c.name);
        }
      }
      if (thCount > hard.maxComputerRoomSimultaneous) {
        violations.push({
          id: `th_room_overflow_${slot.id}`,
          type: 'HARD',
          code: 'COMPUTER_ROOM_OVERFLOW',
          title: 'Quá tải Phòng máy Tin học',
          description: `Tại ${slot.dayName} ${slot.sessionName} Tiết ${slot.period} có ${thCount} lớp cùng học Tin học (${thClasses.join(', ')}), vượt quá ${hard.maxComputerRoomSimultaneous} phòng máy.`,
          severity: 'error',
          slotId: slot.id,
        });
      }
    }
  }

  // 8. SOFT: Prioritize Morning Core Subjects (Toán, Tiếng Việt)
  if (soft.prioritizeMorningCoreSubjects) {
    for (const c of classes) {
      for (const slot of TIME_SLOTS) {
        if (slot.session === 'C') {
          const lesson = schedule[c.id]?.[slot.id];
          if (lesson && (lesson.subjectCode === 'TOAN' || lesson.subjectCode === 'TV')) {
            violations.push({
              id: `soft_core_afternoon_${c.id}_${slot.id}`,
              type: 'SOFT',
              code: 'CORE_SUBJECT_AFTERNOON',
              title: `Môn ${lesson.subjectName} xếp vào buổi chiều`,
              description: `Khuyến nghị sư phạm: Lớp ${c.name} có tiết ${lesson.subjectName} vào ${slot.dayName} Chiều Tiết ${slot.period}. Nên ưu tiên xếp buổi sáng khi học sinh tỉnh táo nhất.`,
              severity: 'warning',
              classId: c.id,
              slotId: slot.id,
            });
          }
        }
      }
    }
  }

  // 9. SOFT: Avoid Noon PE (Thể dục tiết 4 sáng hoặc tiết 3 chiều)
  if (soft.avoidNoonPE) {
    for (const c of classes) {
      for (const slot of TIME_SLOTS) {
        const lesson = schedule[c.id]?.[slot.id];
        if (lesson && (lesson.subjectCode === 'GDTC' || lesson.subjectCode === 'BD_TD')) {
          if ((slot.session === 'S' && slot.period === 4) || (slot.session === 'C' && slot.period === 3)) {
            violations.push({
              id: `soft_pe_noon_${c.id}_${slot.id}`,
              type: 'SOFT',
              code: 'NOON_PE_WARNING',
              title: `Thể dục vào tiết trưa nắng nóng`,
              description: `Lớp ${c.name} học Thể dục vào ${slot.dayName} ${slot.sessionName} Tiết ${slot.period} (thời điểm thời tiết nắng gắt, ảnh hưởng sức khỏe học sinh).`,
              severity: 'warning',
              classId: c.id,
              slotId: slot.id,
            });
          }
        }
      }
    }
  }

  // 10. SOFT: Teacher max periods per session
  if (soft.maxPeriodsPerSessionPerTeacher > 0) {
    const teacherSessionCounts: Record<string, Record<string, number>> = {};
    for (const c of classes) {
      for (const slot of TIME_SLOTS) {
        const lesson = schedule[c.id]?.[slot.id];
        if (lesson?.teacherName && lesson.subjectCode !== 'OFF') {
          const sessionKey = `${slot.day}_${slot.session}`;
          if (!teacherSessionCounts[lesson.teacherName]) {
            teacherSessionCounts[lesson.teacherName] = {};
          }
          teacherSessionCounts[lesson.teacherName][sessionKey] =
            (teacherSessionCounts[lesson.teacherName][sessionKey] || 0) + 1;
        }
      }
    }

    for (const [teacher, sessions] of Object.entries(teacherSessionCounts)) {
      for (const [sessionKey, count] of Object.entries(sessions)) {
        if (count > soft.maxPeriodsPerSessionPerTeacher) {
          const [d, s] = sessionKey.split('_');
          const dayName = d === '2' ? 'Thứ Hai' : d === '3' ? 'Thứ Ba' : d === '4' ? 'Thứ Tư' : d === '5' ? 'Thứ Năm' : 'Thứ Sáu';
          const sessName = s === 'S' ? 'Sáng' : 'Chiều';
          violations.push({
            id: `soft_teacher_fatigue_${teacher}_${sessionKey}`,
            type: 'SOFT',
            code: 'TEACHER_SESSION_OVERLOAD',
            title: `Giáo viên dạy quá ${soft.maxPeriodsPerSessionPerTeacher} tiết/buổi`,
            description: `Giáo viên ${teacher} đang dạy ${count} tiết vào buổi ${sessName} ${dayName}, vượt mức khuyến nghị để đảm bảo chất lượng giảng dạy.`,
            severity: 'warning',
            teacherName: teacher,
          });
        }
      }
    }
  }

  return violations;
}

/**
 * Deterministic, robust CSP Timetable Generator & Synchronizer.
 * Supports any School Profile, arbitrary classes, customizable teachers, and dynamic constraints!
 */
export function solveOptimalSchedule(options: SolverOptions = {}): ScheduleMatrix {
  const profile = options.schoolProfile;
  const constraints = options.constraints || DEFAULT_CONSTRAINTS;
  const hard = constraints.hard;
  const soft = constraints.soft;

  // If this is specifically the original Tan Thanh school and no custom profile, use the official verified MASTER_BLUEPRINT
  if (!profile || profile.id === 'tan_thanh') {
    const schedule: ScheduleMatrix = {};
    const classes = profile?.classes || ALL_CLASSES;

    for (const c of classes) {
      schedule[c.id] = {};
      const classBlueprint = MASTER_BLUEPRINT[c.id] || {};

      for (const slot of TIME_SLOTS) {
        const bpSlot = classBlueprint[slot.id];
        if (bpSlot) {
          const subjInfo = SUBJECTS[bpSlot.subjectCode as keyof typeof SUBJECTS] || {
            name: bpSlot.subjectCode,
            category: 'MAIN',
          };

          schedule[c.id][slot.id] = {
            classId: c.id,
            slotId: slot.id,
            subjectCode: bpSlot.subjectCode,
            subjectName: subjInfo.name,
            teacherName: bpSlot.teacherName,
            category: (subjInfo.category as any) || 'MAIN',
            isLocked: slot.id === 'T2_S_1' || slot.id === 'T6_S_4',
            notes: bpSlot.notes,
          };
        }
      }
    }

    // Apply custom overrides if any
    if (options.customOverrides) {
      for (const [classId, slots] of Object.entries(options.customOverrides)) {
        if (!schedule[classId]) continue;
        for (const [slotId, partial] of Object.entries(slots)) {
          if (!schedule[classId][slotId]) continue;
          const cur = schedule[classId][slotId];
          const newCode = partial.subjectCode || cur.subjectCode;
          const subjInfo = SUBJECTS[newCode as keyof typeof SUBJECTS] || {
            name: newCode,
            category: 'MAIN',
          };

          schedule[classId][slotId] = {
            ...cur,
            subjectCode: newCode,
            subjectName: subjInfo.name,
            teacherName: partial.teacherName || cur.teacherName,
            notes: partial.notes !== undefined ? partial.notes : cur.notes,
          };
        }
      }
    }

    return schedule;
  }

  // DYNAMIC CSP SOLVER FOR ANY SCHOOL / TEACHER / ASSIGNMENT CONFIGURATION
  const classes = profile.classes;
  const teachers = profile.teachers;
  const assignments = profile.assignments;

  const schedule: ScheduleMatrix = {};
  for (const c of classes) {
    schedule[c.id] = {};
  }

  // Helper: check teacher availability at slot
  const isTeacherFree = (teacherName: string, slotId: string): boolean => {
    for (const c of classes) {
      const lesson = schedule[c.id]?.[slotId];
      if (lesson && lesson.teacherName === teacherName && lesson.subjectCode !== 'OFF') {
        return false;
      }
    }
    return true;
  };

  // Helper: check simultaneous computer room count
  const getSimultaneousTHCount = (slotId: string): number => {
    let count = 0;
    for (const c of classes) {
      const lesson = schedule[c.id]?.[slotId];
      if (lesson && (lesson.subjectCode === 'TH' || lesson.subjectCode === 'BD_TH')) {
        count++;
      }
    }
    return count;
  };

  // Step 1: Place mandatory anchors for each class
  for (const c of classes) {
    const gvcn = c.gvcn || teachers[0]?.name || 'GVCN';

    // Monday period 1: Flag Salute (SHDC)
    if (hard.fixedMondayFlagSalute) {
      schedule[c.id]['T2_S_1'] = {
        classId: c.id,
        slotId: 'T2_S_1',
        subjectCode: 'SHDC',
        subjectName: 'Chào cờ',
        teacherName: gvcn,
        category: 'ACTIVITY',
        isLocked: true,
        notes: 'Sinh hoạt Dưới cờ',
      };
    }

    // Friday period 4 morning: Class Activity (SHL)
    if (hard.fixedFridayClassActivity) {
      schedule[c.id]['T6_S_4'] = {
        classId: c.id,
        slotId: 'T6_S_4',
        subjectCode: 'SHL',
        subjectName: 'Sinh hoạt Lớp',
        teacherName: gvcn,
        category: 'ACTIVITY',
        isLocked: true,
        notes: 'Sinh hoạt Lớp cuối tuần',
      };
    }

    // Friday afternoon: OFF if enabled
    if (hard.fridayAfternoonOff) {
      for (const sid of ['T6_C_1', 'T6_C_2', 'T6_C_3']) {
        schedule[c.id][sid] = {
          classId: c.id,
          slotId: sid,
          subjectCode: 'OFF',
          subjectName: 'Nghỉ',
          teacherName: '',
          category: 'OFF',
          isLocked: true,
          notes: 'Nghỉ sinh hoạt chuyên môn',
        };
      }
    }
  }

  // Step 2: Organize lesson items to schedule for each class
  // We sort subjects by constraint tightness (Degree Heuristic)
  const getSubjectPriority = (subjectCode: string): number => {
    // 1. Specialist subjects that share teachers across classes (highest conflict potential)
    if (['TA', 'BD_TA'].includes(subjectCode)) return 10;
    if (['TH', 'BD_TH'].includes(subjectCode)) return 9;
    if (['GDTC', 'BD_TD'].includes(subjectCode)) return 8;
    if (['AN', 'BD_AN'].includes(subjectCode)) return 7;
    if (['MT', 'BD_MT'].includes(subjectCode)) return 6;
    if (subjectCode === 'DD') return 5;
    // 2. Core morning subjects
    if (['TOAN', 'TV'].includes(subjectCode)) return 4;
    // 3. Science & social
    if (['TNXH', 'KH', 'LS_DL'].includes(subjectCode)) return 3;
    // 4. Activity
    if (subjectCode === 'HDTN_CD') return 2;
    // 5. Electives / Tăng cường
    return 1;
  };

  for (const c of classes) {
    const classAssignments = assignments.filter(a => a.classId === c.id);
    const lessonQueue: { subjectCode: string; teacherName: string }[] = [];

    for (const a of classAssignments) {
      // Don't duplicate anchors
      if (a.subjectCode === 'SHDC' || a.subjectCode === 'SHL') continue;
      for (let i = 0; i < a.periodsPerWeek; i++) {
        lessonQueue.push({
          subjectCode: a.subjectCode,
          teacherName: a.teacherName,
        });
      }
    }

    // Sort queue by priority
    lessonQueue.sort((a, b) => getSubjectPriority(b.subjectCode) - getSubjectPriority(a.subjectCode));

    // Schedule each lesson into the best available slot
    for (const item of lessonQueue) {
      const subjInfo = SUBJECTS[item.subjectCode as keyof typeof SUBJECTS] || {
        name: item.subjectCode,
        category: 'MAIN',
      };

      // Find available candidate slots
      const availableSlots = TIME_SLOTS.filter(s => {
        if (schedule[c.id][s.id]) return false; // already taken
        if (hard.fridayAfternoonOff && s.day === 6 && s.session === 'C') return false;
        if (hard.noTeacherCollision && !isTeacherFree(item.teacherName, s.id)) return false;
        if (
          hard.maxComputerRoomSimultaneous > 0 &&
          (item.subjectCode === 'TH' || item.subjectCode === 'BD_TH') &&
          getSimultaneousTHCount(s.id) >= hard.maxComputerRoomSimultaneous
        ) {
          return false;
        }
        return true;
      });

      if (availableSlots.length === 0) continue;

      // Score each candidate slot based on soft constraints
      const scoredSlots = availableSlots.map(slot => {
        let score = 100;

        // Morning core subjects preference
        if (soft.prioritizeMorningCoreSubjects && ['TOAN', 'TV'].includes(item.subjectCode)) {
          if (slot.session === 'S') {
            score += 60;
            if (slot.period <= 3) score += 30; // periods 1, 2, 3 ideal
          } else {
            score -= 50;
          }
        }

        // PE heat avoidance
        if (soft.avoidNoonPE && ['GDTC', 'BD_TD'].includes(item.subjectCode)) {
          if (slot.session === 'S' && slot.period === 4) score -= 80;
          if (slot.session === 'C' && slot.period === 3) score -= 80;
          if (slot.period === 1 || slot.period === 2) score += 40;
        }

        // PE Monday period 1 avoidance
        if (soft.avoidMondayPeriod1PE && ['GDTC', 'BD_TD'].includes(item.subjectCode)) {
          if (slot.day === 2 && slot.session === 'S' && slot.period <= 2) score -= 70;
        }

        // Spread subjects evenly (avoid same subject multiple times on same day unless allowed)
        if (soft.spreadSubjectsEvenly) {
          let sameSubjectToday = 0;
          for (const s of TIME_SLOTS) {
            if (s.day === slot.day && schedule[c.id][s.id]?.subjectCode === item.subjectCode) {
              sameSubjectToday++;
            }
          }
          if (sameSubjectToday >= 2) score -= 60;
          else if (sameSubjectToday === 1) {
            if (item.subjectCode === 'TV' && soft.allowDoublePeriodsForReading) {
              score += 20; // Allow double periods for Vietnamese
            } else if (['GDTC', 'TA', 'TH', 'AN', 'MT'].includes(item.subjectCode)) {
              score -= 50; // Specialists shouldn't cluster on the same day
            }
          }
        }

        return { slot, score };
      });

      scoredSlots.sort((a, b) => b.score - a.score);
      const chosen = scoredSlots[0].slot;

      schedule[c.id][chosen.id] = {
        classId: c.id,
        slotId: chosen.id,
        subjectCode: item.subjectCode,
        subjectName: subjInfo.name,
        teacherName: item.teacherName,
        category: (subjInfo.category as any) || 'MAIN',
        notes: item.subjectCode.startsWith('TC') ? 'Tăng cường' : undefined,
      };
    }

    // Fill any remaining unassigned slots (up to 32 periods) with GVCN's review/activity
    const gvcn = c.gvcn || teachers[0]?.name || 'GVCN';
    for (const slot of TIME_SLOTS) {
      if (!schedule[c.id][slot.id]) {
        if (hard.fridayAfternoonOff && slot.day === 6 && slot.session === 'C') {
          continue;
        }
        schedule[c.id][slot.id] = {
          classId: c.id,
          slotId: slot.id,
          subjectCode: 'TC',
          subjectName: 'Tăng cường',
          teacherName: gvcn,
          category: 'TC',
          notes: 'Tăng cường bổ trợ',
        };
      }
    }
  }

  // Apply custom overrides if specified
  if (options.customOverrides) {
    for (const [classId, slots] of Object.entries(options.customOverrides)) {
      if (!schedule[classId]) continue;
      for (const [slotId, partial] of Object.entries(slots)) {
        if (!schedule[classId][slotId]) continue;
        const cur = schedule[classId][slotId];
        const newCode = partial.subjectCode || cur.subjectCode;
        const subjInfo = SUBJECTS[newCode as keyof typeof SUBJECTS] || {
          name: newCode,
          category: 'MAIN',
        };

        schedule[classId][slotId] = {
          ...cur,
          subjectCode: newCode,
          subjectName: subjInfo.name,
          teacherName: partial.teacherName || cur.teacherName,
          notes: partial.notes !== undefined ? partial.notes : cur.notes,
        };
      }
    }
  }

  return schedule;
}

/**
 * Executes a high-level adjustment command from the Command Bar.
 */
export function executeAssignmentCommand(
  currentSchedule: ScheduleMatrix,
  cmd: AssignmentCommand,
  teachersList: Teacher[] = ALL_TEACHERS
): ScheduleMatrix {
  const newSchedule: ScheduleMatrix = JSON.parse(JSON.stringify(currentSchedule));
  const classSchedule = newSchedule[cmd.classId];
  if (!classSchedule) return currentSchedule;

  const subjInfo = SUBJECTS[cmd.subjectCode as keyof typeof SUBJECTS] || {
    name: cmd.subjectCode,
    category: 'MAIN',
  };

  // If explicit slots were designated, apply directly
  if (cmd.slotIds && cmd.slotIds.length > 0) {
    for (const sid of cmd.slotIds) {
      if (classSchedule[sid]) {
        classSchedule[sid] = {
          ...classSchedule[sid],
          subjectCode: cmd.subjectCode,
          subjectName: subjInfo.name,
          teacherName: cmd.toTeacher,
          category: (subjInfo.category as any) || 'MAIN',
          notes: cmd.notes || classSchedule[sid].notes,
        };
      }
    }
    return newSchedule;
  }

  // If targeting a specific teacher replacement
  if (cmd.fromTeacher) {
    for (const slot of TIME_SLOTS) {
      const lesson = classSchedule[slot.id];
      if (lesson && lesson.teacherName === cmd.fromTeacher && lesson.subjectCode === cmd.subjectCode) {
        lesson.teacherName = cmd.toTeacher;
        if (cmd.notes) lesson.notes = cmd.notes;
      }
    }
    return newSchedule;
  }

  // If adjusting quota (targetPeriodsCount)
  if (cmd.targetPeriodsCount !== undefined) {
    const currentMatchingSlots: string[] = [];
    for (const slot of TIME_SLOTS) {
      const l = classSchedule[slot.id];
      if (l?.subjectCode === cmd.subjectCode && l.teacherName === cmd.toTeacher) {
        currentMatchingSlots.push(slot.id);
      }
    }

    const diff = cmd.targetPeriodsCount - currentMatchingSlots.length;
    if (diff > 0) {
      let added = 0;
      for (const slot of TIME_SLOTS) {
        if (added >= diff) break;
        if (slot.id === 'T2_S_1' || slot.id === 'T6_S_4') continue;
        const l = classSchedule[slot.id];
        if (l && (l.subjectCode === 'TC' || l.subjectCode === 'TC_TOAN' || l.subjectCode === 'TC_TV')) {
          classSchedule[slot.id] = {
            ...l,
            subjectCode: cmd.subjectCode,
            subjectName: subjInfo.name,
            teacherName: cmd.toTeacher,
            notes: cmd.notes || `Điều chỉnh lệnh (${cmd.toTeacher})`,
          };
          added++;
        }
      }
    } else if (diff < 0) {
      let removed = 0;
      for (let i = currentMatchingSlots.length - 1; i >= 0; i--) {
        if (removed >= Math.abs(diff)) break;
        const sid = currentMatchingSlots[i];
        classSchedule[sid] = {
          classId: cmd.classId,
          slotId: sid,
          subjectCode: 'TC',
          subjectName: 'Tăng cường',
          teacherName: cmd.toTeacher,
          category: 'TC',
          notes: 'Khôi phục tăng cường',
        };
        removed++;
      }
    }
  }

  return newSchedule;
}
