import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP } from '../src/data/initialData';
import { MASTER_BLUEPRINT } from '../src/solver/scheduleBlueprint';

for (const c of ALL_CLASSES) {
  const gvcn = GVCN_MAP[c.id];
  const specSlots: string[] = [];
  for (const slot of TIME_SLOTS) {
    const l = MASTER_BLUEPRINT[c.id]?.[slot.id];
    if (l && l.teacherName !== gvcn) {
      specSlots.push(`${slot.id} (${l.subjectCode})`);
    }
  }
  console.log(`Class ${c.id}: ${specSlots.length} specialist slots: ${specSlots.join(', ')}`);
}
