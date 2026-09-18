import { MASTER_BLUEPRINT } from '../src/solver/scheduleBlueprint';

const teacherCounts: Record<string, number> = {};
const teacherSubjects: Record<string, Record<string, number>> = {};
let emptySlots = 0;
let totalSlots = 0;

for (const classId of Object.keys(MASTER_BLUEPRINT)) {
  for (const slotId of Object.keys(MASTER_BLUEPRINT[classId])) {
    totalSlots++;
    const slot = MASTER_BLUEPRINT[classId][slotId];
    if (!slot || !slot.teacherName || !slot.subjectCode) {
      emptySlots++;
      continue;
    }
    const t = slot.teacherName;
    const sub = slot.subjectCode;
    teacherCounts[t] = (teacherCounts[t] || 0) + 1;
    if (!teacherSubjects[t]) teacherSubjects[t] = {};
    teacherSubjects[t][sub] = (teacherSubjects[t][sub] || 0) + 1;
  }
}

console.log('Total slots:', totalSlots, 'Empty slots:', emptySlots);
console.log('\n--- TEACHER ASSIGNMENTS ---');
for (const [t, count] of Object.entries(teacherCounts)) {
  console.log(`${t.padEnd(10)}: ${count} tiết ->`, teacherSubjects[t]);
}
