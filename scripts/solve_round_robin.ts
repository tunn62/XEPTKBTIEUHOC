import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP, DEFAULT_GVCN_POLICIES } from '../src/data/initialData';
import { MASTER_BLUEPRINT, BlueprintSlot } from '../src/solver/scheduleBlueprint';
import { auditSchedule } from '../src/solver/cspSolver';
import * as fs from 'fs';

// Let's create the schedule with pure Latin-square round robin for non-GVCN slots.
console.log('Round-robin solver template');
