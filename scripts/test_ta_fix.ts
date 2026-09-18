import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP, DEFAULT_GVCN_POLICIES } from '../src/data/initialData';
import { auditSchedule, isDiem1 } from '../src/solver/cspSolver';
import { MASTER_BLUEPRINT, BlueprintSlot } from '../src/solver/scheduleBlueprint';

type ScheduleMap = Record<string, Record<string, BlueprintSlot>>;

// Let's test clearing TA from 1A, 2A, 1B, 2B and replacing with TC (Phước/Nhàn)
function testTaFix(): ScheduleMap {
  const result: ScheduleMap = JSON.parse(JSON.stringify(MASTER_BLUEPRINT));

  // 1A
  result['1A']['T5_S_4'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
  result['1A']['T5_C_1'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
  result['1A']['T6_S_2'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };

  // 2A
  result['2A']['T5_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
  result['2A']['T5_C_3'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
  result['2A']['T6_S_2'] = { subjectCode: 'BD_TH', teacherName: 'Phương', notes: 'GV bộ môn dạy Bồi dưỡng Tin học' };

  // 1B
  result['1B']['T4_S_4'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
  result['1B']['T5_S_3'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
  result['1B']['T6_S_2'] = { subjectCode: 'BD_NT', teacherName: 'Tâm', notes: 'GV bộ môn dạy Bồi dưỡng Nghệ thuật' };

  // 2B
  result['2B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn', notes: 'GV tăng cường dạy' };
  result['2B']['T4_C_3'] = { subjectCode: 'TC', teacherName: 'Phước', notes: 'GV tăng cường dạy' };
  result['2B']['T6_S_2'] = { subjectCode: 'BD_TH', teacherName: 'Phương', notes: 'GV bộ môn dạy Bồi dưỡng Tin học' };

  return result;
}

const s = testTaFix();
const v = auditSchedule(s);
const taViolations = v.filter(x => x.code.startsWith('TA_'));
console.log('TA violations count:', taViolations.length);
