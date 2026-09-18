import { MASTER_BLUEPRINT } from '../src/solver/scheduleBlueprint';
import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP, DEFAULT_GVCN_POLICIES } from '../src/data/initialData';

for (const c of ALL_CLASSES) {
  const gvcn = GVCN_MAP[c.id];
  const gvcnSlots: string[] = [];
  const nonGvcnSlots: { slotId: string; teacher: string; subject: string }[] = [];
  
  for (const s of TIME_SLOTS) {
    const slot = MASTER_BLUEPRINT[c.id]?.[s.id];
    if (!slot) continue;
    if (slot.teacherName === gvcn) {
      gvcnSlots.push(s.id);
    } else {
      nonGvcnSlots.push({ slotId: s.id, teacher: slot.teacherName, subject: slot.subjectCode });
    }
  }
  
  console.log(`Class ${c.id}: GVCN ${gvcn} has ${gvcnSlots.length} slots. Non-GVCN has ${nonGvcnSlots.length} slots.`);
}
