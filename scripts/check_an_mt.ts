import { MASTER_BLUEPRINT } from '../src/solver/scheduleBlueprint';
import { ALL_CLASSES, TIME_SLOTS } from '../src/data/initialData';

const anSlots: any[] = [];
const mtSlots: any[] = [];
for (const c of ALL_CLASSES) {
  for (const s of TIME_SLOTS) {
    const slot = MASTER_BLUEPRINT[c.id]?.[s.id];
    if (slot) {
      if (slot.subjectCode === 'AN' || slot.subjectCode === 'BD_AN') {
        anSlots.push({ classId: c.id, slotId: s.id, teacherName: slot.teacherName, subjectCode: slot.subjectCode });
      }
      if (slot.subjectCode === 'MT' || slot.subjectCode === 'BD_MT') {
        mtSlots.push({ classId: c.id, slotId: s.id, teacherName: slot.teacherName, subjectCode: slot.subjectCode });
      }
    }
  }
}

console.log('Current AN / BD_AN slots count:', anSlots.length);
console.log(anSlots);

console.log('\nCurrent MT / BD_MT slots count:', mtSlots.length);
console.log(mtSlots);
