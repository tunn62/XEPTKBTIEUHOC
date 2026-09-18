import * as fs from 'fs';
import { auditSchedule } from '../src/solver/cspSolver';
import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP } from '../src/data/initialData';

interface FreeSlot {
  classId: string;
  slotId: string;
  day: number;
  session: 'S' | 'C';
  period: number;
  campus: 'diem1' | 'diem2';
}

const freeSlots: FreeSlot[] = JSON.parse(fs.readFileSync('scripts/free_slots.json', 'utf8'));
const gvcnSlots: Record<string, Record<string, any>> = JSON.parse(fs.readFileSync('scripts/gvcn_slots.json', 'utf8'));

// Teacher Quotas and Lesson counts:
// Thịnh: 20 GDTC (2 per class)
// Nương: 20 TA (4 in 3A, 4 in 4A, 3 in 5A, 3 in 3B, 3 in 4B, 3 in 5B)
// Phương: 10 TH (1 in each of 10 classes) -> NO TC_TOAN, NO OTHER SUBJECTS!
// Tâm: 20 (10 AN + 10 BD_AN) -> 1 AN and 1 BD_AN in each of 10 classes!
// Thy: 22 (10 MT + 10 BD_MT + 2 HDTN_CD) -> 1 MT and 1 BD_MT in each of 10 classes + 2 HDTN_CD!
// Phước: 19 (TNXH + TC + HDTN_CD)
// Nhàn: 16 (TC + HDTN_CD)
// Quan: 6 (TC + HDTN_CD)

const lessonsByClass: Record<string, [string, string][]> = {
  '1A': [
    ['GDTC', 'Thịnh'], ['GDTC', 'Thịnh'],
    ['TH', 'Phương'],
    ['AN', 'Tâm'], ['BD_AN', 'Tâm'],
    ['MT', 'Thy'], ['BD_MT', 'Thy'],
    ['HDTN_CD', 'Quan'],
    ['TC', 'Phước'], ['TC', 'Phước'], ['TC', 'Phước'], ['TC', 'Phước'], ['TC', 'Quan']
  ],
  '2A': [
    ['GDTC', 'Thịnh'], ['GDTC', 'Thịnh'],
    ['TH', 'Phương'],
    ['AN', 'Tâm'], ['BD_AN', 'Tâm'],
    ['MT', 'Thy'], ['BD_MT', 'Thy'],
    ['HDTN_CD', 'Quan'],
    ['TC', 'Phước'], ['TC', 'Phước'], ['TC', 'Phước'], ['TC', 'Phước'], ['TC', 'Phước'],
    ['TC', 'Quan'], ['TC', 'Quan']
  ],
  '3A': [
    ['GDTC', 'Thịnh'], ['GDTC', 'Thịnh'],
    ['TA', 'Nương'], ['TA', 'Nương'], ['TA', 'Nương'], ['TA', 'Nương'],
    ['TH', 'Phương'],
    ['AN', 'Tâm'], ['BD_AN', 'Tâm'],
    ['MT', 'Thy'], ['BD_MT', 'Thy'],
    ['HDTN_CD', 'Thy'],
    ['TC', 'Phước']
  ],
  '4A': [
    ['GDTC', 'Thịnh'], ['GDTC', 'Thịnh'],
    ['TA', 'Nương'], ['TA', 'Nương'], ['TA', 'Nương'], ['TA', 'Nương'],
    ['TH', 'Phương'],
    ['AN', 'Tâm'], ['BD_AN', 'Tâm'],
    ['MT', 'Thy'], ['BD_MT', 'Thy'],
    ['HDTN_CD', 'Phước'],
    ['TC', 'Phước']
  ],
  '5A': [
    ['GDTC', 'Thịnh'], ['GDTC', 'Thịnh'],
    ['TA', 'Nương'], ['TA', 'Nương'], ['TA', 'Nương'],
    ['TH', 'Phương'],
    ['AN', 'Tâm'], ['BD_AN', 'Tâm'],
    ['MT', 'Thy'], ['BD_MT', 'Thy'],
    ['HDTN_CD', 'Thy'],
    ['TC', 'Phước'], ['TC', 'Phước']
  ],
  '1B': [
    ['GDTC', 'Thịnh'], ['GDTC', 'Thịnh'],
    ['TH', 'Phương'],
    ['AN', 'Tâm'], ['BD_AN', 'Tâm'],
    ['MT', 'Thy'], ['BD_MT', 'Thy'],
    ['HDTN_CD', 'Nhàn'],
    ['TC', 'Phước'], ['TC', 'Phước'],
    ['TC', 'Nhàn'], ['TC', 'Nhàn'], ['TC', 'Nhàn'], ['TC', 'Nhàn']
  ],
  '2B': [
    ['GDTC', 'Thịnh'], ['GDTC', 'Thịnh'],
    ['TH', 'Phương'],
    ['AN', 'Tâm'], ['BD_AN', 'Tâm'],
    ['MT', 'Thy'], ['BD_MT', 'Thy'],
    ['HDTN_CD', 'Nhàn'],
    ['TC', 'Phước'], ['TC', 'Phước'],
    ['TC', 'Nhàn'], ['TC', 'Nhàn'], ['TC', 'Nhàn']
  ],
  '3B': [
    ['GDTC', 'Thịnh'], ['GDTC', 'Thịnh'],
    ['TA', 'Nương'], ['TA', 'Nương'], ['TA', 'Nương'],
    ['TH', 'Phương'],
    ['AN', 'Tâm'], ['BD_AN', 'Tâm'],
    ['MT', 'Thy'], ['BD_MT', 'Thy'],
    ['HDTN_CD', 'Nhàn'],
    ['TC', 'Phước'],
    ['TC', 'Nhàn']
  ],
  '4B': [
    ['GDTC', 'Thịnh'], ['GDTC', 'Thịnh'],
    ['TA', 'Nương'], ['TA', 'Nương'], ['TA', 'Nương'],
    ['TH', 'Phương'],
    ['AN', 'Tâm'], ['BD_AN', 'Tâm'],
    ['MT', 'Thy'], ['BD_MT', 'Thy'],
    ['HDTN_CD', 'Nhàn'],
    ['TC', 'Nhàn'], ['TC', 'Nhàn']
  ],
  '5B': [
    ['GDTC', 'Thịnh'], ['GDTC', 'Thịnh'],
    ['TA', 'Nương'], ['TA', 'Nương'], ['TA', 'Nương'],
    ['TH', 'Phương'],
    ['AN', 'Tâm'], ['BD_AN', 'Tâm'],
    ['MT', 'Thy'], ['BD_MT', 'Thy'],
    ['HDTN_CD', 'Nhàn'],
    ['TC', 'Nhàn'], ['TC', 'Nhàn']
  ]
};

const slotsByClass: Record<string, string[]> = {};
const slotInfo: Record<string, FreeSlot> = {};
for (const s of freeSlots) {
  if (!slotsByClass[s.classId]) slotsByClass[s.classId] = [];
  slotsByClass[s.classId].push(s.slotId);
  slotInfo[`${s.classId}:${s.slotId}`] = s;
}

// Session campus guidelines to completely prevent transit:
// Campus 1: Thịnh Sáng, Nương Sáng, Phương Chiều, Tâm T3+T4_C, Thy T5_C+T6_S+T2_C
// Campus 2: Thịnh Chiều, Nương Chiều, Phương Sáng, Tâm T2_C+T5, Thy T2_S+T3_C+T4_S

function evaluate(assignment: Record<string, [string, string]>): number {
  let score = 0;
  // 1. Collisions
  const stCount = new Map<string, number>();
  for (const [key, [, teacher]] of Object.entries(assignment)) {
    const [, sid] = key.split(':');
    const stKey = `${sid}:${teacher}`;
    stCount.set(stKey, (stCount.get(stKey) || 0) + 1);
  }
  for (const c of stCount.values()) {
    if (c > 1) score += 1000 * (c - 1);
  }

  // 2. Campus transit
  const sessCampuses = new Map<string, Set<string>>();
  for (const [key, [, teacher]] of Object.entries(assignment)) {
    const s = slotInfo[key];
    const sessKey = `${teacher}:${s.day}:${s.session}`;
    let set = sessCampuses.get(sessKey);
    if (!set) {
      set = new Set();
      sessCampuses.set(sessKey, set);
    }
    set.add(s.campus);
  }
  for (const set of sessCampuses.values()) {
    if (set.size > 1) score += 2000 * (set.size - 1);
  }

  // 3. GDTC max 1/day, TA max 1/day
  const cds = new Map<string, number>();
  for (const [key, [sub]] of Object.entries(assignment)) {
    if (sub === 'GDTC' || sub === 'TA') {
      const s = slotInfo[key];
      const cdKey = `${s.classId}:${s.day}:${sub}`;
      cds.set(cdKey, (cds.get(cdKey) || 0) + 1);
    }
  }
  for (const c of cds.values()) {
    if (c > 1) score += 500 * (c - 1);
  }

  return score;
}

console.log('Starting high-speed V8 solver...');
const startTime = Date.now();
let bestOverallScore = 999999;
let bestAssignment: Record<string, [string, string]> = {};

const classList = Object.keys(lessonsByClass);

for (let restart = 0; restart < 1000; restart++) {
  const assignment: Record<string, [string, string]> = {};
  for (const cid of classList) {
    const lessons = [...lessonsByClass[cid]];
    // Shuffle
    for (let i = lessons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lessons[i], lessons[j]] = [lessons[j], lessons[i]];
    }
    const slots = slotsByClass[cid];
    for (let i = 0; i < slots.length; i++) {
      assignment[`${cid}:${slots[i]}`] = lessons[i];
    }
  }

  let score = evaluate(assignment);
  let T = 60.0;
  const steps = 12000;

  for (let step = 0; step < steps; step++) {
    if (score === 0) break;

    const cid = classList[Math.floor(Math.random() * classList.length)];
    const slots = slotsByClass[cid];
    const idx1 = Math.floor(Math.random() * slots.length);
    let idx2 = Math.floor(Math.random() * slots.length);
    while (idx2 === idx1) idx2 = Math.floor(Math.random() * slots.length);

    const k1 = `${cid}:${slots[idx1]}`;
    const k2 = `${cid}:${slots[idx2]}`;

    if (assignment[k1][0] === assignment[k2][0] && assignment[k1][1] === assignment[k2][1]) {
      continue;
    }

    // Swap
    const tmp = assignment[k1];
    assignment[k1] = assignment[k2];
    assignment[k2] = tmp;

    const newScore = evaluate(assignment);
    const delta = newScore - score;

    if (delta <= 0 || Math.random() < Math.exp(-delta / Math.max(T, 0.05))) {
      score = newScore;
    } else {
      // Revert
      assignment[k2] = assignment[k1];
      assignment[k1] = tmp;
    }

    T *= 0.9996;
  }

  if (score < bestOverallScore) {
    bestOverallScore = score;
    bestAssignment = { ...assignment };
    console.log(`Restart ${restart}: new best score = ${score} (elapsed ${((Date.now() - startTime) / 1000).toFixed(1)}s)`);
  }

  if (bestOverallScore === 0) {
    console.log(`PERFECT SOLUTION FOUND in restart ${restart}!`);
    break;
  }
}

if (bestOverallScore === 0) {
  // Build complete schedule
  const fullSched: Record<string, Record<string, any>> = JSON.parse(JSON.stringify(gvcnSlots));
  for (const [key, [sub, teacher]] of Object.entries(bestAssignment)) {
    const [cid, sid] = key.split(':');
    if (!fullSched[cid]) fullSched[cid] = {};
    fullSched[cid][sid] = {
      subjectCode: sub,
      teacherName: teacher
    };
  }

  fs.writeFileSync('scripts/perfect_schedule.json', JSON.stringify(fullSched, null, 2), 'utf8');
  console.log('Saved to scripts/perfect_schedule.json');

  // Verify with auditSchedule
  const viols = auditSchedule(fullSched as any);
  console.log(`Audit violations count: ${viols.length}`);
  for (const v of viols) {
    console.log(`- [${v.type}] ${v.title}: ${v.description}`);
  }
} else {
  console.log(`Best score reached: ${bestOverallScore}`);
}
