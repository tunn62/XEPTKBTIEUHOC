import { ALL_CLASSES, GVCN_MAP, TIME_SLOTS, DEFAULT_GVCN_POLICIES } from '../src/data/initialData';
import { solveOptimalSchedule, auditSchedule } from '../src/solver/cspSolver';

const schedule = solveOptimalSchedule();
const violations = auditSchedule(schedule);

console.log('Current violations count:', violations.length);
violations.slice(0, 10).forEach((v) => {
  console.log(`[${v.code}] ${v.title}: ${v.description}`);
});
