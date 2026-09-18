import * as fs from 'fs';
import { auditSchedule } from '../src/solver/cspSolver';
import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP } from '../src/data/initialData';

const gvcnSlots: Record<string, Record<string, any>> = JSON.parse(fs.readFileSync('scripts/gvcn_slots.json', 'utf8'));
const sched: Record<string, Record<string, any>> = JSON.parse(JSON.stringify(gvcnSlots));

// ==========================================
// 1. FIXED 50 SPECIALIST SLOTS (0 CONFLICTS)
// ==========================================

// Thịnh GDTC (20 slots)
sched['1A']['T2_S_2'] = { subjectCode: 'GDTC', teacherName: 'Thịnh' };
sched['1A']['T4_S_2'] = { subjectCode: 'GDTC', teacherName: 'Thịnh' };
sched['2A']['T2_S_3'] = { subjectCode: 'GDTC', teacherName: 'Thịnh' };
sched['2A']['T4_S_3'] = { subjectCode: 'GDTC', teacherName: 'Thịnh' };
sched['3A']['T3_S_2'] = { subjectCode: 'GDTC', teacherName: 'Thịnh' };
sched['3A']['T5_S_3'] = { subjectCode: 'GDTC', teacherName: 'Thịnh' };
sched['4A']['T5_S_2'] = { subjectCode: 'GDTC', teacherName: 'Thịnh' };
sched['4A']['T6_S_2'] = { subjectCode: 'GDTC', teacherName: 'Thịnh' };
sched['5A']['T2_S_2'] = { subjectCode: 'GDTC', teacherName: 'Thịnh' };
sched['5A']['T3_S_3'] = { subjectCode: 'GDTC', teacherName: 'Thịnh' };

sched['1B']['T2_C_1'] = { subjectCode: 'GDTC', teacherName: 'Thịnh' };
sched['1B']['T4_C_1'] = { subjectCode: 'GDTC', teacherName: 'Thịnh' };
sched['2B']['T2_C_2'] = { subjectCode: 'GDTC', teacherName: 'Thịnh' };
sched['2B']['T4_C_2'] = { subjectCode: 'GDTC', teacherName: 'Thịnh' };
sched['3B']['T3_C_3'] = { subjectCode: 'GDTC', teacherName: 'Thịnh' };
sched['3B']['T5_C_2'] = { subjectCode: 'GDTC', teacherName: 'Thịnh' };
sched['4B']['T3_C_1'] = { subjectCode: 'GDTC', teacherName: 'Thịnh' };
sched['4B']['T5_C_3'] = { subjectCode: 'GDTC', teacherName: 'Thịnh' };
sched['5B']['T3_C_2'] = { subjectCode: 'GDTC', teacherName: 'Thịnh' };
sched['5B']['T5_C_1'] = { subjectCode: 'GDTC', teacherName: 'Thịnh' };

// Nương TA (20 slots)
sched['3A']['T2_S_3'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['3A']['T3_S_4'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['3A']['T4_S_4'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['3A']['T5_S_2'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['4A']['T2_S_4'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['4A']['T3_S_3'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['4A']['T4_S_3'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['4A']['T5_S_3'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['5A']['T3_S_2'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['5A']['T5_S_4'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['5A']['T4_C_1'] = { subjectCode: 'TA', teacherName: 'Nương' };

sched['3B']['T2_C_1'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['3B']['T3_C_1'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['3B']['T5_C_1'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['4B']['T2_C_2'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['4B']['T3_C_2'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['4B']['T5_C_2'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['5B']['T2_C_3'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['5B']['T3_C_3'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['5B']['T5_C_3'] = { subjectCode: 'TA', teacherName: 'Nương' };

// Phương TH (10 slots)
sched['3A']['T2_C_1'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['4A']['T2_C_2'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['5A']['T2_C_3'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['1A']['T5_C_1'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['2A']['T5_C_2'] = { subjectCode: 'TH', teacherName: 'Phương' };

sched['4B']['T3_S_2'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['5B']['T3_S_3'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['1B']['T3_S_4'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['3B']['T5_S_2'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['2B']['T4_S_2'] = { subjectCode: 'TH', teacherName: 'Phương' };

// ==========================================
// 2. SOLVE CAMPUS 1 REMAINING 41 SLOTS
// Teachers: Tâm (10), Thy (11), Phước (14), Quan (6)
// ==========================================

const c1Classes = ['1A', '2A', '3A', '4A', '5A'];
const c1Unfilled: { classId: string; slotId: string }[] = [];
for (const cid of c1Classes) {
  for (const s of TIME_SLOTS) {
    if (!sched[cid]?.[s.id]) {
      c1Unfilled.push({ classId: cid, slotId: s.id });
    }
  }
}
c1Unfilled.sort((a, b) => a.slotId.localeCompare(b.slotId));
console.log('C1 unfilled count:', c1Unfilled.length); // 41

// Requirements per class in C1:
const c1Reqs: Record<string, [string, string][]> = {
  '1A': [
    ['AN', 'Tâm'], ['BD_AN', 'Tâm'],
    ['MT', 'Thy'], ['BD_MT', 'Thy'],
    ['HDTN_CD', 'Quan'],
    ['TC', 'Phước'], ['TC', 'Phước'], ['TC', 'Phước'], ['TC', 'Phước'], ['TC', 'Quan']
  ],
  '2A': [
    ['AN', 'Tâm'], ['BD_AN', 'Tâm'],
    ['MT', 'Thy'], ['BD_MT', 'Thy'],
    ['HDTN_CD', 'Quan'],
    ['TC', 'Phước'], ['TC', 'Phước'], ['TC', 'Phước'], ['TC', 'Phước'], ['TC', 'Phước'],
    ['TC', 'Quan'], ['TC', 'Quan']
  ],
  '3A': [
    ['AN', 'Tâm'], ['BD_AN', 'Tâm'],
    ['MT', 'Thy'], ['BD_MT', 'Thy'],
    ['HDTN_CD', 'Thy'],
    ['TC', 'Phước']
  ],
  '4A': [
    ['AN', 'Tâm'], ['BD_AN', 'Tâm'],
    ['MT', 'Thy'], ['BD_MT', 'Thy'],
    ['HDTN_CD', 'Phước'],
    ['TC', 'Phước']
  ],
  '5A': [
    ['AN', 'Tâm'], ['BD_AN', 'Tâm'],
    ['MT', 'Thy'], ['BD_MT', 'Thy'],
    ['HDTN_CD', 'Thy'],
    ['TC', 'Phước'], ['TC', 'Phước']
  ]
};

// Backtracking solver for C1
function solveC1(slotIdx: number, usedSlotTeacher: Set<string>): boolean {
  if (slotIdx === c1Unfilled.length) {
    return true;
  }

  const { classId, slotId } = c1Unfilled[slotIdx];
  const reqs = c1Reqs[classId];
  const day = parseInt(slotId.split('_')[0].replace('T', ''), 10);

  // Try unique [sub, teacher] options
  const tried = new Set<string>();

  for (let i = 0; i < reqs.length; i++) {
    const [sub, teacher] = reqs[i];
    const pairKey = `${sub}:${teacher}`;
    if (tried.has(pairKey)) continue;
    tried.add(pairKey);

    // Day filter for Campus 1: Tâm is on T3 and T4; Thy is on T2, T5, T6
    if (teacher === 'Tâm' && day !== 3 && day !== 4) continue;
    if (teacher === 'Thy' && day !== 2 && day !== 5 && day !== 6) continue;

    const stKey = `${slotId}:${teacher}`;
    if (!usedSlotTeacher.has(stKey)) {
      sched[classId][slotId] = { subjectCode: sub, teacherName: teacher };
      usedSlotTeacher.add(stKey);
      reqs.splice(i, 1);

      if (solveC1(slotIdx + 1, usedSlotTeacher)) {
        return true;
      }

      delete sched[classId][slotId];
      usedSlotTeacher.delete(stKey);
      reqs.splice(i, 0, [sub, teacher]);
    }
  }

  return false;
}

const c1Used = new Set<string>();
// Pre-populate used slot-teachers from existing assignments
for (const cid of ALL_CLASSES) {
  for (const s of TIME_SLOTS) {
    if (sched[cid]?.[s.id]) {
      c1Used.add(`${s.id}:${sched[cid][s.id].teacherName}`);
    }
  }
}

console.log('Solving Campus 1...');
const c1Success = solveC1(0, c1Used);
console.log('Campus 1 solve result:', c1Success);

// ==========================================
// 3. SOLVE CAMPUS 2 REMAINING 42 SLOTS
// Teachers: Tâm (10), Thy (11), Phước (5), Nhàn (16)
// ==========================================

const c2Classes = ['1B', '2B', '3B', '4B', '5B'];
const c2Unfilled: { classId: string; slotId: string }[] = [];
for (const cid of c2Classes) {
  for (const s of TIME_SLOTS) {
    if (!sched[cid]?.[s.id]) {
      c2Unfilled.push({ classId: cid, slotId: s.id });
    }
  }
}
c2Unfilled.sort((a, b) => a.slotId.localeCompare(b.slotId));
console.log('C2 unfilled count:', c2Unfilled.length); // 42

const c2Reqs: Record<string, [string, string][]> = {
  '1B': [
    ['AN', 'Tâm'], ['BD_AN', 'Tâm'],
    ['MT', 'Thy'], ['BD_MT', 'Thy'],
    ['HDTN_CD', 'Nhàn'],
    ['TC', 'Phước'], ['TC', 'Phước'],
    ['TC', 'Nhàn'], ['TC', 'Nhàn'], ['TC', 'Nhàn'], ['TC', 'Nhàn']
  ],
  '2B': [
    ['AN', 'Tâm'], ['BD_AN', 'Tâm'],
    ['MT', 'Thy'], ['BD_MT', 'Thy'],
    ['HDTN_CD', 'Nhàn'],
    ['TC', 'Phước'], ['TC', 'Phước'],
    ['TC', 'Nhàn'], ['TC', 'Nhàn'], ['TC', 'Nhàn']
  ],
  '3B': [
    ['AN', 'Tâm'], ['BD_AN', 'Tâm'],
    ['MT', 'Thy'], ['BD_MT', 'Thy'],
    ['HDTN_CD', 'Nhàn'],
    ['TC', 'Phước'],
    ['TC', 'Nhàn']
  ],
  '4B': [
    ['AN', 'Tâm'], ['BD_AN', 'Tâm'],
    ['MT', 'Thy'], ['BD_MT', 'Thy'],
    ['HDTN_CD', 'Nhàn'],
    ['TC', 'Nhàn'], ['TC', 'Nhàn']
  ],
  '5B': [
    ['AN', 'Tâm'], ['BD_AN', 'Tâm'],
    ['MT', 'Thy'], ['BD_MT', 'Thy'],
    ['HDTN_CD', 'Nhàn'],
    ['TC', 'Nhàn'], ['TC', 'Nhàn']
  ]
};

function solveC2(slotIdx: number, usedSlotTeacher: Set<string>): boolean {
  if (slotIdx === c2Unfilled.length) {
    return true;
  }

  const { classId, slotId } = c2Unfilled[slotIdx];
  const reqs = c2Reqs[classId];
  const day = parseInt(slotId.split('_')[0].replace('T', ''), 10);

  const tried = new Set<string>();

  for (let i = 0; i < reqs.length; i++) {
    const [sub, teacher] = reqs[i];
    const pairKey = `${sub}:${teacher}`;
    if (tried.has(pairKey)) continue;
    tried.add(pairKey);

    // Day filter for Campus 2: Tâm is on T2 and T5; Thy is on T3 and T4
    if (teacher === 'Tâm' && day !== 2 && day !== 5) continue;
    if (teacher === 'Thy' && day !== 3 && day !== 4) continue;

    const stKey = `${slotId}:${teacher}`;

    if (!usedSlotTeacher.has(stKey)) {
      sched[classId][slotId] = { subjectCode: sub, teacherName: teacher };
      usedSlotTeacher.add(stKey);
      reqs.splice(i, 1);

      if (solveC2(slotIdx + 1, usedSlotTeacher)) {
        return true;
      }

      delete sched[classId][slotId];
      usedSlotTeacher.delete(stKey);
      reqs.splice(i, 0, [sub, teacher]);
    }
  }

  return false;
}

const c2Used = new Set<string>();
for (const cid of ALL_CLASSES) {
  for (const s of TIME_SLOTS) {
    if (sched[cid]?.[s.id]) {
      c2Used.add(`${s.id}:${sched[cid][s.id].teacherName}`);
    }
  }
}

console.log('Solving Campus 2...');
const c2Success = solveC2(0, c2Used);
console.log('Campus 2 solve result:', c2Success);

if (c1Success && c2Success) {
  // Check total filled slots
  let totalFilled = 0;
  for (const cid of ALL_CLASSES) {
    totalFilled += Object.keys(sched[cid]).length;
  }
  console.log(`Total filled slots: ${totalFilled} / 320`);

  fs.writeFileSync('scripts/perfect_schedule.json', JSON.stringify(sched, null, 2), 'utf8');
  console.log('Saved to scripts/perfect_schedule.json');

  const viols = auditSchedule(sched as any);
  console.log(`\nAudit violations count: ${viols.length}`);
  for (const v of viols) {
    console.log(`- [${v.type}] ${v.title}: ${v.description}`);
  }
}
