import { MASTER_BLUEPRINT } from '../src/solver/scheduleBlueprint';

const findSlotAssignments = (slotId: string) => {
  const result: Array<{ classId: string; teacher: string; subject: string }> = [];
  for (const [classId, slots] of Object.entries(MASTER_BLUEPRINT)) {
    if (slots[slotId]) {
      result.push({ classId, teacher: slots[slotId].teacherName, subject: slots[slotId].subjectCode });
    }
  }
  return result;
};

console.log('T2_C_3 assignments:', findSlotAssignments('T2_C_3'));
console.log('T4_C_2 assignments:', findSlotAssignments('T4_C_2'));
console.log('T5_C_3 assignments:', findSlotAssignments('T5_C_3'));
