import { MASTER_BLUEPRINT } from '../src/solver/scheduleBlueprint';
import { ALL_CLASSES, TIME_SLOTS } from '../src/data/initialData';

for (const c of ALL_CLASSES) {
  for (const s of TIME_SLOTS) {
    if (!MASTER_BLUEPRINT[c.id]?.[s.id]) {
      console.log(`MISSING SLOT: Class ${c.id} Slot ${s.id} (${s.dayName} ${s.sessionName} Tiết ${s.period})`);
    }
  }
}
