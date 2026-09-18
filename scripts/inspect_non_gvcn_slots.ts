import { MASTER_BLUEPRINT } from '../src/solver/scheduleBlueprint';
import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP } from '../src/data/initialData';

// Map of non-GVCN slots
const slotsByClass: Record<string, string[]> = {};

for (const c of ALL_CLASSES) {
  const gvcn = GVCN_MAP[c.id];
  slotsByClass[c.id] = [];
  for (const s of TIME_SLOTS) {
    const slot = MASTER_BLUEPRINT[c.id]?.[s.id];
    // In 5A, T4_C_1 and T4_C_2 are also non-GVCN slots
    if (!slot || slot.teacherName !== gvcn) {
      slotsByClass[c.id].push(s.id);
    }
  }
  console.log(`Class ${c.id} (${slotsByClass[c.id].length} non-GVCN slots): ${slotsByClass[c.id].join(', ')}`);
}
