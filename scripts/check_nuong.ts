import { MASTER_BLUEPRINT } from '../src/solver/scheduleBlueprint';

const nuongSlots: Array<{ classId: string; slotId: string; subject: string }> = [];
for (const [classId, slots] of Object.entries(MASTER_BLUEPRINT)) {
  for (const [slotId, data] of Object.entries(slots)) {
    if (data.teacherName === 'Nương') {
      nuongSlots.push({ classId, slotId, subject: data.subjectCode });
    }
  }
}

console.log(`Nương has ${nuongSlots.length} periods assigned:`);
const byClass: Record<string, number> = {};
for (const s of nuongSlots) {
  byClass[s.classId] = (byClass[s.classId] || 0) + 1;
}
console.log('By class:', byClass);
