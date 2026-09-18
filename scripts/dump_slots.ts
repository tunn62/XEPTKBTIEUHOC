import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP, DEFAULT_GVCN_POLICIES } from '../src/data/initialData';
import { MASTER_BLUEPRINT } from '../src/solver/scheduleBlueprint';
import * as fs from 'fs';

const gvcnSlots: Record<string, Record<string, any>> = {};
const freeSlots: { classId: string; slotId: string; day: number; session: string; period: number; campus: string }[] = [];

for (const c of ALL_CLASSES) {
  gvcnSlots[c.id] = {};
  const gvcn = GVCN_MAP[c.id];
  for (const s of TIME_SLOTS) {
    const slot = MASTER_BLUEPRINT[c.id]?.[s.id];
    if (slot && slot.teacherName === gvcn) {
      gvcnSlots[c.id][s.id] = slot;
    } else {
      freeSlots.push({
        classId: c.id,
        slotId: s.id,
        day: s.day,
        session: s.session,
        period: s.period,
        campus: c.campus,
      });
    }
  }
}

fs.writeFileSync('scripts/gvcn_slots.json', JSON.stringify(gvcnSlots, null, 2));
fs.writeFileSync('scripts/free_slots.json', JSON.stringify(freeSlots, null, 2));
console.log('Dumped gvcn_slots and free_slots. Free slots count:', freeSlots.length);
