import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP, DEFAULT_GVCN_POLICIES, SPECIALIST_TEACHERS } from '../src/data/initialData';
import { auditSchedule, isDiem1 } from '../src/solver/cspSolver';
import { MASTER_BLUEPRINT, BlueprintSlot } from '../src/solver/scheduleBlueprint';
import * as fs from 'fs';

type ScheduleMap = Record<string, Record<string, BlueprintSlot>>;

// 1. Start from MASTER_BLUEPRINT with fixed GVCN quotas & GVCN afternoons off
const baseSched: ScheduleMap = JSON.parse(JSON.stringify(MASTER_BLUEPRINT));

// Fixed GVCN adjustments
baseSched['2A']['T2_C_3'] = { subjectCode: 'TC_TOAN', teacherName: '', notes: 'GV tăng cường' };
baseSched['2A']['T4_C_2'] = { subjectCode: 'TC_TV', teacherName: '', notes: 'GV tăng cường' };
baseSched['1B']['T5_C_3'] = { subjectCode: 'TC_TV', teacherName: '', notes: 'GV tăng cường' };
baseSched['2B']['T4_S_4'] = { subjectCode: 'TC', teacherName: '', notes: 'GV tăng cường' };
baseSched['2B']['T5_S_4'] = { subjectCode: 'TC', teacherName: '', notes: 'GV tăng cường' };
baseSched['3B']['T4_C_2'] = { subjectCode: 'TC', teacherName: '', notes: 'GV tăng cường' };
baseSched['4B']['T4_C_2'] = { subjectCode: 'TC', teacherName: '', notes: 'GV tăng cường' };
baseSched['5B']['T4_C_2'] = { subjectCode: 'TC', teacherName: '', notes: 'GV tăng cường' };

// Replace duplicate TA in grades 1 & 2
baseSched['1A']['T5_S_4'] = { subjectCode: 'TC', teacherName: '', notes: 'GV tăng cường' };
baseSched['1A']['T5_C_1'] = { subjectCode: 'TC', teacherName: '', notes: 'GV tăng cường' };
baseSched['1A']['T6_S_2'] = { subjectCode: 'TC', teacherName: '', notes: 'GV tăng cường' };

baseSched['2A']['T5_C_2'] = { subjectCode: 'TC', teacherName: '', notes: 'GV tăng cường' };
baseSched['2A']['T5_C_3'] = { subjectCode: 'TC', teacherName: '', notes: 'GV tăng cường' };
baseSched['2A']['T6_S_2'] = { subjectCode: 'TC', teacherName: '', notes: 'GV tăng cường' };

baseSched['1B']['T4_S_4'] = { subjectCode: 'TC', teacherName: '', notes: 'GV tăng cường' };
baseSched['1B']['T5_S_3'] = { subjectCode: 'TC', teacherName: '', notes: 'GV tăng cường' };
baseSched['1B']['T6_S_2'] = { subjectCode: 'TC', teacherName: '', notes: 'GV tăng cường' };

baseSched['2B']['T4_C_2'] = { subjectCode: 'TC', teacherName: '', notes: 'GV tăng cường' };
baseSched['2B']['T4_C_3'] = { subjectCode: 'TC', teacherName: '', notes: 'GV tăng cường' };
baseSched['2B']['T6_S_2'] = { subjectCode: 'TC', teacherName: '', notes: 'GV tăng cường' };

// Upper grades Friday duplicate TA
baseSched['3A']['T6_S_3'] = { subjectCode: 'TC', teacherName: '', notes: 'GV tăng cường' };
baseSched['4A']['T6_S_3'] = { subjectCode: 'TC', teacherName: '', notes: 'GV tăng cường' };
baseSched['4B']['T6_S_3'] = { subjectCode: 'TC', teacherName: '', notes: 'GV tăng cường' };
baseSched['5B']['T6_S_3'] = { subjectCode: 'TC', teacherName: '', notes: 'GV tăng cường' };

// Clear all non-GVCN slots to be assigned by CSP
interface VariableSlot {
  classId: string;
  slotId: string;
  day: number;
  session: 'S' | 'C';
  period: number;
  subjectCode: string;
  campus: 'diem1' | 'diem2';
}

const vars: VariableSlot[] = [];

for (const c of ALL_CLASSES) {
  const gvcn = GVCN_MAP[c.id];
  for (const s of TIME_SLOTS) {
    const l = baseSched[c.id]?.[s.id];
    if (l && l.teacherName !== gvcn) {
      // It's a specialist or reinforcement slot
      vars.push({
        classId: c.id,
        slotId: s.id,
        day: s.day,
        session: s.session,
        period: s.period,
        subjectCode: l.subjectCode,
        campus: isDiem1(c.id) ? 'diem1' : 'diem2',
      });
      // Clear teacher
      l.teacherName = '';
    }
  }
}

console.log(`Total variable slots to assign: ${vars.length}`);

// Valid candidate teachers per subject
function getCandidates(v: VariableSlot): string[] {
  const sub = v.subjectCode;
  if (sub === 'TA') return ['Nương'];
  if (sub === 'TH') return ['Phương'];
  if (sub === 'GDTC') return ['Thịnh'];
  if (sub === 'AN') return ['Tâm', 'Thy'];
  if (sub === 'MT') return ['Thy', 'Tâm'];
  if (sub === 'HDTN_CD') return ['Phước', 'Nhàn', 'Quan', 'Thy', 'Tâm'];
  if (sub === 'BD_TH') return ['Phương'];
  if (sub === 'BD_TD') return ['Thịnh', 'Phước', 'Nhàn'];
  if (sub === 'BD_TA') return ['Nương'];
  if (sub === 'BD_NT') return ['Tâm', 'Thy'];
  // TC, TC_TOAN, TC_TV
  return ['Phước', 'Nhàn', 'Quan', 'Thy', 'Tâm'];
}

// Global state trackers
const slotTeacher: Record<string, Record<string, string>> = {}; // slotId -> teacher -> classId
// Teacher session campus: sessionKey = `T${day}_${session}` -> teacher -> Set<campus>
const teacherSessionCampuses: Record<string, Record<string, Set<'diem1' | 'diem2'>>> = {};
// Teacher slot campus: teacher -> slotId -> campus
const teacherSlotCampus: Record<string, Record<string, 'diem1' | 'diem2'>> = {};

// Check if assigning teacher T to slot V is valid
function isValid(v: VariableSlot, teacher: string): boolean {
  // 1. Collision check: Is teacher already teaching in this slot?
  if (slotTeacher[v.slotId]?.[teacher]) return false;

  // 2. Campus Transit check:
  // In the same session (day + session), if teacher is in adjacent period (period - 1 or period + 1)
  // at a DIFFERENT campus, it's a transit violation!
  const prevSlotId = `T${v.day}_${v.session}_${v.period - 1}`;
  const nextSlotId = `T${v.day}_${v.session}_${v.period + 1}`;

  if (teacherSlotCampus[teacher]?.[prevSlotId] && teacherSlotCampus[teacher][prevSlotId] !== v.campus) {
    return false;
  }
  if (teacherSlotCampus[teacher]?.[nextSlotId] && teacherSlotCampus[teacher][nextSlotId] !== v.campus) {
    return false;
  }

  // 3. Subject-specific checks:
  // English (Nương): max 1 per day for this class
  if (teacher === 'Nương' && v.subjectCode === 'TA') {
    // Check if class already has TA on this day
    const daySlots = TIME_SLOTS.filter(s => s.day === v.day);
    for (const ds of daySlots) {
      if (ds.id !== v.slotId && baseSched[v.classId]?.[ds.id]?.teacherName === 'Nương' && baseSched[v.classId]?.[ds.id]?.subjectCode === 'TA') {
        return false;
      }
    }
  }

  // PE (Thịnh): max 1 per day for this class
  if (teacher === 'Thịnh' && v.subjectCode === 'GDTC') {
    const daySlots = TIME_SLOTS.filter(s => s.day === v.day);
    for (const ds of daySlots) {
      if (ds.id !== v.slotId && baseSched[v.classId]?.[ds.id]?.teacherName === 'Thịnh' && baseSched[v.classId]?.[ds.id]?.subjectCode === 'GDTC') {
        return false;
      }
    }
  }

  return true;
}

function assign(v: VariableSlot, teacher: string) {
  baseSched[v.classId][v.slotId].teacherName = teacher;
  if (!slotTeacher[v.slotId]) slotTeacher[v.slotId] = {};
  slotTeacher[v.slotId][teacher] = v.classId;

  if (!teacherSlotCampus[teacher]) teacherSlotCampus[teacher] = {};
  teacherSlotCampus[teacher][v.slotId] = v.campus;
}

function unassign(v: VariableSlot, teacher: string) {
  baseSched[v.classId][v.slotId].teacherName = '';
  delete slotTeacher[v.slotId][teacher];
  delete teacherSlotCampus[teacher][v.slotId];
}

// Sort variables: most constrained first (smallest candidates count first)
vars.sort((a, b) => getCandidates(a).length - getCandidates(b).length);

console.log('Starting CSP search...');
let found = false;
let iterations = 0;

function solve(idx: number): boolean {
  if (idx === vars.length) {
    found = true;
    return true;
  }

  iterations++;
  if (iterations % 50000 === 0) {
    console.log(`Iterations: ${iterations}, depth: ${idx}/${vars.length}`);
  }

  const v = vars[idx];
  const candidates = getCandidates(v);

  for (const t of candidates) {
    if (isValid(v, t)) {
      assign(v, t);
      if (solve(idx + 1)) return true;
      unassign(v, t);
    }
  }

  return false;
}

const success = solve(0);
console.log(`CSP Result: success=${success}, iterations=${iterations}`);

if (success) {
  const violations = auditSchedule(baseSched);
  console.log(`Violations after CSP: ${violations.length}`);
  for (const vi of violations) {
    console.log(`[${vi.code}] ${vi.title}: ${vi.description}`);
  }

  if (violations.length === 0) {
    console.log('SUCCESS! PERFECT ZERO VIOLATION BLUEPRINT ACHIEVED!');
    fs.writeFileSync('./scripts/solved_schedule.json', JSON.stringify(baseSched, null, 2));
  }
}
