import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP, DEFAULT_GVCN_POLICIES } from '../src/data/initialData';
import { MASTER_BLUEPRINT, BlueprintSlot } from '../src/solver/scheduleBlueprint';
import { auditSchedule } from '../src/solver/cspSolver';
import * as fs from 'fs';

// Let's create a complete schedule solver that constructs the full schedule table.
// 1. Keep all 187 GVCN slots exactly as they are (since they already satisfy all GVCN quotas, 2 afternoons off, Math 1/day, and TV pairs).
// 2. Clear all 133 non-GVCN slots.
// 3. Systematically assign the non-GVCN slots to:
//    - Thịnh (20 GDTC)
//    - Nương (20 TA)
//    - Phương (10 TH)
//    - Tâm (10 AN + 10 BD_AN = 20)
//    - Thy (10 MT + 10 BD_MT + 2 HDTN_CD = 22)
//    - Phước (19 TNXH/TC/HDTN)
//    - Nhàn (16 TC/HDTN)
//    - Quan (6 TC/HDTN)

const schedule: Record<string, Record<string, BlueprintSlot>> = {};

// Initialize with GVCN slots
for (const c of ALL_CLASSES) {
  schedule[c.id] = {};
  const gvcn = GVCN_MAP[c.id];
  for (const s of TIME_SLOTS) {
    const existing = MASTER_BLUEPRINT[c.id]?.[s.id];
    if (existing && existing.teacherName === gvcn) {
      schedule[c.id][s.id] = { ...existing };
    }
  }
}

console.log('GVCN slots initialized for all 10 classes.');
