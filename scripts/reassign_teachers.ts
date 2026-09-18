import { ALL_CLASSES, TIME_SLOTS } from '../src/data/initialData';
import { MASTER_BLUEPRINT, BlueprintSlot } from '../src/solver/scheduleBlueprint';
import { auditSchedule } from '../src/solver/cspSolver';
import * as fs from 'fs';

const sched: Record<string, Record<string, BlueprintSlot>> = JSON.parse(JSON.stringify(MASTER_BLUEPRINT));

// Fill missing 5A slots
sched['5A']['T4_C_1'] = { subjectCode: 'TC', teacherName: 'Phước' };
sched['5A']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Phước' };

// Let's count current workload for each teacher in MASTER_BLUEPRINT
const teacherCounts: Record<string, number> = {};
const teacherSlots: Record<string, { classId: string; slotId: string; subjectCode: string }[]> = {};

for (const c of ALL_CLASSES) {
  for (const s of TIME_SLOTS) {
    const slot = sched[c.id]?.[s.id];
    if (slot) {
      const t = slot.teacherName;
      teacherCounts[t] = (teacherCounts[t] || 0) + 1;
      if (!teacherSlots[t]) teacherSlots[t] = [];
      teacherSlots[t].push({ classId: c.id, slotId: s.id, subjectCode: slot.subjectCode });
    }
  }
}

console.log('Current teacher counts in sched:');
for (const [t, count] of Object.entries(teacherCounts)) {
  console.log(`${t.padEnd(10)}: ${count}`);
}

// Check Phương's non-TH slots:
console.log('\nPhương non-TH slots:');
const phươngNonTH = teacherSlots['Phương'].filter(s => s.subjectCode !== 'TH');
console.log(phươngNonTH);

// Check Tâm's non-AN slots:
console.log('\nTâm non-AN slots:');
const tâmNonAN = teacherSlots['Tâm'].filter(s => s.subjectCode !== 'AN' && s.subjectCode !== 'BD_AN');
console.log(tâmNonAN);

// Check Thy's extra slots:
console.log('\nThy slots:');
console.log(teacherSlots['Thy']);
