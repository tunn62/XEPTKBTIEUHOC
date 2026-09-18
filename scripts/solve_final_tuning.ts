import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP, ALL_TEACHERS } from '../src/data/initialData';
import { auditSchedule } from '../src/solver/cspSolver';
import { generateExactSchedule } from './solve_exact_matrix';

const sched = generateExactSchedule();

// Count slots for each teacher
const teacherSlots: Record<string, string[]> = {};
for (const cId of Object.keys(sched)) {
  for (const sId of Object.keys(sched[cId])) {
    const t = sched[cId][sId].teacherName;
    if (!teacherSlots[t]) teacherSlots[t] = [];
    teacherSlots[t].push(`${cId}:${sId}`);
  }
}

console.log('--- TEACHER PERIOD COUNTS ---');
for (const [t, slots] of Object.entries(teacherSlots)) {
  console.log(`${t}: ${slots.length} periods`);
}

// Let's print Chi's slots
console.log('\nChi slots:', teacherSlots['Chi']);
console.log('\nTuấn slots:', teacherSlots['Tuấn']);
console.log('\nBé Năm slots:', teacherSlots['Bé Năm']);
console.log('\nChinh slots:', teacherSlots['Chinh']);
console.log('\nĐạt slots:', teacherSlots['Đạt']);
console.log('\nYến slots:', teacherSlots['Yến']);
console.log('\nHuế slots:', teacherSlots['Huế']);
