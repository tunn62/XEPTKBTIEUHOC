import { MASTER_BLUEPRINT } from '../src/solver/scheduleBlueprint';

const countTeacher = (classId: string, teacher: string) => {
  let count = 0;
  for (const [slot, data] of Object.entries(MASTER_BLUEPRINT[classId] || {})) {
    if (data.teacherName === teacher) count++;
  }
  return count;
};

console.log('Trang in 2A:', countTeacher('2A', 'Trang'));
console.log('Bé Năm in 1B:', countTeacher('1B', 'Bé Năm'));
