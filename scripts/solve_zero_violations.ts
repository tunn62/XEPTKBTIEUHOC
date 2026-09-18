import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP, DEFAULT_GVCN_POLICIES } from '../src/data/initialData';
import { auditSchedule, isDiem1 } from '../src/solver/cspSolver';
import { MASTER_BLUEPRINT, BlueprintSlot } from '../src/solver/scheduleBlueprint';
import * as fs from 'fs';

type ScheduleMap = Record<string, Record<string, BlueprintSlot>>;

// Let's create an optimized blueprint
const sched: ScheduleMap = JSON.parse(JSON.stringify(MASTER_BLUEPRINT));

// ==========================================
// 1. Quotas: Trang 17, Năm 18, Others 19
// ==========================================
sched['2A']['T2_C_3'] = { subjectCode: 'TC_TOAN', teacherName: 'Phước', notes: 'GV tăng cường dạy Tăng cường Toán (hỗ trợ Tổ Trưởng)' };
sched['2A']['T4_C_2'] = { subjectCode: 'TC_TV', teacherName: 'Phước', notes: 'GV tăng cường dạy Tăng cường Tiếng Việt (hỗ trợ Tổ Trưởng)' };

sched['1B']['T5_C_3'] = { subjectCode: 'TC_TV', teacherName: 'Nhàn', notes: 'GV tăng cường dạy Tăng cường Tiếng Việt (hỗ trợ Tổ Phó)' };

sched['2B']['T4_S_4'] = { subjectCode: 'TC', teacherName: 'Quan', notes: 'GV tăng cường dạy' };
sched['2B']['T5_S_4'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };

sched['3B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
sched['4B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
sched['5B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };

// ==========================================
// 2. Eliminate duplicate English in 1A, 2A, 1B, 2B
// ==========================================
sched['1A']['T5_S_4'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
sched['1A']['T5_C_1'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
sched['1A']['T6_S_2'] = { subjectCode: 'BD_TH', teacherName: 'Phương', notes: 'GV bộ môn dạy Bồi dưỡng Tin học' };

sched['2A']['T5_C_2'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
sched['2A']['T5_C_3'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
sched['2A']['T6_S_2'] = { subjectCode: 'BD_NT', teacherName: 'Tâm', notes: 'GV bộ môn dạy Bồi dưỡng Nghệ thuật' };

sched['1B']['T4_S_4'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
sched['1B']['T5_S_3'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
sched['1B']['T6_S_2'] = { subjectCode: 'BD_NT', teacherName: 'Thy', notes: 'GV bộ môn dạy Bồi dưỡng Nghệ thuật' };

sched['2B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
sched['2B']['T4_C_3'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
sched['2B']['T6_S_2'] = { subjectCode: 'BD_TD', teacherName: 'Thịnh', notes: 'GV bộ môn dạy Bồi dưỡng TDTT' };

// ==========================================
// 3. De-conflict remaining specialist slots
// ==========================================

// T2_C_1: Thịnh was at 5A & 1B
// Let 1B at T2_C_1 be Tâm (MT) or Thy, and T2_C_2 be Thịnh (GDTC Điểm 2)
sched['1B']['T2_C_1'] = { subjectCode: 'MT', teacherName: 'Thy', notes: 'Mỹ thuật Điểm 2' };
sched['1B']['T2_C_2'] = { subjectCode: 'GDTC', teacherName: 'Thịnh', notes: 'GDTC Điểm 2' };
sched['1B']['T2_C_3'] = { subjectCode: 'HDTN_CD', teacherName: 'Phước', notes: 'HĐTN Tiết 2 - GV tăng cường dạy' };

// T3_S_4: Tâm at 2A & 4B
// 2A: AN (Tâm) at Điểm 1. In 4B at Điểm 2: MT (Thy)
sched['4B']['T3_S_4'] = { subjectCode: 'MT', teacherName: 'Thy', notes: 'Mỹ thuật Điểm 2' };

// T3_C_1: Phương at 5A & 4B
// Let 5A be TC (Phước). 4B be TH (Phương Điểm 2).
sched['5A']['T3_C_1'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };

// T3_C_2: Thịnh at 1A, 5A, 5B
// Let 1A be TC (Phước), 5A be GDTC (Thịnh Điểm 1), 5B be BD_TD (Nhàn Điểm 2)
sched['1A']['T3_C_2'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
sched['5B']['T3_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };

// T3_C_3: Phước at 1A & 1B; Tâm at 3A & 4B
// 1A: Phước. 1B: Nhàn. 3A: Tâm (AN Điểm 1). 4B: Thy (HDTN_CD Điểm 2).
sched['1B']['T3_C_3'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
sched['4B']['T3_C_3'] = { subjectCode: 'HDTN_CD', teacherName: 'Thy', notes: 'HĐTN Tiết 2 - GV bộ môn kiêm nhiệm' };

// T4_C_1: Tâm at 2B & 5B
// 2B: AN (Thy Điểm 2), 5B: MT (Tâm Điểm 2)
sched['2B']['T4_C_1'] = { subjectCode: 'AN', teacherName: 'Thy', notes: 'Âm nhạc Điểm 2' };

// T4_C_2: Phương at 3A & 5A; Nhàn at 1B, 2B, 3B, 4B
// In Điểm 1: 3A has TH (Phương), 5A has TC (Phước).
sched['5A']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
// In Điểm 2 at T4_C_2:
sched['1B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
sched['2B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' }; // Wait, Phước is at Điểm 1? Let's check!

const v = auditSchedule(sched);
console.log('Current violations count after initial batch:', v.length);
