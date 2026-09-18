import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP, DEFAULT_GVCN_POLICIES } from '../src/data/initialData';
import { MASTER_BLUEPRINT, BlueprintSlot } from '../src/solver/scheduleBlueprint';
import { auditSchedule } from '../src/solver/cspSolver';
import * as fs from 'fs';

interface SlotRef {
  classId: string;
  slotId: string;
  campus: 'diem1' | 'diem2';
  day: number;
  session: 'S' | 'C';
  period: number;
}

// 1. Collect all non-GVCN slots
const nonGvcnSlots: SlotRef[] = [];
for (const c of ALL_CLASSES) {
  const gvcn = GVCN_MAP[c.id];
  for (const s of TIME_SLOTS) {
    const existing = MASTER_BLUEPRINT[c.id]?.[s.id];
    // In 5A, T4_C_1 and T4_C_2 are also non-GVCN slots
    if (!existing || existing.teacherName !== gvcn) {
      nonGvcnSlots.push({
        classId: c.id,
        slotId: s.id,
        campus: c.campus,
        day: s.day,
        session: s.session,
        period: s.period,
      });
    }
  }
}

console.log('Total non-GVCN slots:', nonGvcnSlots.length);
console.log('Campus 1 slots:', nonGvcnSlots.filter(s => s.campus === 'diem1').length);
console.log('Campus 2 slots:', nonGvcnSlots.filter(s => s.campus === 'diem2').length);
