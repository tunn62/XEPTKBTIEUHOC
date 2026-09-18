import * as fs from 'fs';
import { auditSchedule } from '../src/solver/cspSolver';
import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP } from '../src/data/initialData';

const gvcnSlots: Record<string, Record<string, any>> = JSON.parse(fs.readFileSync('scripts/gvcn_slots.json', 'utf8'));

// Initialize full schedule with GVCN slots
const sched: Record<string, Record<string, any>> = JSON.parse(JSON.stringify(gvcnSlots));

// 1. Fix Thịnh (20 GDTC)
// Campus 1 (10 slots):
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

// Campus 2 (10 slots):
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

// 2. Fix Nương (20 TA)
// Campus 1 (11 slots):
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

// Campus 2 (9 slots):
sched['3B']['T2_C_1'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['3B']['T3_C_1'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['3B']['T5_C_1'] = { subjectCode: 'TA', teacherName: 'Nương' };

sched['4B']['T2_C_2'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['4B']['T3_C_2'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['4B']['T5_C_2'] = { subjectCode: 'TA', teacherName: 'Nương' };

sched['5B']['T2_C_3'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['5B']['T3_C_3'] = { subjectCode: 'TA', teacherName: 'Nương' };
sched['5B']['T5_C_3'] = { subjectCode: 'TA', teacherName: 'Nương' };

// 3. Fix Phương (10 TH) -> ONLY TH, 1 in each class!
// Campus 1 (5 slots):
sched['3A']['T2_C_1'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['4A']['T2_C_2'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['5A']['T2_C_3'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['1A']['T5_C_1'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['2A']['T5_C_2'] = { subjectCode: 'TH', teacherName: 'Phương' };

// Campus 2 (5 slots):
sched['4B']['T3_S_2'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['5B']['T3_S_3'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['1B']['T3_S_4'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['3B']['T5_S_2'] = { subjectCode: 'TH', teacherName: 'Phương' };
sched['2B']['T4_S_2'] = { subjectCode: 'TH', teacherName: 'Phương' };

console.log('Fixed 50 specialist slots.');
