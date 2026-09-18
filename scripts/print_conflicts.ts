import { ALL_CLASSES, TIME_SLOTS, SPECIALIST_TEACHERS } from '../src/data/initialData';
import { MASTER_BLUEPRINT, BlueprintSlot } from '../src/solver/scheduleBlueprint';

type ScheduleMap = Record<string, Record<string, BlueprintSlot>>;
const sched: ScheduleMap = JSON.parse(JSON.stringify(MASTER_BLUEPRINT));

// Fix quotas:
sched['2A']['T2_C_3'] = { subjectCode: 'TC_TOAN', teacherName: 'Phước' };
sched['2A']['T4_C_2'] = { subjectCode: 'TC_TV', teacherName: 'Phước' };
sched['1B']['T5_C_3'] = { subjectCode: 'TC_TV', teacherName: 'Nhàn' };
sched['2B']['T4_S_4'] = { subjectCode: 'TC', teacherName: 'Quan' };
sched['2B']['T5_S_4'] = { subjectCode: 'TC', teacherName: 'Phước' };
sched['3B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn' };
sched['4B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn' };
sched['5B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Phước' };

// Print each slot where a teacher is in > 1 class
for (const s of TIME_SLOTS) {
  const map: Record<string, string[]> = {};
  for (const c of ALL_CLASSES) {
    const l = sched[c.id]?.[s.id];
    if (l) {
      if (!map[l.teacherName]) map[l.teacherName] = [];
      map[l.teacherName].push(`${c.id}(${l.subjectCode})`);
    }
  }
  for (const [t, list] of Object.entries(map)) {
    if (list.length > 1) {
      console.log(`Slot ${s.id}: Teacher ${t} assigned to: ${list.join(', ')}`);
    }
  }
}
