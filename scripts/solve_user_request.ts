import { MASTER_BLUEPRINT, BlueprintSlot } from '../src/solver/scheduleBlueprint';
import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP, ALL_TEACHERS } from '../src/data/initialData';

// Clone blueprint
const current = JSON.parse(JSON.stringify(MASTER_BLUEPRINT)) as Record<string, Record<string, BlueprintSlot>>;

// Let's check the current slots of each class and see what TH, AN, MT, TNXH, TC slots exist
console.log('Classes:', ALL_CLASSES.map(c => c.id));

// Check TH slots:
for (const c of ALL_CLASSES) {
  const thSlots: string[] = [];
  const anSlots: string[] = [];
  const mtSlots: string[] = [];
  for (const s of TIME_SLOTS) {
    const slot = current[c.id]?.[s.id];
    if (slot?.subjectCode === 'TH') thSlots.push(`${s.id}(${slot.teacherName})`);
    if (slot?.subjectCode === 'AN') anSlots.push(`${s.id}(${slot.teacherName})`);
    if (slot?.subjectCode === 'MT') mtSlots.push(`${s.id}(${slot.teacherName})`);
  }
  console.log(`Class ${c.id}: TH=[${thSlots.join(', ')}], AN=[${anSlots.join(', ')}], MT=[${mtSlots.join(', ')}]`);
}
