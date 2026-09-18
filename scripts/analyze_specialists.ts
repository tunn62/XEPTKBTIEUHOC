import { MASTER_BLUEPRINT } from '../src/solver/scheduleBlueprint';
import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP } from '../src/data/initialData';

console.log('--- CURRENT SLOTS FOR SPECIALIST TEACHERS ---');
for (const teacher of ['Phương', 'Tâm', 'Thy', 'Phước', 'Thịnh', 'Nương', 'Nhàn', 'Quan']) {
  const slots: { classId: string; slotId: string; subject: string }[] = [];
  for (const c of ALL_CLASSES) {
    for (const s of TIME_SLOTS) {
      const slot = MASTER_BLUEPRINT[c.id]?.[s.id];
      if (slot?.teacherName === teacher) {
        slots.push({ classId: c.id, slotId: s.id, subject: slot.subjectCode });
      }
    }
  }
  console.log(`\nTeacher: ${teacher} (${slots.length} slots):`);
  const bySubj: Record<string, number> = {};
  for (const s of slots) {
    bySubj[s.subject] = (bySubj[s.subject] || 0) + 1;
  }
  console.log('  Subjects:', bySubj);
  console.log('  Details:', slots.map(x => `${x.classId}:${x.slotId}(${x.subject})`).join(', '));
}
