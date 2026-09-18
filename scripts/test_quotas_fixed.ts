import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP, DEFAULT_GVCN_POLICIES } from '../src/data/initialData';
import { auditSchedule, isDiem1 } from '../src/solver/cspSolver';
import { MASTER_BLUEPRINT, BlueprintSlot } from '../src/solver/scheduleBlueprint';
import * as fs from 'fs';

// Let's create a builder for the 10 classes
type ScheduleMap = Record<string, Record<string, BlueprintSlot>>;

function generateConflictFreeSchedule(): ScheduleMap {
  const result: ScheduleMap = JSON.parse(JSON.stringify(MASTER_BLUEPRINT));

  // 1. Adjust GVCN quotas:
  // 2A: Trang target 17
  result['2A']['T2_C_3'] = { subjectCode: 'TC_TOAN', teacherName: 'Phước', notes: 'GV tăng cường dạy Tăng cường Toán (hỗ trợ Tổ Trưởng)' };
  result['2A']['T4_C_2'] = { subjectCode: 'TC_TV', teacherName: 'Phước', notes: 'GV tăng cường dạy Tăng cường Tiếng Việt (hỗ trợ Tổ Trưởng)' };

  // 1B: Bé Năm target 18
  result['1B']['T5_C_3'] = { subjectCode: 'TC_TV', teacherName: 'Nhàn', notes: 'GV tăng cường dạy Tăng cường Tiếng Việt (hỗ trợ Tổ Phó)' };

  // 2B: Chinh target 19 (currently 21: TV 9 -> change 2 TV to TC)
  result['2B']['T4_S_4'] = { subjectCode: 'TC', teacherName: 'Quan', notes: 'GV tăng cường dạy' };
  result['2B']['T5_S_4'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };

  // 3B: Đạt target 19 (currently 20: change T4_C_2 TV to TC)
  result['3B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };

  // 4B: Yến target 19 (currently 20: change T4_C_2 TV to TC)
  result['4B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };

  // 5B: Huế target 19 (currently 20: change T4_C_2 TV to TC)
  result['5B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };

  return result;
}

const sched = generateConflictFreeSchedule();
const violations = auditSchedule(sched);
console.log('Violations after quota adjustment:', violations.length);
const byCode: Record<string, number> = {};
for (const v of violations) byCode[v.code] = (byCode[v.code] || 0) + 1;
console.log('Violations by code:', byCode);
