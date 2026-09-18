import { MASTER_BLUEPRINT, BlueprintSlot } from '../src/solver/scheduleBlueprint';
import { ALL_CLASSES, TIME_SLOTS, SPECIALIST_TEACHERS, ALL_TEACHERS } from '../src/data/initialData';
import { auditSchedule } from '../src/solver/cspSolver';
import * as fs from 'fs';

const sched: Record<string, Record<string, BlueprintSlot>> = JSON.parse(JSON.stringify(MASTER_BLUEPRINT));

// 1. Fill missing slots in 5A
sched['5A']['T4_C_1'] = { subjectCode: 'AN', teacherName: 'Tâm' };
sched['5A']['T4_C_2'] = { subjectCode: 'MT', teacherName: 'Thy' };

// 2. Thịnh: exactly 20 GDTC (2 per class)
// Swap 5A T4_S_4 (Tuấn:KH) and T4_C_3 (Phương:TH) -> Thịnh:GDTC at T4_S_4, Tuấn:KH at T4_C_3
sched['5A']['T4_S_4'] = { subjectCode: 'GDTC', teacherName: 'Thịnh' };
sched['5A']['T4_C_3'] = { subjectCode: 'KH', teacherName: 'Tuấn' };

// 5B: change Thịnh:TC_TOAN at T4_C_3 to Nhàn:TC
sched['5B']['T4_C_3'] = { subjectCode: 'TC', teacherName: 'Nhàn' };

// 3. Phương: exactly 10 TH (1 per class, no other subjects)
// 1A: T5_C_2 (was BD_TH) -> TH
sched['1A']['T5_C_2'] = { subjectCode: 'TH', teacherName: 'Phương' };
// 2A: T5_C_1 (was BD_TH) -> TH
sched['2A']['T5_C_1'] = { subjectCode: 'TH', teacherName: 'Phương' };
// 2A: T6_S_2 (was Phương:BD_TH) -> Phước:TC
sched['2A']['T6_S_2'] = { subjectCode: 'TC', teacherName: 'Phước' };
// 3A: T2_C_1 is TH (keep). T4_C_1 (was Phương:TH) -> Tâm:BD_AN
sched['3A']['T4_C_1'] = { subjectCode: 'BD_AN', teacherName: 'Tâm' };
// 4A: T2_C_2 is TH (keep). T4_C_2 (was Phương:TH) -> Thy:BD_MT
sched['4A']['T4_C_2'] = { subjectCode: 'BD_MT', teacherName: 'Thy' };
// 5A: T2_C_3 is TH (keep). T5_C_3 (was Phương:TC_TOAN) -> Tâm:BD_AN
sched['5A']['T5_C_3'] = { subjectCode: 'BD_AN', teacherName: 'Tâm' };

// Campus 2:
// 1B: T3_S_4 (was Nhàn:TNXH) -> Phương:TH
sched['1B']['T3_S_4'] = { subjectCode: 'TH', teacherName: 'Phương' };
// 2B: T4_S_2 (was Nhàn:TC) -> Phương:TH
sched['2B']['T4_S_2'] = { subjectCode: 'TH', teacherName: 'Phương' };
// 3B: T5_S_2 is TH (keep). T2_S_4 (was Phương:TH) -> Thy:MT
sched['3B']['T2_S_4'] = { subjectCode: 'MT', teacherName: 'Thy' };
// 3B: T5_S_4 (was Phương:TC) -> Nhàn:TC
sched['3B']['T5_S_4'] = { subjectCode: 'TC', teacherName: 'Nhàn' };
// 4B: T3_S_2 is TH (keep). T4_S_4 (was Phương:TH) -> Thy:BD_MT
sched['4B']['T4_S_4'] = { subjectCode: 'BD_MT', teacherName: 'Thy' };
// 5B: T3_S_3 is TH (keep). T3_S_4 (was Phương:KH) -> Thy:MT
sched['5B']['T3_S_4'] = { subjectCode: 'MT', teacherName: 'Thy' };
// 5B: T5_S_3 (was Phương:TH) -> Tâm:AN
sched['5B']['T5_S_3'] = { subjectCode: 'AN', teacherName: 'Tâm' };

// 4. Cô Tâm: exactly 10 AN + 10 BD_AN = 20
// In Campus 1:
// 1A: T3_C_1 (AN), T3_S_2 (was Tâm:TC -> BD_AN)
sched['1A']['T3_S_2'] = { subjectCode: 'BD_AN', teacherName: 'Tâm' };
// 1A: T3_S_4 (was Tâm:MT) -> Thy:MT
sched['1A']['T3_S_4'] = { subjectCode: 'MT', teacherName: 'Thy' };
// 1A: T2_C_2 (was Tâm:TC_TV) -> Thy:BD_MT
sched['1A']['T2_C_2'] = { subjectCode: 'BD_MT', teacherName: 'Thy' };

// 2A: T3_S_3 (AN), T3_C_2 (was Tâm:MT -> BD_AN)
sched['2A']['T3_C_2'] = { subjectCode: 'BD_AN', teacherName: 'Tâm' };
// 2A: T4_C_1 (was Tâm:DD) -> Phước:TC
sched['2A']['T4_C_1'] = { subjectCode: 'TC', teacherName: 'Phước' };
// 2A: T5_C_3 (was Tâm:TC) -> Thy:BD_MT
sched['2A']['T5_C_3'] = { subjectCode: 'BD_MT', teacherName: 'Thy' };

// 3A: T4_C_3 (AN), T4_C_1 (BD_AN)
// 3A: T2_C_3 (was Tâm:HDTN_CD) -> Thy:HDTN_CD
sched['3A']['T2_C_3'] = { subjectCode: 'HDTN_CD', teacherName: 'Thy' };
// 3A: T6_S_2 (was Tâm:MT) -> Thy:MT
sched['3A']['T6_S_2'] = { subjectCode: 'MT', teacherName: 'Thy' };

// 4A: T4_C_1 (was Quan:AN) -> Tâm:AN
sched['4A']['T4_C_1'] = { subjectCode: 'AN', teacherName: 'Tâm' };
// 4A: T5_C_3 (was Phước:TC) -> Tâm:BD_AN
sched['4A']['T5_C_3'] = { subjectCode: 'BD_AN', teacherName: 'Tâm' };

// 5A: T4_C_1 (AN), T5_C_3 (BD_AN)
// 5A: T5_C_2 (was Quan:DD) -> Thy:BD_MT
sched['5A']['T5_C_2'] = { subjectCode: 'BD_MT', teacherName: 'Thy' };
// 5A: T2_C_2 (was Quan:HDTN_CD) -> Thy:HDTN_CD
sched['5A']['T2_C_2'] = { subjectCode: 'HDTN_CD', teacherName: 'Thy' };

// In Campus 2 for Tâm:
// 1B: T4_S_3 (was Thy:AN) -> Tâm:AN
sched['1B']['T4_S_3'] = { subjectCode: 'AN', teacherName: 'Tâm' };
// 1B: T5_S_2 (was Nhàn:TV) -> Tâm:BD_AN
sched['1B']['T5_S_2'] = { subjectCode: 'BD_AN', teacherName: 'Tâm' };

// 2B: T2_S_3 (was Thy:AN) -> Tâm:AN
sched['2B']['T2_S_3'] = { subjectCode: 'AN', teacherName: 'Tâm' };
// 2B: T5_S_2 (was Thy:TV) -> Tâm:BD_AN
sched['2B']['T5_S_2'] = { subjectCode: 'BD_AN', teacherName: 'Tâm' };

// 3B: T3_S_3 (was Thy:AN) -> Tâm:AN
sched['3B']['T3_S_3'] = { subjectCode: 'AN', teacherName: 'Tâm' };
// 3B: T5_C_3 (was Nhàn:TC) -> Tâm:BD_AN
sched['3B']['T5_C_3'] = { subjectCode: 'BD_AN', teacherName: 'Tâm' };

// 4B: T5_S_3 (was Thy:AN) -> Tâm:AN
sched['4B']['T5_S_3'] = { subjectCode: 'AN', teacherName: 'Tâm' };
// 4B: T5_C_1 (was Nhàn:TC) -> Tâm:BD_AN
sched['4B']['T5_C_1'] = { subjectCode: 'BD_AN', teacherName: 'Tâm' };

// 5B: T5_S_3 (AN - assigned above), T5_C_2 (was Thy:TC) -> Tâm:BD_AN
sched['5B']['T5_C_2'] = { subjectCode: 'BD_AN', teacherName: 'Tâm' };
// 5B: T5_S_4 (was Thy:AN) -> Thy:BD_MT
sched['5B']['T5_S_4'] = { subjectCode: 'BD_MT', teacherName: 'Thy' };

// 5. Cô Thy: 10 MT + 10 BD_MT + 2 HDTN_CD = 22
// In Campus 1:
// 1A: T3_S_4 (MT), T2_C_2 (BD_MT)
// 2A: T2_C_3 (was Quan:TC_TOAN) -> Thy:MT
sched['2A']['T2_C_3'] = { subjectCode: 'MT', teacherName: 'Thy' };
// 2A: T5_C_3 (BD_MT - assigned above)
// 3A: T6_S_2 (MT), T2_C_2 (was Phước:TC) -> Thy:BD_MT
sched['3A']['T2_C_2'] = { subjectCode: 'BD_MT', teacherName: 'Thy' };
// 3A: T2_C_3 (HDTN_CD)
// 4A: T2_C_3 (was Phước:TC) -> Thy:MT
sched['4A']['T2_C_3'] = { subjectCode: 'MT', teacherName: 'Thy' };
// 4A: T4_C_2 (BD_MT - assigned above)
// 5A: T4_C_2 (MT), T5_C_2 (BD_MT), T2_C_2 (HDTN_CD)

// In Campus 2 for Thy:
// 1B: T2_S_2 (MT), T2_C_3 (was Thy:TC) -> Thy:BD_MT
sched['1B']['T2_C_3'] = { subjectCode: 'BD_MT', teacherName: 'Thy' };
// 2B: T4_S_4 (MT), T4_C_3 (was Thy:TC) -> Thy:BD_MT
sched['2B']['T4_C_3'] = { subjectCode: 'BD_MT', teacherName: 'Thy' };
// 2B: T3_S_2 (was Thy:TV) -> Nhàn:TC
sched['2B']['T3_S_2'] = { subjectCode: 'TC', teacherName: 'Nhàn' };
// 2B: T3_C_2 (was Thy:TC_TOAN) -> Nhàn:TC
sched['2B']['T3_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn' };
// 3B: T2_S_4 (MT), T4_C_1 (was Thy:TV) -> Thy:BD_MT
sched['3B']['T4_C_1'] = { subjectCode: 'BD_MT', teacherName: 'Thy' };
// 3B: T2_C_2 (was Thy:TV) -> Nhàn:TC
sched['3B']['T2_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn' };
// 4B: T3_S_4 (MT), T4_S_4 (BD_MT)
// 4B: T2_C_1 (was Thy:TV) -> Nhàn:TC
sched['4B']['T2_C_1'] = { subjectCode: 'TC', teacherName: 'Nhàn' };
// 4B: T4_C_2 (was Thy:LS_DL) -> Nhàn:TC
sched['4B']['T4_C_2'] = { subjectCode: 'TC', teacherName: 'Nhàn' };
// 5B: T3_S_4 (MT), T5_S_4 (BD_MT)
// 1B: T5_C_3 (was Thy:TC_TV) -> Nhàn:TC
sched['1B']['T5_C_3'] = { subjectCode: 'TC', teacherName: 'Nhàn' };
// 2B: T6_S_2 (was Thy:BD_NT) -> Nhàn:TC
sched['2B']['T6_S_2'] = { subjectCode: 'TC', teacherName: 'Nhàn' };

// 6. Phước: TNXH + TC to reach exactly 19
// Currently Phước has 14 + 2 (5A:T4_C_1 wait, 5A:T4_C_1 is Tâm:AN, 5A:T6_S_2 was Quan -> Phước:TC)
sched['5A']['T6_S_2'] = { subjectCode: 'TC', teacherName: 'Phước' };
// 1A: T3_C_3 (was Quan:HDTN_CD) -> Phước:TC
sched['1A']['T3_C_3'] = { subjectCode: 'TC', teacherName: 'Phước' };
// 2A: T3_C_3 (was Phước:HDTN_CD) -> Phước:TC
sched['2A']['T3_C_3'] = { subjectCode: 'TC', teacherName: 'Phước' };
// 4A: T2_C_1 (was Quan:HDTN_CD) -> Phước:TC
sched['4A']['T2_C_1'] = { subjectCode: 'TC', teacherName: 'Phước' };
// 4A: T4_C_3 (is Phước:TC)

// Let's audit and check teacher counts:
const counts: Record<string, number> = {};
const subjCounts: Record<string, Record<string, number>> = {};
for (const c of ALL_CLASSES) {
  for (const s of TIME_SLOTS) {
    const slot = sched[c.id]?.[s.id];
    if (slot) {
      const t = slot.teacherName;
      counts[t] = (counts[t] || 0) + 1;
      if (!subjCounts[t]) subjCounts[t] = {};
      subjCounts[t][slot.subjectCode] = (subjCounts[t][slot.subjectCode] || 0) + 1;
    }
  }
}

console.log('\n--- SPECIALIST TEACHER COUNTS ---');
for (const tname of SPECIALIST_TEACHERS) {
  const teacherObj = ALL_TEACHERS.find(t => t.name === tname);
  console.log(`${tname.padEnd(10)}: Target: ${teacherObj?.quota} | Current: ${counts[tname] || 0} ->`, subjCounts[tname]);
}

console.log('\n--- AUDIT RESULTS ---');
const viols = auditSchedule(sched);
console.log(`Total violations: ${viols.length}`);
for (const v of viols) {
  console.log(`- [${v.type}] ${v.title}: ${v.description}`);
}

fs.writeFileSync('scripts/evaluated_schedule.json', JSON.stringify(sched, null, 2), 'utf8');
