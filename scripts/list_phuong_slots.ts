import { MASTER_BLUEPRINT } from '../src/solver/scheduleBlueprint';
import { ALL_CLASSES, TIME_SLOTS } from '../src/data/initialData';

const slots: any[] = [];
for (const c of ALL_CLASSES) {
  for (const s of TIME_SLOTS) {
    const slot = MASTER_BLUEPRINT[c.id]?.[s.id];
    if (slot && slot.teacherName === 'Phương') {
      slots.push({ classId: c.id, slotId: s.id, subjectCode: slot.subjectCode, day: s.day, session: s.session, period: s.period });
    }
  }
}

console.log(`Phương total slots: ${slots.length}`);
for (const s of slots) {
  console.log(`- ${s.classId} ${s.slotId} (${s.subjectCode})`);
}
