import { MASTER_BLUEPRINT } from '../src/solver/scheduleBlueprint';
import { ALL_CLASSES, GVCN_MAP } from '../src/data/initialData';

for (const c of ALL_CLASSES) {
  const gvcn = GVCN_MAP[c.id];
  const subjCounts: Record<string, { total: number; gvcn: number; specialist: Record<string, number> }> = {};
  for (const [slotId, slot] of Object.entries(MASTER_BLUEPRINT[c.id])) {
    const s = slot.subjectCode;
    if (!subjCounts[s]) subjCounts[s] = { total: 0, gvcn: 0, specialist: {} };
    subjCounts[s].total++;
    if (slot.teacherName === gvcn) {
      subjCounts[s].gvcn++;
    } else {
      subjCounts[s].specialist[slot.teacherName] = (subjCounts[s].specialist[slot.teacherName] || 0) + 1;
    }
  }
  console.log(`\n=== CLASS ${c.id} (GVCN: ${gvcn}) ===`);
  for (const [s, data] of Object.entries(subjCounts)) {
    console.log(`  ${s}: total ${data.total} (GVCN: ${data.gvcn}, Specialist: ${JSON.stringify(data.specialist)})`);
  }
}
