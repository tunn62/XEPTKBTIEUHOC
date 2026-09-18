import sys
sys.path.append('scripts')
from validate_blueprint import sched, CLASSES, GVCN

header = """/**
 * Schedule Blueprint for Trường Tiểu học Tân Thạnh (Phân hiệu Tân Bình)
 * Năm học 2026 - 2027
 *
 * Đồng bộ chuẩn xác 100% theo Thời khóa biểu mẫu tuần 1 (07 - 11/9/2026):
 * - Bám sát chính xác từng tiết theo TKB chính thức của trường.
 * - Thầy Phan Ngọc Quan (Phó Hiệu trưởng): Đúng 2 tiết Đạo đức Khối 5:
 *     + Lớp 5A: Thứ 2 - Chiều Tiết 1 (T2_C_1)
 *     + Lớp 5B: Thứ 2 - Chiều Tiết 3 (T2_C_3)
 * - Không trùng lặp giáo viên (0 xung đột).
 * - Đảm bảo 10 lớp x 32 tiết = 320 tiết chuẩn quy chuẩn GDTH.
 */

export interface BlueprintSlot {
  subjectCode: string;
  teacherName: string;
  notes?: string;
}

export const MASTER_BLUEPRINT: Record<string, Record<string, BlueprintSlot>> = {
"""

footer = """};
"""

body_parts = []
# Sort slot keys chronologically
day_order = ['T2_S_1', 'T2_S_2', 'T2_S_3', 'T2_S_4', 'T2_C_1', 'T2_C_2', 'T2_C_3',
             'T3_S_1', 'T3_S_2', 'T3_S_3', 'T3_S_4', 'T3_C_1', 'T3_C_2', 'T3_C_3',
             'T4_S_1', 'T4_S_2', 'T4_S_3', 'T4_S_4', 'T4_C_1', 'T4_C_2', 'T4_C_3',
             'T5_S_1', 'T5_S_2', 'T5_S_3', 'T5_S_4', 'T5_C_1', 'T5_C_2', 'T5_C_3',
             'T6_S_1', 'T6_S_2', 'T6_S_3', 'T6_S_4']

for cid in CLASSES:
    class_lines = [f'  "{cid}": {{']
    for sid in day_order:
        sub, teacher = sched[cid][sid]
        note_line = ''
        if sid == 'T2_S_1':
            note_line = ',\n      "notes": "Chào cờ đầu tuần"'
        elif sid == 'T6_S_4':
            note_line = ',\n      "notes": "Sinh hoạt lớp cuối tuần"'
        elif teacher == 'Quan':
            note_line = ',\n      "notes": "PHT Quan phụ trách Đạo đức Khối 5"'
        
        slot_str = f"""    "{sid}": {{
      "subjectCode": "{sub}",
      "teacherName": "{teacher}"{note_line}
    }},"""
        class_lines.append(slot_str)
    class_lines.append('  },')
    body_parts.append('\n'.join(class_lines))

full_content = header + '\n'.join(body_parts) + '\n' + footer

with open('src/solver/scheduleBlueprint.ts', 'w', encoding='utf-8') as f:
    f.write(full_content)

print(f"Successfully generated src/solver/scheduleBlueprint.ts ({len(full_content)} bytes)")
