import { MASTER_BLUEPRINT } from '../src/solver/scheduleBlueprint';
import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP } from '../src/data/initialData';
import * as fs from 'fs';

const fixedSched: Record<string, Record<string, any>> = {};
const freeSlots: any[] = [];

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
        period: s.period,
        day: s.day
      });
    }
  }
}

// Requirements:
// Diem 1:
// 1A: AN (Tâm), BD_AN (Tâm), MT (Thy), BD_MT (Thy), TC (Phước), TC (Phước), TC (Quan) -> 7 slots
// 2A: AN (Tâm), BD_AN (Tâm), MT (Thy), BD_MT (Thy), TC (Phước), TC (Phước), TC (Phước), TC (Quan) -> 8 slots
// 3A: AN (Tâm), BD_AN (Tâm), MT (Thy), BD_MT (Thy), HDTN_CD (Thy), TC (Phước), TC (Phước), TC (Phước) -> 8 slots
// 4A: AN (Tâm), BD_AN (Tâm), MT (Thy), BD_MT (Thy), TC (Phước), TC (Phước), TC (Phước), TC (Quan) -> 8 slots
// 5A: AN (Tâm), BD_AN (Tâm), MT (Thy), BD_MT (Thy), TC (Phước), TC (Phước), TC (Quan), TC (Quan), HDTN_CD (Quan) -> 9 slots (wait, 5A has 10 free slots! Let's check!)

fs.writeFileSync('scripts/problem_data.json', JSON.stringify({ fixedSched, freeSlots }, null, 2), 'utf8');
console.log('Exported problem_data.json successfully!');
