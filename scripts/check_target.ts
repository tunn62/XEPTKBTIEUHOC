import { solveOptimalSchedule, auditSchedule } from '../src/solver/cspSolver';
import { DEFAULT_GVCN_POLICIES } from '../src/data/initialData';

console.log('Testing policies:');
console.log('2A target:', DEFAULT_GVCN_POLICIES['2A'].targetPeriods);
console.log('1B target:', DEFAULT_GVCN_POLICIES['1B'].targetPeriods);
