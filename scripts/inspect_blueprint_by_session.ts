import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP } from '../src/data/initialData';
import { MASTER_BLUEPRINT } from '../src/solver/scheduleBlueprint';

const sessions = ['T2_S', 'T2_C', 'T3_S', 'T3_C', 'T4_S', 'T4_C', 'T5_S', 'T5_C', 'T6_S'];
for (const sess of sessions) {
  console.log(`=== SESSION ${sess} ===`);
  for (const c of ALL_CLASSES) {
    const gvcn = GVCN_MAP[c.id];
    const nonGvcnSlots: string[] = [];
    for (const s of TIME_SLOTS) {
      if (s.id.startsWith(sess)) {
        const slot = MASTER_BLUEPRINT[c.id]?.[s.id];
        if (!slot || slot.teacherName !== gvcn) {
          nonGvcnSlots.push(`${s.id} (${slot ? slot.teacherName + ':' + slot.subjectCode : 'EMPTY'})`);
        }
      }
    }
    if (nonGvcnSlots.length > 0) {
      console.log(`  ${c.id} (${c.campus}): ${nonGvcnSlots.join(', ')}`);
    }
  }
}
