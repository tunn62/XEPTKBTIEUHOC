import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP } from '../src/data/initialData';
import { MASTER_BLUEPRINT } from '../src/solver/scheduleBlueprint';

for (const c of ALL_CLASSES) {
  const gvcn = GVCN_MAP[c.id];
  let count = 0;
  for (const s of TIME_SLOTS) {
    if (MASTER_BLUEPRINT[c.id]?.[s.id]?.teacherName === gvcn) {
      count++;
    }
  }
  console.log(`Class ${c.id}: GVCN ${gvcn} has ${count} slots.`);
}
