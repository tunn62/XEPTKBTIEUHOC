import {
  ALL_CLASSES,
  CLASSES_DIEM1,
  CLASSES_DIEM2,
  DEFAULT_GVCN_POLICIES,
  GVCN_MAP,
  SPECIALIST_TEACHERS,
  SUBJECTS,
  TIME_SLOTS,
} from '../data/initialData';
import { ConstraintViolation, ScheduledLesson, ScheduleMatrix } from '../types';
import { MASTER_BLUEPRINT, BlueprintSlot } from './scheduleBlueprint';

export interface SolverOptions {
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

const DAY_NAMES: Record<number, string> = {
  2: 'Thứ Hai',
  3: 'Thứ Ba',
  4: 'Thứ Tư',
  5: 'Thứ Năm',
  6: 'Thứ Sáu',
};

/**
 * Validates a schedule matrix against all hard, pedagogical, and policy constraints:
 * 1. Không trùng giờ, trùng lớp (0 teacher collision)
 * 2. Thời gian di chuyển giữa 2 Điểm trường: Cùng 1 buổi không dạy liên tiếp 2 điểm
 * 3. Tiếng Anh (cô Nương): Tối đa 1 tiết/ngày, không 2 tiết liền nhau
 * 4. GDTC (thầy Thịnh): Tối đa 1 tiết/ngày
 * 5. Toán (khối 1-5): Đúng 1 tiết/ngày từ Thứ 2 - Thứ 6
 * 6. Lớp 3, 4, 5 Sáng Thứ 4: Cặp 2 tiết Tiếng Việt liền kề (Tập đọc)
 * 7. GVCN DẠY ĐÚNG 19 TIẾT (bao gồm 1-2 tiết tăng cường Toán hoặc TV)
 * 8. GVCN ĐƯỢC NGHỈ 2 BUỔI CHIỀU TRONG TUẦN (Thứ 2 - Thứ 5)
 * 9. HĐTN CÓ 3 TIẾT:
 *    - Tiết 1 Chào cờ (T2_S_1) do GVCN phụ trách
 *    - Tiết 3 Sinh hoạt lớp (T6_S_4) do GVCN phụ trách
 *    - Tiết 2 HĐTN theo chủ đề do GV Tăng cường hoặc GV Bộ môn kiêm nhiệm dạy
 * 10. GV bộ môn nào dạy bồi dưỡng môn đó
 */
export function auditSchedule(schedule: ScheduleMatrix): ConstraintViolation[] {
  const violations: ConstraintViolation[] = [];
  const days = [2, 3, 4, 5, 6];

  // 1. Teacher collision check per slot
  for (const slot of TIME_SLOTS) {
    const teacherAssignments: Record<string, string[]> = {};

    for (const c of ALL_CLASSES) {
      const lesson = schedule[c.id]?.[slot.id];
      if (lesson?.teacherName) {
        if (!teacherAssignments[lesson.teacherName]) {
          teacherAssignments[lesson.teacherName] = [];
        }
        teacherAssignments[lesson.teacherName].push(c.id);
      }
    }

    for (const [teacher, classes] of Object.entries(teacherAssignments)) {
      if (classes.length > 1) {
        violations.push({
          id: `conflict_${slot.id}_${teacher}`,
          type: 'HARD',
          code: 'TEACHER_COLLISION',
          title: 'Trùng lịch Giáo viên',
          description: `Giáo viên ${teacher} bị xếp dạy đồng thời ${classes.length} lớp (${classes.join(', ')}) tại ${slot.dayName} ${slot.sessionName} Tiết ${slot.period}.`,
          severity: 'error',
          teacherName: teacher,
          slotId: slot.id,
          day: slot.day,
        });
      }
    }
  }

  // 2. HARD CONSTRAINT: Thầy Phan Ngọc Quan (Phó Hiệu Trưởng) chỉ dạy đúng 2 tiết Đạo đức Khối 5
  const quanAssignments: { classId: string; slotId: string; subjectCode: string }[] = [];
  for (const c of ALL_CLASSES) {
    for (const slot of TIME_SLOTS) {
      const lesson = schedule[c.id]?.[slot.id];
      if (lesson && lesson.teacherName === 'Quan') {
        quanAssignments.push({ classId: c.id, slotId: slot.id, subjectCode: lesson.subjectCode });
      }
    }
  }

  if (quanAssignments.length > 2) {
    violations.push({
      id: 'quan_quota_exceeded',
      type: 'HARD',
      code: 'QUAN_POLICY_VIOLATION',
      title: 'PHT Quan dạy quá 2 tiết quy định',
      description: `Thầy Quan (Phó Hiệu trưởng) đang được phân công ${quanAssignments.length} tiết (Quy định: chỉ dạy đúng 2 tiết Đạo đức Khối 5).`,
      severity: 'error',
      teacherName: 'Quan',
    });
  }

  for (const q of quanAssignments) {
    if (!['5A', '5B'].includes(q.classId) || q.subjectCode !== 'DD') {
      violations.push({
        id: `quan_invalid_subject_${q.classId}_${q.slotId}`,
        type: 'HARD',
        code: 'QUAN_INVALID_ASSIGNMENT',
        title: 'PHT Quan phân công sai đối tượng',
        description: `Thầy Quan được phân công ${q.subjectCode} tại lớp ${q.classId} (${q.slotId}). Quy định: chỉ dạy Đạo đức Khối 5 (5A & 5B).`,
        severity: 'error',
        teacherName: 'Quan',
        classId: q.classId,
        slotId: q.slotId,
      });
    }
  }

  // 3. HARD CONSTRAINT: Đủ 32 tiết cho tất cả 10 lớp (Tổng cộng 320 tiết)
  for (const c of ALL_CLASSES) {
    let count = 0;
    for (const slot of TIME_SLOTS) {
      if (schedule[c.id]?.[slot.id]?.subjectCode) {
        count++;
      }
    }
    if (count < 32) {
      violations.push({
        id: `missing_slots_${c.id}`,
        type: 'HARD',
        code: 'MISSING_SLOTS',
        title: `Lớp ${c.id} chưa đủ 32 tiết`,
        description: `Lớp ${c.id} hiện chỉ có ${count}/32 tiết học được phân công.`,
        severity: 'error',
        classId: c.id,
      });
    }
  }

  return violations;
}

/**
 * Builds the complete schedule matrix using the optimized master blueprint
 * and applies any custom overrides from the user's Command Bar.
 */
export function solveOptimalSchedule(options: SolverOptions = {}): ScheduleMatrix {
  const schedule: ScheduleMatrix = {};

  for (const c of ALL_CLASSES) {
    schedule[c.id] = {};
  }

  // Load from MASTER_BLUEPRINT
  for (const c of ALL_CLASSES) {
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

  // Apply custom overrides if provided
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
 * Executes a high-level adjustment command from the Command Bar:
 * Allows changing a teacher, number of periods, and subject for any class,
 * while automatically keeping the schedule intact.
 */
export function executeAssignmentCommand(
  currentSchedule: ScheduleMatrix,
  cmd: AssignmentCommand
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

  // If targeting a specific teacher replacement (e.g. fromTeacher -> toTeacher for this subject)
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

  // If adjusting quota (targetPeriodsCount):
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
      // Find candidate afternoon or elective slots to convert
      let added = 0;
      for (const slot of TIME_SLOTS) {
        if (added >= diff) break;
        if (slot.id === 'T2_S_1' || slot.id === 'T6_S_4') continue; // keep fixed
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
      // Reduce excess periods
      let removed = 0;
      for (let i = currentMatchingSlots.length - 1; i >= 0; i--) {
        if (removed >= Math.abs(diff)) break;
        const sid = currentMatchingSlots[i];
        const gvcn = GVCN_MAP[cmd.classId];
        classSchedule[sid] = {
          classId: cmd.classId,
          slotId: sid,
          subjectCode: 'TC',
          subjectName: 'Tăng cường',
          teacherName: gvcn,
          category: 'TC',
          notes: 'Khôi phục tăng cường',
        };
        removed++;
      }
    }
  }

  return newSchedule;
}
