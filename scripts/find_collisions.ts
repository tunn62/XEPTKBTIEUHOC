import { MASTER_BLUEPRINT, BlueprintSlot } from '../src/solver/scheduleBlueprint';
import { ALL_CLASSES, TIME_SLOTS, SPECIALIST_TEACHERS, GVCN_MAP } from '../src/data/initialData';
import { auditSchedule } from '../src/solver/cspSolver';
import * as fs from 'fs';

// Clone existing blueprint
const blueprint: Record<string, Record<string, BlueprintSlot>> = JSON.parse(JSON.stringify(MASTER_BLUEPRINT));

// Let's inspect which slots have collisions right now
for (const slot of TIME_SLOTS) {
  const teacherClasses: Record<string, string[]> = {};
  for (const c of ALL_CLASSES) {
    const item = blueprint[c.id]?.[slot.id];
    if (item?.teacherName) {
      if (!teacherClasses[item.teacherName]) teacherClasses[item.teacherName] = [];
      teacherClasses[item.teacherName].push(c.id);
    }
  }
  for (const [t, classes] of Object.entries(teacherClasses)) {
    if (classes.length > 1) {
      console.log(`Slot ${slot.id}: Teacher ${t} in classes: ${classes.join(', ')}`);
    }
  }
}
