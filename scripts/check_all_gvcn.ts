import { MASTER_BLUEPRINT } from '../src/solver/scheduleBlueprint';
import { ALL_CLASSES, GVCN_MAP, DEFAULT_GVCN_POLICIES } from '../src/data/initialData';

console.log('--- GVCN WORKLOAD CHECK ---');
for (const c of ALL_CLASSES) {
  const gvcn = GVCN_MAP[c.id];
  let count = 0;
  for (const [slot, data] of Object.entries(MASTER_BLUEPRINT[c.id] || {})) {
    if (data.teacherName === gvcn) count++;
  }
  const target = DEFAULT_GVCN_POLICIES[c.id].targetPeriods;
  const role = DEFAULT_GVCN_POLICIES[c.id].roleTitle;
  console.log(`${c.id} (${gvcn}): ${count} / target ${target} (${role}) => ${count === target ? 'OK' : 'MISMATCH'}`);
}
