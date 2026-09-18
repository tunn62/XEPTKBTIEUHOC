import { solveOptimalSchedule, auditSchedule } from '../src/solver/cspSolver';

const sched = solveOptimalSchedule();
const violations = auditSchedule(sched);

console.log(`Total violations: ${violations.length}`);
const byCode: Record<string, number> = {};
for (const v of violations) {
  byCode[v.code] = (byCode[v.code] || 0) + 1;
  console.log(`[${v.code}] ${v.title} :: ${v.description}`);
}
console.log('Summary by code:', byCode);
