import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP, DEFAULT_GVCN_POLICIES } from '../src/data/initialData';
import { MASTER_BLUEPRINT, BlueprintSlot } from '../src/solver/scheduleBlueprint';
import { auditSchedule } from '../src/solver/cspSolver';
import * as fs from 'fs';

// Let's write an exact solver that assigns the remaining slots and checks every constraint.
const sched: Record<string, Record<string, BlueprintSlot>> = JSON.parse(JSON.stringify(MASTER_BLUEPRINT));

// Fill missing 5A slots
sched['5A']['T4_C_1'] = { subjectCode: 'TC', teacherName: 'Phước' };
sched['5A']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Phước' };

// 1. Thịnh GDTC (20 slots, 2 in each of 10 classes)
sched['5A']['T6_S_2'] = { subjectCode: 'GDTC', teacherName: 'Thịnh' };
sched['5B']['T4_C_3'] = { subjectCode: 'TC', teacherName: 'Nhàn' };

// 2. Phương: Exactly 10 TH slots (1 per class)
// Campus 1:
sched['3A']['T2_C_1'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['4A']['T2_C_2'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['5A']['T2_C_3'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['1A']['T5_C_2'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['2A']['T5_C_1'] = { subjectCode: 'TH', teacherName: 'Phương' };

// Campus 2:
sched['4B']['T3_S_2'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['5B']['T3_S_3'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['1B']['T3_S_4'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['2B']['T4_S_2'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['3B']['T5_S_2'] = { subjectCode: 'TH', teacherName: 'Phương' };

// Clear any old slots that had Phương
const phươngSlots = [
  ['3A', 'T4_C_1'], ['4A', 'T4_C_2'], ['5A', 'T4_C_3'], ['5A', 'T5_C_3'],
  ['3B', 'T2_S_4'], ['3B', 'T5_S_4'], ['4B', 'T4_S_4'], ['5B', 'T3_S_4'],
  ['5B', 'T5_S_3'], ['2A', 'T6_S_2']
];
for (const [cid, sid] of phươngSlots) {
  if (sched[cid][sid].teacherName === 'Phương') {
    sched[cid][sid] = { subjectCode: 'TC', teacherName: 'Phước' };
  }
}

// 3. Cô Tâm: 10 AN + 10 BD_AN = 20 slots (1 AN and 1 BD_AN per class)
// Campus 1 (10 slots: 5 AN + 5 BD_AN)
// Let's place Tâm on T3 at Campus 1:
// T3_S: 1A:T3_S_2 (AN), 2A:T3_S_3 (AN)
// T3_C: 1A:T3_C_1 (BD_AN), 2A:T3_C_2 (BD_AN)
// T4_C: 3A:T4_C_1 (AN), 3A:T4_C_3 (BD_AN), 4A:T4_C_1 (AN), 4A:T4_C_2 (BD_AN), 5A:T4_C_1 (AN), 5A:T4_C_2 (BD_AN)
sched['1A']['T3_S_2'] = { subjectCode: 'AN', teacherName: 'Tâm' };
sched['2A']['T3_S_3'] = { subjectCode: 'AN', teacherName: 'Tâm' };
sched['1A']['T3_C_1'] = { subjectCode: 'BD_AN', teacherName: 'Tâm' };
sched['2A']['T3_C_2'] = { subjectCode: 'BD_AN', teacherName: 'Tâm' };

sched['3A']['T4_C_1'] = { subjectCode: 'AN', teacherName: 'Tâm' };
sched['4A']['T4_C_1'] = { subjectCode: 'BD_AN', teacherName: 'Tâm' };
sched['5A']['T4_C_1'] = { subjectCode: 'AN', teacherName: 'Tâm' };

sched['3A']['T4_C_3'] = { subjectCode: 'BD_AN', teacherName: 'Tâm' };
sched['4A']['T4_C_2'] = { subjectCode: 'AN', teacherName: 'Tâm' };
sched['5A']['T4_C_2'] = { subjectCode: 'BD_AN', teacherName: 'Tâm' };

// Campus 2 (10 slots for Tâm: 5 AN + 5 BD_AN)
// Place on T2_C and T5:
// T2_C: 1B:T2_C_2 (AN), 2B:T2_C_3 (AN), 3B:T2_C_2 (AN)
sched['1B']['T2_C_2'] = { subjectCode: 'AN', teacherName: 'Tâm' };
sched['2B']['T2_C_3'] = { subjectCode: 'AN', teacherName: 'Tâm' };
sched['3B']['T2_C_2'] = { subjectCode: 'AN', teacherName: 'Tâm' };

// T5_S: 1B:T5_S_2 (BD_AN), 2B:T5_S_2 (BD_AN), 4B:T5_S_3 (AN), 5B:T5_S_3 (AN)
sched['1B']['T5_S_2'] = { subjectCode: 'BD_AN', teacherName: 'Tâm' };
sched['2B']['T5_S_2'] = { subjectCode: 'BD_AN', teacherName: 'Tâm' };
sched['4B']['T5_S_3'] = { subjectCode: 'AN', teacherName: 'Tâm' };
sched['5B']['T5_S_3'] = { subjectCode: 'AN', teacherName: 'Tâm' };

// T5_C: 3B:T5_C_3 (BD_AN), 4B:T5_C_1 (BD_AN), 5B:T5_C_2 (BD_AN)
sched['3B']['T5_C_3'] = { subjectCode: 'BD_AN', teacherName: 'Tâm' };
sched['4B']['T5_C_1'] = { subjectCode: 'BD_AN', teacherName: 'Tâm' };
sched['5B']['T5_C_2'] = { subjectCode: 'BD_AN', teacherName: 'Tâm' };

// 4. Cô Thy: 10 MT + 10 BD_MT = 20 slots + 2 HĐTN = 22 slots
// Campus 1 (11 slots: 5 MT + 5 BD_MT + 1 HDTN_CD)
// 1A: T3_S_4 (MT), T5_C_3 (BD_MT)
sched['1A']['T3_S_4'] = { subjectCode: 'MT', teacherName: 'Thy' };
sched['1A']['T5_C_3'] = { subjectCode: 'BD_MT', teacherName: 'Thy' };

// 2A: T3_C_3 (MT), T5_C_3 (BD_MT)
sched['2A']['T3_C_3'] = { subjectCode: 'MT', teacherName: 'Thy' };
sched['2A']['T5_C_3'] = { subjectCode: 'BD_MT', teacherName: 'Thy' };

// 3A: T2_C_3 (MT), T6_S_2 (BD_MT)
sched['3A']['T2_C_3'] = { subjectCode: 'MT', teacherName: 'Thy' };
sched['3A']['T6_S_2'] = { subjectCode: 'BD_MT', teacherName: 'Thy' };

// 4A: T2_C_3 (MT), T5_C_3 (BD_MT)
sched['4A']['T2_C_3'] = { subjectCode: 'MT', teacherName: 'Thy' };
sched['4A']['T5_C_3'] = { subjectCode: 'BD_MT', teacherName: 'Thy' };

// 5A: T2_C_2 (HDTN_CD), T4_C_3 (MT), T5_C_3 (BD_MT)
sched['5A']['T2_C_2'] = { subjectCode: 'HDTN_CD', teacherName: 'Thy' };
sched['5A']['T4_C_3'] = { subjectCode: 'MT', teacherName: 'Thy' };
sched['5A']['T5_C_3'] = { subjectCode: 'BD_MT', teacherName: 'Thy' };

// Campus 2 (11 slots for Thy: 5 MT + 5 BD_MT + 1 HDTN_CD)
// 1B: T2_S_2 (MT), T4_S_3 (BD_MT), T2_C_3 (HDTN_CD)
sched['1B']['T2_S_2'] = { subjectCode: 'MT', teacherName: 'Thy' };
sched['1B']['T4_S_3'] = { subjectCode: 'BD_MT', teacherName: 'Thy' };
sched['1B']['T2_C_3'] = { subjectCode: 'HDTN_CD', teacherName: 'Thy' };

// 2B: T2_S_3 (MT), T4_S_4 (BD_MT)
sched['2B']['T2_S_3'] = { subjectCode: 'MT', teacherName: 'Thy' };
sched['2B']['T4_S_4'] = { subjectCode: 'BD_MT', teacherName: 'Thy' };

// 3B: T2_S_4 (MT), T3_S_3 (BD_MT)
sched['3B']['T2_S_4'] = { subjectCode: 'MT', teacherName: 'Thy' };
sched['3B']['T3_S_3'] = { subjectCode: 'BD_MT', teacherName: 'Thy' };

// 4B: T3_S_4 (MT), T4_S_4 (BD_MT)
sched['4B']['T3_S_4'] = { subjectCode: 'MT', teacherName: 'Thy' };
sched['4B']['T4_S_4'] = { subjectCode: 'BD_MT', teacherName: 'Thy' };

// 5B: T3_S_4 (MT), T4_S_4 (BD_MT)
sched['5B']['T3_S_4'] = { subjectCode: 'MT', teacherName: 'Thy' };
sched['5B']['T4_S_4'] = { subjectCode: 'BD_MT', teacherName: 'Thy' };

// Now write a check to see the counts of every teacher!
console.log('Testing preliminary schedule...');
const counts: Record<string, number> = {};
const subjCounts: Record<string, Record<string, number>> = {};
for (const cid of Object.keys(sched)) {
  for (const sid of Object.keys(sched[cid])) {
    const t = sched[cid][sid].teacherName;
    const sub = sched[cid][sid].subjectCode;
    counts[t] = (counts[t] || 0) + 1;
    if (!subjCounts[t]) subjCounts[t] = {};
    subjCounts[t][sub] = (subjCounts[t][sub] || 0) + 1;
  }
}
for (const [t, c] of Object.entries(counts)) {
  console.log(`${t.padEnd(10)}: ${c} ->`, subjCounts[t]);
}

// Run audit
const viols = auditSchedule(sched);
console.log('\nViolations count:', viols.length);
for (const v of viols) {
  console.log(`- [${v.type}] ${v.title}: ${v.description}`);
}
