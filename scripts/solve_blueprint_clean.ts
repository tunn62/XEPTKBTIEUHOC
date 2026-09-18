import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP, DEFAULT_GVCN_POLICIES } from '../src/data/initialData';
import { auditSchedule, isDiem1 } from '../src/solver/cspSolver';
import { MASTER_BLUEPRINT, BlueprintSlot } from '../src/solver/scheduleBlueprint';
import * as fs from 'fs';

type ScheduleMap = Record<string, Record<string, BlueprintSlot>>;

function buildCleanBlueprint(): ScheduleMap {
  const sched: ScheduleMap = JSON.parse(JSON.stringify(MASTER_BLUEPRINT));

  // ==========================================
  // STEP 1: GVCN QUOTAS & AFTERNOONS OFF
  // ==========================================
  // 1A (Chi: 19): off T3, T5
  // 2A (Trang: 17): off T3, T5
  sched['2A']['T2_C_3'] = { subjectCode: 'TC_TOAN', teacherName: 'Phước', notes: 'GV tăng cường dạy Tăng cường Toán (hỗ trợ Tổ Trưởng)' };
  sched['2A']['T4_C_2'] = { subjectCode: 'TC_TV', teacherName: 'Phước', notes: 'GV tăng cường dạy Tăng cường Tiếng Việt (hỗ trợ Tổ Trưởng)' };

  // 3A (Dương: 19): off T2, T4
  // 4A (Hằng: 19): off T2, T4
  // 5A (Tuấn: 19): off T2, T4

  // 1B (Bé Năm: 18): off T2, T4
  sched['1B']['T5_C_3'] = { subjectCode: 'TC_TV', teacherName: 'Nhàn', notes: 'GV tăng cường dạy Tăng cường Tiếng Việt (hỗ trợ Tổ Phó)' };

  // 2B (Chinh: 19): off T2, T4
  sched['2B']['T4_S_4'] = { subjectCode: 'TC', teacherName: 'Quan', notes: 'GV tăng cường dạy' };
  sched['2B']['T5_S_4'] = { subjectCode: 'TC', teacherName: 'Thy', notes: 'GV bộ môn kiêm nhiệm dạy' };

  // 3B (Đạt: 19): off T3, T5
  sched['3B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };

  // 4B (Yến: 19): off T3, T5
  sched['4B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };

  // 5B (Huế: 19): off T3, T5
  sched['5B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Thy', notes: 'GV bộ môn kiêm nhiệm dạy' };

  // ==========================================
  // STEP 2: FIX TA (NƯƠNG)
  // Grades 1 & 2 do not have TA; Grades 3, 4, 5 have 4 periods (1/day)
  // ==========================================
  // 1A (grade 1): no TA
  sched['1A']['T5_S_4'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
  sched['1A']['T5_C_1'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
  sched['1A']['T6_S_2'] = { subjectCode: 'BD_TH', teacherName: 'Phương', notes: 'GV bộ môn dạy Bồi dưỡng Tin học' };

  // 2A (grade 2): no TA
  sched['2A']['T5_C_2'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
  sched['2A']['T5_C_3'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
  sched['2A']['T6_S_2'] = { subjectCode: 'BD_NT', teacherName: 'Tâm', notes: 'GV bộ môn dạy Bồi dưỡng Nghệ thuật' };

  // 1B (grade 1): no TA
  sched['1B']['T4_S_4'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
  sched['1B']['T5_S_3'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
  sched['1B']['T6_S_2'] = { subjectCode: 'BD_NT', teacherName: 'Thy', notes: 'GV bộ môn dạy Bồi dưỡng Nghệ thuật' };

  // 2B (grade 2): no TA
  sched['2B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
  sched['2B']['T4_C_3'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
  sched['2B']['T6_S_2'] = { subjectCode: 'BD_TD', teacherName: 'Thịnh', notes: 'GV bộ môn dạy Bồi dưỡng TDTT' };

  // Upper grades: ensure Nương teaches TA max 1/day, no BD_TA duplicate on T6
  sched['3A']['T6_S_3'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
  sched['4A']['T6_S_3'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
  sched['4B']['T6_S_3'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
  sched['5B']['T6_S_3'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };

  // ==========================================
  // STEP 3: DE-CONFLICT ALL SLOTS
  // ==========================================

  // T2_C_1: Thịnh was at 5A & 1B
  sched['5A']['T2_C_1'] = { subjectCode: 'HDTN_CD', teacherName: 'Phước', notes: 'HĐTN Tiết 2 - GV tăng cường dạy' };
  sched['1B']['T2_C_1'] = { subjectCode: 'MT', teacherName: 'Thy', notes: 'Mỹ thuật Điểm 2' };
  sched['1B']['T2_C_2'] = { subjectCode: 'GDTC', teacherName: 'Thịnh', notes: 'GDTC Điểm 2' };
  sched['1B']['T2_C_3'] = { subjectCode: 'HDTN_CD', teacherName: 'Nhàn', notes: 'HĐTN Tiết 2 - GV tăng cường dạy' };

  // T3_S_4: Tâm was at 2A & 4B
  sched['4B']['T3_S_4'] = { subjectCode: 'MT', teacherName: 'Thy', notes: 'Mỹ thuật Điểm 2' };

  // T3_C_1: Phương was at 5A & 4B
  sched['5A']['T3_C_1'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };

  // T3_C_2: Thịnh was at 1A, 5A, 5B
  sched['1A']['T3_C_2'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
  sched['5B']['T3_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };

  // T3_C_3: Phước at 1A & 1B; Tâm at 3A & 4B
  sched['1B']['T3_C_3'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
  sched['4B']['T3_C_3'] = { subjectCode: 'HDTN_CD', teacherName: 'Thy', notes: 'HĐTN Tiết 2 - GV bộ môn kiêm nhiệm dạy' };

  // T4_C_1: Tâm at 2B & 5B
  sched['2B']['T4_C_1'] = { subjectCode: 'AN', teacherName: 'Thy', notes: 'Âm nhạc Điểm 2' };
  sched['5B']['T4_C_1'] = { subjectCode: 'MT', teacherName: 'Tâm', notes: 'Mỹ thuật Điểm 2' };

  // T4_C_2:
  sched['5A']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Quan', notes: 'GV tăng cường dạy' };
  sched['1B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
  sched['2B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Thy', notes: 'GV bộ môn kiêm nhiệm dạy' };

  // T4_C_3: Thịnh was at 4A & 1B; Nương at 5A & 2B
  sched['4A']['T4_C_3'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
  sched['1B']['T4_C_3'] = { subjectCode: 'BD_TD', teacherName: 'Thịnh', notes: 'GV bộ môn dạy Bồi dưỡng TDTT' };
  sched['2B']['T4_C_3'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };

  // T5_S_3: Nương at 4A & 1B; Quan at 3B & 4B
  sched['4B']['T5_S_3'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };

  // T5_S_4: Nương at 1A & 5A; Quan at 2A & 1B; Thy at 3B, 4B, 5B
  sched['1B']['T5_S_4'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
  sched['4B']['T5_S_4'] = { subjectCode: 'AN', teacherName: 'Tâm', notes: 'Âm nhạc Điểm 2' };
  sched['5B']['T5_S_4'] = { subjectCode: 'AN', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };

  // T5_C_1: Nương at 1A & 3B; Phương at 2A & 5B; Thy at 3A & 5A
  sched['5B']['T5_C_1'] = { subjectCode: 'TH', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
  sched['5A']['T5_C_1'] = { subjectCode: 'MT', teacherName: 'Tâm', notes: 'Mỹ thuật Điểm 1' };

  // T5_C_2: Phương at 1A & 3B; Nương at 2A & 4B; Thịnh at 2B & 5B
  sched['1A']['T5_C_2'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
  sched['5B']['T5_C_2'] = { subjectCode: 'GDTC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };

  // T5_C_3: Nương at 2A & 5B
  // 2A TA already removed above, now Phước.

  // T6_S_2: Thịnh at 3A, 5A, 5B
  sched['3A']['T6_S_2'] = { subjectCode: 'GDTC', teacherName: 'Thịnh', notes: 'GDTC Điểm 1' };
  sched['5A']['T6_S_2'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
  sched['5B']['T6_S_2'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };

  // T6_S_3: Phương at 1B & 2B
  sched['1B']['T6_S_3'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
  sched['2B']['T6_S_3'] = { subjectCode: 'BD_TH', teacherName: 'Phương', notes: 'GV bộ môn dạy Bồi dưỡng Tin học' };

  return sched;
}

const cleaned = buildCleanBlueprint();
const v = auditSchedule(cleaned);
console.log('Total violations after buildCleanBlueprint:', v.length);
for (const x of v) {
  console.log(`[${x.code}] ${x.title} :: ${x.description}`);
}
