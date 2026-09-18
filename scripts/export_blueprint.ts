import * as fs from 'fs';
import { generateExactSchedule } from './solve_exact_matrix';
import { auditSchedule } from '../src/solver/cspSolver';

const sched = generateExactSchedule();
const violations = auditSchedule(sched);
console.log('Auditing generated schedule... Violations:', violations.length);

if (violations.length !== 0) {
  console.error('FAILED TO ATTAIN 0 VIOLATIONS! Violations:', violations);
  process.exit(1);
}

const fileContent = `/**
 * Schedule Blueprint for Trường Tiểu học Tân Thạnh (Phân hiệu Tân Bình)
 * Năm học 2026 - 2027
 *
 * Implements full pedagogical constraints with EXACT 0 VIOLATIONS:
 * 1. GVCN dạy ĐÚNG định mức:
 *    - Cô Năm (Tổ Phó 1B): 18 tiết
 *    - Cô Trang (Tổ Trưởng 2A): 17 tiết
 *    - Các GVCN khác (Chi 1A, Dương 3A, Hằng 4A, Tuấn 5A, Chinh 2B, Đạt 3B, Yến 4B, Huế 5B): 19 tiết
 * 2. GVCN ĐƯỢC NGHỈ 2 buổi chiều trong tuần (Thứ 2 - Thứ 5).
 * 3. HĐTN có 3 tiết:
 *    - Tiết 1 HĐTN (Đầu tuần T2_S_1): Sinh hoạt dưới cờ (GVCN phụ trách)
 *    - Tiết 3 HĐTN (Cuối tuần T6_S_4): Sinh hoạt lớp (GVCN phụ trách)
 *    - Tiết 2 HĐTN: Hoạt động trải nghiệm theo chủ đề (GV tăng cường / GV bộ môn dạy)
 * 4. GV bộ môn nào thì dạy bồi dưỡng môn đó, kiêm thêm dạy HĐTN.
 * 5. Môn chính: Toán 1 tiết/ngày (Thứ 2 - Thứ 6).
 * 6. Khối 3, 4, 5 Sáng Thứ 4: Tiết Tiếng Việt liền kề 2 tiết.
 * 7. Tiếng Anh (Nương): Tối đa 1 tiết/ngày, không 2 tiết liền nhau.
 * 8. GDTC (Thịnh): Tối đa 1 tiết/ngày.
 * 9. Tuyệt đối không trùng lịch giáo viên, không chuyển điểm trường trong cùng buổi.
 */

export interface BlueprintSlot {
  subjectCode: string;
  teacherName: string;
  notes?: string;
}

export const MASTER_BLUEPRINT: Record<string, Record<string, BlueprintSlot>> = ${JSON.stringify(sched, null, 2)};
`;

fs.writeFileSync('src/solver/scheduleBlueprint.ts', fileContent, 'utf-8');
console.log('Successfully written MASTER_BLUEPRINT to src/solver/scheduleBlueprint.ts with 0 violations!');
