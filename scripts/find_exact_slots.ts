import { MASTER_BLUEPRINT } from '../src/solver/scheduleBlueprint';
import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP } from '../src/data/initialData';

// We keep all GVCN slots, all Nương (TA) slots, all Thịnh (GDTC) slots (with 5A 2nd GDTC at T4_S_4), and all Phương (TH) slots.
// Everything else is a free slot to be assigned to Tâm, Thy, Phước, Nhàn, Quan!

const fixedTeachers = new Set(['Nương', 'Thịnh', 'Phương']);

const freeSlots: { classId: string; slotId: string; campus: string; session: string; period: number }[] = [];

// Determine fixed schedule
const fixedSched: Record<string, Record<string, any>> = {};

for (const c of ALL_CLASSES) {
  fixedSched[c.id] = {};
  const gvcn = GVCN_MAP[c.id];
  for (const s of TIME_SLOTS) {
    let slot = MASTER_BLUEPRINT[c.id]?.[s.id];

    // Special fix for 5A: T4_S_4 is Thịnh:GDTC, T4_C_3 is Tuấn:KH
    if (c.id === '5A' && s.id === 'T4_S_4') {
      slot = { subjectCode: 'GDTC', teacherName: 'Thịnh' };
    }
    if (c.id === '5A' && s.id === 'T4_C_3') {
      slot = { subjectCode: 'KH', teacherName: 'Tuấn' };
    }
    // Phương 10 TH only:
    // If slot was Phương but not one of the 10 chosen TH slots, it's free!
    const isChosenTH = (
      (c.id === '1A' && s.id === 'T5_C_2') ||
      (c.id === '2A' && s.id === 'T5_C_1') ||
      (c.id === '3A' && s.id === 'T2_C_1') ||
      (c.id === '4A' && s.id === 'T2_C_2') ||
      (c.id === '5A' && s.id === 'T2_C_3') ||
      (c.id === '1B' && s.id === 'T3_S_4') ||
      (c.id === '2B' && s.id === 'T4_S_2') ||
      (c.id === '3B' && s.id === 'T5_S_2') ||
      (c.id === '4B' && s.id === 'T3_S_2') ||
      (c.id === '5B' && s.id === 'T3_S_3')
    );

    const isFixed = slot && (
      slot.teacherName === gvcn ||
      slot.teacherName === 'Nương' ||
      (slot.teacherName === 'Thịnh' && slot.subjectCode === 'GDTC') ||
      (slot.teacherName === 'Phương' && isChosenTH)
    );

    if (isFixed) {
      if (slot.teacherName === 'Phương') {
        fixedSched[c.id][s.id] = { subjectCode: 'TH', teacherName: 'Phương' };
      } else {
        fixedSched[c.id][s.id] = slot;
      }
    } else {
      freeSlots.push({
        classId: c.id,
        slotId: s.id,
        campus: c.campus,
        session: `${s.day}_${s.session}`,
        period: s.period
      });
    }
  }
}

console.log(`Total fixed slots: ${320 - freeSlots.length}`);
console.log(`Total free slots: ${freeSlots.length}`);

// Group free slots by session:
const bySess: Record<string, any[]> = {};
for (const fs of freeSlots) {
  if (!bySess[fs.session]) bySess[fs.session] = [];
  bySess[fs.session].push(fs);
}

for (const [sess, slots] of Object.entries(bySess)) {
  console.log(`\nSession ${sess}: ${slots.length} slots`);
  const c1 = slots.filter(s => s.campus === 'diem1');
  const c2 = slots.filter(s => s.campus === 'diem2');
  console.log(`  Diem 1 (${c1.length}):`, c1.map(s => `${s.classId}:${s.slotId}`).join(', '));
  console.log(`  Diem 2 (${c2.length}):`, c2.map(s => `${s.classId}:${s.slotId}`).join(', '));
}
