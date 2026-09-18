import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP, DEFAULT_GVCN_POLICIES } from '../src/data/initialData';
import { auditSchedule, isDiem1 } from '../src/solver/cspSolver';
import { MASTER_BLUEPRINT, BlueprintSlot } from '../src/solver/scheduleBlueprint';

type ScheduleMap = Record<string, Record<string, BlueprintSlot>>;

// Let's inspect the exact remaining collisions and campus transits
const sched: ScheduleMap = JSON.parse(JSON.stringify(MASTER_BLUEPRINT));

// Apply quota fixes first
sched['2A']['T2_C_3'] = { subjectCode: 'TC_TOAN', teacherName: 'Phước', notes: 'GV tăng cường dạy Tăng cường Toán (hỗ trợ Tổ Trưởng)' };
sched['2A']['T4_C_2'] = { subjectCode: 'TC_TV', teacherName: 'Phước', notes: 'GV tăng cường dạy Tăng cường Tiếng Việt (hỗ trợ Tổ Trưởng)' };

sched['1B']['T5_C_3'] = { subjectCode: 'TC_TV', teacherName: 'Nhàn', notes: 'GV tăng cường dạy Tăng cường Tiếng Việt (hỗ trợ Tổ Phó)' };

sched['2B']['T4_S_4'] = { subjectCode: 'TC', teacherName: 'Quan', notes: 'GV tăng cường dạy' };
sched['2B']['T5_S_4'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };

sched['3B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
sched['4B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
sched['5B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };

// Apply TA fixes (no duplicate TA in grades 1 & 2)
sched['1A']['T5_S_4'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
sched['1A']['T5_C_1'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
sched['1A']['T6_S_2'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };

sched['2A']['T5_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
sched['2A']['T5_C_3'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
sched['2A']['T6_S_2'] = { subjectCode: 'BD_TH', teacherName: 'Phương', notes: 'GV bộ môn dạy Bồi dưỡng Tin học' };

sched['1B']['T4_S_4'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
sched['1B']['T5_S_3'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
sched['1B']['T6_S_2'] = { subjectCode: 'BD_NT', teacherName: 'Tâm', notes: 'GV bộ môn dạy Bồi dưỡng Nghệ thuật' };

sched['2B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
sched['2B']['T4_C_3'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
sched['2B']['T6_S_2'] = { subjectCode: 'BD_TH', teacherName: 'Phương', notes: 'GV bộ môn dạy Bồi dưỡng Tin học' };

const violations = auditSchedule(sched);
console.log('Remaining violations:', violations.length);
for (const v of violations) {
  console.log(`[${v.code}] ${v.title} :: ${v.description}`);
}
