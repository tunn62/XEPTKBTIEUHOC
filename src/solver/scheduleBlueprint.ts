/**
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
  "1A": {
    "T2_S_1": {
      "subjectCode": "SHDC",
      "teacherName": "Chi",
      "notes": "Chào cờ đầu tuần"
    },
    "T2_S_2": {
      "subjectCode": "TV",
      "teacherName": "Chi"
    },
    "T2_S_3": {
      "subjectCode": "TV",
      "teacherName": "Chi"
    },
    "T2_S_4": {
      "subjectCode": "TOAN",
      "teacherName": "Chi"
    },
    "T2_C_1": {
      "subjectCode": "MT",
      "teacherName": "Thy"
    },
    "T2_C_2": {
      "subjectCode": "TV",
      "teacherName": "Chi"
    },
    "T2_C_3": {
      "subjectCode": "TC_TV",
      "teacherName": "Chi"
    },
    "T3_S_1": {
      "subjectCode": "TV",
      "teacherName": "Chi"
    },
    "T3_S_2": {
      "subjectCode": "TV",
      "teacherName": "Chi"
    },
    "T3_S_3": {
      "subjectCode": "GDTC",
      "teacherName": "Thịnh"
    },
    "T3_S_4": {
      "subjectCode": "TH",
      "teacherName": "Phương"
    },
    "T3_C_1": {
      "subjectCode": "TNXH",
      "teacherName": "Phước"
    },
    "T3_C_2": {
      "subjectCode": "TC_TV",
      "teacherName": "Chi"
    },
    "T3_C_3": {
      "subjectCode": "AN",
      "teacherName": "Tâm"
    },
    "T4_S_1": {
      "subjectCode": "TV",
      "teacherName": "Chi"
    },
    "T4_S_2": {
      "subjectCode": "TV",
      "teacherName": "Chi"
    },
    "T4_S_3": {
      "subjectCode": "TOAN",
      "teacherName": "Chi"
    },
    "T4_S_4": {
      "subjectCode": "TNXH",
      "teacherName": "Phước"
    },
    "T4_C_1": {
      "subjectCode": "TV",
      "teacherName": "Chi"
    },
    "T4_C_2": {
      "subjectCode": "TC_TOAN",
      "teacherName": "Phước"
    },
    "T4_C_3": {
      "subjectCode": "DD",
      "teacherName": "Nhàn"
    },
    "T5_S_1": {
      "subjectCode": "GDTC",
      "teacherName": "Thịnh"
    },
    "T5_S_2": {
      "subjectCode": "HDTN_CD",
      "teacherName": "Thy"
    },
    "T5_S_3": {
      "subjectCode": "TV",
      "teacherName": "Chi"
    },
    "T5_S_4": {
      "subjectCode": "TV",
      "teacherName": "Chi"
    },
    "T5_C_1": {
      "subjectCode": "BD_AN",
      "teacherName": "Tâm"
    },
    "T5_C_2": {
      "subjectCode": "TC_TOAN",
      "teacherName": "Chi"
    },
    "T5_C_3": {
      "subjectCode": "TC_TOAN",
      "teacherName": "Phước"
    },
    "T6_S_1": {
      "subjectCode": "TV",
      "teacherName": "Chi"
    },
    "T6_S_2": {
      "subjectCode": "TV",
      "teacherName": "Chi"
    },
    "T6_S_3": {
      "subjectCode": "TOAN",
      "teacherName": "Chi"
    },
    "T6_S_4": {
      "subjectCode": "SHL",
      "teacherName": "Chi",
      "notes": "Sinh hoạt lớp cuối tuần"
    },
  },
  "2A": {
    "T2_S_1": {
      "subjectCode": "HDTN_CD",
      "teacherName": "Nhàn",
      "notes": "Chào cờ đầu tuần"
    },
    "T2_S_2": {
      "subjectCode": "TV",
      "teacherName": "Trang"
    },
    "T2_S_3": {
      "subjectCode": "TV",
      "teacherName": "Trang"
    },
    "T2_S_4": {
      "subjectCode": "TOAN",
      "teacherName": "Trang"
    },
    "T2_C_1": {
      "subjectCode": "DD",
      "teacherName": "Nhàn"
    },
    "T2_C_2": {
      "subjectCode": "MT",
      "teacherName": "Thy"
    },
    "T2_C_3": {
      "subjectCode": "AN",
      "teacherName": "Tâm"
    },
    "T3_S_1": {
      "subjectCode": "GDTC",
      "teacherName": "Thịnh"
    },
    "T3_S_2": {
      "subjectCode": "TV",
      "teacherName": "Trang"
    },
    "T3_S_3": {
      "subjectCode": "TV",
      "teacherName": "Trang"
    },
    "T3_S_4": {
      "subjectCode": "TOAN",
      "teacherName": "Trang"
    },
    "T3_C_1": {
      "subjectCode": "BD_AN",
      "teacherName": "Tâm"
    },
    "T3_C_2": {
      "subjectCode": "TNXH",
      "teacherName": "Phước"
    },
    "T3_C_3": {
      "subjectCode": "TH",
      "teacherName": "Phương"
    },
    "T4_S_1": {
      "subjectCode": "TV",
      "teacherName": "Trang"
    },
    "T4_S_2": {
      "subjectCode": "TV",
      "teacherName": "Trang"
    },
    "T4_S_3": {
      "subjectCode": "TNXH",
      "teacherName": "Phước"
    },
    "T4_S_4": {
      "subjectCode": "TC_TOAN",
      "teacherName": "Nhàn"
    },
    "T4_C_1": {
      "subjectCode": "TOAN",
      "teacherName": "Trang"
    },
    "T4_C_2": {
      "subjectCode": "TC_TV",
      "teacherName": "Nhàn"
    },
    "T4_C_3": {
      "subjectCode": "HDTN_CD",
      "teacherName": "Thy"
    },
    "T5_S_1": {
      "subjectCode": "TC_TV",
      "teacherName": "Nhàn"
    },
    "T5_S_2": {
      "subjectCode": "GDTC",
      "teacherName": "Thịnh"
    },
    "T5_S_3": {
      "subjectCode": "TV",
      "teacherName": "Trang"
    },
    "T5_S_4": {
      "subjectCode": "TV",
      "teacherName": "Trang"
    },
    "T5_C_1": {
      "subjectCode": "TC_TOAN",
      "teacherName": "Trang"
    },
    "T5_C_2": {
      "subjectCode": "TOAN",
      "teacherName": "Trang"
    },
    "T5_C_3": {
      "subjectCode": "TC_TV",
      "teacherName": "Nhàn"
    },
    "T6_S_1": {
      "subjectCode": "TV",
      "teacherName": "Trang"
    },
    "T6_S_2": {
      "subjectCode": "TV",
      "teacherName": "Trang"
    },
    "T6_S_3": {
      "subjectCode": "TOAN",
      "teacherName": "Trang"
    },
    "T6_S_4": {
      "subjectCode": "SHL",
      "teacherName": "Trang",
      "notes": "Sinh hoạt lớp cuối tuần"
    },
  },
  "3A": {
    "T2_S_1": {
      "subjectCode": "SHDC",
      "teacherName": "Dương",
      "notes": "Chào cờ đầu tuần"
    },
    "T2_S_2": {
      "subjectCode": "TV",
      "teacherName": "Dương"
    },
    "T2_S_3": {
      "subjectCode": "TV",
      "teacherName": "Dương"
    },
    "T2_S_4": {
      "subjectCode": "TOAN",
      "teacherName": "Dương"
    },
    "T2_C_1": {
      "subjectCode": "TA",
      "teacherName": "Nương"
    },
    "T2_C_2": {
      "subjectCode": "AN",
      "teacherName": "Tâm"
    },
    "T2_C_3": {
      "subjectCode": "MT",
      "teacherName": "Thy"
    },
    "T3_S_1": {
      "subjectCode": "TV",
      "teacherName": "Dương"
    },
    "T3_S_2": {
      "subjectCode": "GDTC",
      "teacherName": "Thịnh"
    },
    "T3_S_3": {
      "subjectCode": "TOAN",
      "teacherName": "Dương"
    },
    "T3_S_4": {
      "subjectCode": "DD",
      "teacherName": "Dương"
    },
    "T3_C_1": {
      "subjectCode": "TA",
      "teacherName": "Nương"
    },
    "T3_C_2": {
      "subjectCode": "BD_AN",
      "teacherName": "Tâm"
    },
    "T3_C_3": {
      "subjectCode": "TNXH",
      "teacherName": "Phước"
    },
    "T4_S_1": {
      "subjectCode": "TA",
      "teacherName": "Nương"
    },
    "T4_S_2": {
      "subjectCode": "HDTN_CD",
      "teacherName": "Thy"
    },
    "T4_S_3": {
      "subjectCode": "TV",
      "teacherName": "Dương"
    },
    "T4_S_4": {
      "subjectCode": "TOAN",
      "teacherName": "Dương"
    },
    "T4_C_1": {
      "subjectCode": "TNXH",
      "teacherName": "Phước"
    },
    "T4_C_2": {
      "subjectCode": "TH",
      "teacherName": "Dương"
    },
    "T4_C_3": {
      "subjectCode": "TH",
      "teacherName": "Phương"
    },
    "T5_S_1": {
      "subjectCode": "TV",
      "teacherName": "Dương"
    },
    "T5_S_2": {
      "subjectCode": "TV",
      "teacherName": "Dương"
    },
    "T5_S_3": {
      "subjectCode": "GDTC",
      "teacherName": "Thịnh"
    },
    "T5_S_4": {
      "subjectCode": "TOAN",
      "teacherName": "Dương"
    },
    "T5_C_1": {
      "subjectCode": "TC_TOAN",
      "teacherName": "Dương"
    },
    "T5_C_2": {
      "subjectCode": "TC_TV",
      "teacherName": "Dương"
    },
    "T5_C_3": {
      "subjectCode": "GDTC",
      "teacherName": "Thịnh"
    },
    "T6_S_1": {
      "subjectCode": "TV",
      "teacherName": "Dương"
    },
    "T6_S_2": {
      "subjectCode": "TOAN",
      "teacherName": "Dương"
    },
    "T6_S_3": {
      "subjectCode": "TC_TV",
      "teacherName": "Dương"
    },
    "T6_S_4": {
      "subjectCode": "SHL",
      "teacherName": "Dương",
      "notes": "Sinh hoạt lớp cuối tuần"
    },
  },
  "4A": {
    "T2_S_1": {
      "subjectCode": "SHDC",
      "teacherName": "Hằng",
      "notes": "Chào cờ đầu tuần"
    },
    "T2_S_2": {
      "subjectCode": "TV",
      "teacherName": "Hằng"
    },
    "T2_S_3": {
      "subjectCode": "TV",
      "teacherName": "Hằng"
    },
    "T2_S_4": {
      "subjectCode": "TOAN",
      "teacherName": "Hằng"
    },
    "T2_C_1": {
      "subjectCode": "AN",
      "teacherName": "Tâm"
    },
    "T2_C_2": {
      "subjectCode": "GDTC",
      "teacherName": "Thịnh"
    },
    "T2_C_3": {
      "subjectCode": "TA",
      "teacherName": "Nương"
    },
    "T3_S_1": {
      "subjectCode": "TV",
      "teacherName": "Hằng"
    },
    "T3_S_2": {
      "subjectCode": "TOAN",
      "teacherName": "Hằng"
    },
    "T3_S_3": {
      "subjectCode": "LS_DL",
      "teacherName": "Hằng"
    },
    "T3_S_4": {
      "subjectCode": "KH",
      "teacherName": "Hằng"
    },
    "T3_C_1": {
      "subjectCode": "TH",
      "teacherName": "Phương"
    },
    "T3_C_2": {
      "subjectCode": "TA",
      "teacherName": "Nương"
    },
    "T3_C_3": {
      "subjectCode": "DD",
      "teacherName": "Hằng"
    },
    "T4_S_1": {
      "subjectCode": "MT",
      "teacherName": "Thy"
    },
    "T4_S_2": {
      "subjectCode": "TA",
      "teacherName": "Nương"
    },
    "T4_S_3": {
      "subjectCode": "TV",
      "teacherName": "Hằng"
    },
    "T4_S_4": {
      "subjectCode": "TOAN",
      "teacherName": "Hằng"
    },
    "T4_C_1": {
      "subjectCode": "TH",
      "teacherName": "Nhàn"
    },
    "T4_C_2": {
      "subjectCode": "LS_DL",
      "teacherName": "Hằng"
    },
    "T4_C_3": {
      "subjectCode": "KH",
      "teacherName": "Hằng"
    },
    "T5_S_1": {
      "subjectCode": "TV",
      "teacherName": "Hằng"
    },
    "T5_S_2": {
      "subjectCode": "TV",
      "teacherName": "Hằng"
    },
    "T5_S_3": {
      "subjectCode": "TOAN",
      "teacherName": "Hằng"
    },
    "T5_S_4": {
      "subjectCode": "TA",
      "teacherName": "Nương"
    },
    "T5_C_1": {
      "subjectCode": "TA",
      "teacherName": "Nương"
    },
    "T5_C_2": {
      "subjectCode": "BD_AN",
      "teacherName": "Tâm"
    },
    "T5_C_3": {
      "subjectCode": "HDTN_CD",
      "teacherName": "Thy"
    },
    "T6_S_1": {
      "subjectCode": "TV",
      "teacherName": "Hằng"
    },
    "T6_S_2": {
      "subjectCode": "TOAN",
      "teacherName": "Hằng"
    },
    "T6_S_3": {
      "subjectCode": "TC_TV",
      "teacherName": "Hằng"
    },
    "T6_S_4": {
      "subjectCode": "SHL",
      "teacherName": "Hằng",
      "notes": "Sinh hoạt lớp cuối tuần"
    },
  },
  "5A": {
    "T2_S_1": {
      "subjectCode": "SHDC",
      "teacherName": "Tuấn",
      "notes": "Chào cờ đầu tuần"
    },
    "T2_S_2": {
      "subjectCode": "TV",
      "teacherName": "Tuấn"
    },
    "T2_S_3": {
      "subjectCode": "TV",
      "teacherName": "Tuấn"
    },
    "T2_S_4": {
      "subjectCode": "TOAN",
      "teacherName": "Tuấn"
    },
    "T2_C_1": {
      "subjectCode": "DD",
      "teacherName": "Quan",
      "notes": "PHT Quan phụ trách Đạo đức Khối 5"
    },
    "T2_C_2": {
      "subjectCode": "TA",
      "teacherName": "Nương"
    },
    "T2_C_3": {
      "subjectCode": "GDTC",
      "teacherName": "Thịnh"
    },
    "T3_S_1": {
      "subjectCode": "TV",
      "teacherName": "Tuấn"
    },
    "T3_S_2": {
      "subjectCode": "TOAN",
      "teacherName": "Tuấn"
    },
    "T3_S_3": {
      "subjectCode": "LS_DL",
      "teacherName": "Tuấn"
    },
    "T3_S_4": {
      "subjectCode": "KH",
      "teacherName": "Tuấn"
    },
    "T3_C_1": {
      "subjectCode": "TC_TV",
      "teacherName": "Tuấn"
    },
    "T3_C_2": {
      "subjectCode": "TH",
      "teacherName": "Phương"
    },
    "T3_C_3": {
      "subjectCode": "TA",
      "teacherName": "Nương"
    },
    "T4_S_1": {
      "subjectCode": "TV",
      "teacherName": "Tuấn"
    },
    "T4_S_2": {
      "subjectCode": "TOAN",
      "teacherName": "Tuấn"
    },
    "T4_S_3": {
      "subjectCode": "TH",
      "teacherName": "Nhàn"
    },
    "T4_S_4": {
      "subjectCode": "TA",
      "teacherName": "Nương"
    },
    "T4_C_1": {
      "subjectCode": "LS_DL",
      "teacherName": "Tuấn"
    },
    "T4_C_2": {
      "subjectCode": "KH",
      "teacherName": "Tuấn"
    },
    "T4_C_3": {
      "subjectCode": "AN",
      "teacherName": "Tâm"
    },
    "T5_S_1": {
      "subjectCode": "TV",
      "teacherName": "Tuấn"
    },
    "T5_S_2": {
      "subjectCode": "TV",
      "teacherName": "Tuấn"
    },
    "T5_S_3": {
      "subjectCode": "TOAN",
      "teacherName": "Tuấn"
    },
    "T5_S_4": {
      "subjectCode": "TC_TOAN",
      "teacherName": "Nhàn"
    },
    "T5_C_1": {
      "subjectCode": "TC_TV",
      "teacherName": "Tuấn"
    },
    "T5_C_2": {
      "subjectCode": "MT",
      "teacherName": "Thy"
    },
    "T5_C_3": {
      "subjectCode": "BD_AN",
      "teacherName": "Tâm"
    },
    "T6_S_1": {
      "subjectCode": "HDTN_CD",
      "teacherName": "Thy"
    },
    "T6_S_2": {
      "subjectCode": "TV",
      "teacherName": "Tuấn"
    },
    "T6_S_3": {
      "subjectCode": "TOAN",
      "teacherName": "Tuấn"
    },
    "T6_S_4": {
      "subjectCode": "SHL",
      "teacherName": "Tuấn",
      "notes": "Sinh hoạt lớp cuối tuần"
    },
  },
  "1B": {
    "T2_S_1": {
      "subjectCode": "SHDC",
      "teacherName": "Bé Năm",
      "notes": "Chào cờ đầu tuần"
    },
    "T2_S_2": {
      "subjectCode": "TV",
      "teacherName": "Bé Năm"
    },
    "T2_S_3": {
      "subjectCode": "TV",
      "teacherName": "Bé Năm"
    },
    "T2_S_4": {
      "subjectCode": "TOAN",
      "teacherName": "Bé Năm"
    },
    "T2_C_1": {
      "subjectCode": "TNXH",
      "teacherName": "Phước"
    },
    "T2_C_2": {
      "subjectCode": "TV",
      "teacherName": "Bé Năm"
    },
    "T2_C_3": {
      "subjectCode": "TC_TV",
      "teacherName": "Bé Năm"
    },
    "T3_S_1": {
      "subjectCode": "TV",
      "teacherName": "Bé Năm"
    },
    "T3_S_2": {
      "subjectCode": "TV",
      "teacherName": "Bé Năm"
    },
    "T3_S_3": {
      "subjectCode": "AN",
      "teacherName": "Tâm"
    },
    "T3_S_4": {
      "subjectCode": "MT",
      "teacherName": "Thy"
    },
    "T3_C_1": {
      "subjectCode": "DD",
      "teacherName": "Nhàn"
    },
    "T3_C_2": {
      "subjectCode": "TC_TV",
      "teacherName": "Nhàn"
    },
    "T3_C_3": {
      "subjectCode": "TV",
      "teacherName": "Bé Năm"
    },
    "T4_S_1": {
      "subjectCode": "TV",
      "teacherName": "Bé Năm"
    },
    "T4_S_2": {
      "subjectCode": "TV",
      "teacherName": "Bé Năm"
    },
    "T4_S_3": {
      "subjectCode": "GDTC",
      "teacherName": "Thịnh"
    },
    "T4_S_4": {
      "subjectCode": "HDTN_CD",
      "teacherName": "Thy"
    },
    "T4_C_1": {
      "subjectCode": "TH",
      "teacherName": "Phương"
    },
    "T4_C_2": {
      "subjectCode": "TV",
      "teacherName": "Bé Năm"
    },
    "T4_C_3": {
      "subjectCode": "TNXH",
      "teacherName": "Phước"
    },
    "T5_S_1": {
      "subjectCode": "BD_AN",
      "teacherName": "Tâm"
    },
    "T5_S_2": {
      "subjectCode": "TOAN",
      "teacherName": "Bé Năm"
    },
    "T5_S_3": {
      "subjectCode": "TC_TV",
      "teacherName": "Bé Năm"
    },
    "T5_S_4": {
      "subjectCode": "TNXH",
      "teacherName": "Phước"
    },
    "T5_C_1": {
      "subjectCode": "TV",
      "teacherName": "Bé Năm"
    },
    "T5_C_2": {
      "subjectCode": "TC_TOAN",
      "teacherName": "Bé Năm"
    },
    "T5_C_3": {
      "subjectCode": "TC_TV",
      "teacherName": "Bé Năm"
    },
    "T6_S_1": {
      "subjectCode": "TV",
      "teacherName": "Bé Năm"
    },
    "T6_S_2": {
      "subjectCode": "TV",
      "teacherName": "Bé Năm"
    },
    "T6_S_3": {
      "subjectCode": "TOAN",
      "teacherName": "Bé Năm"
    },
    "T6_S_4": {
      "subjectCode": "SHL",
      "teacherName": "Bé Năm",
      "notes": "Sinh hoạt lớp cuối tuần"
    },
  },
  "2B": {
    "T2_S_1": {
      "subjectCode": "SHDC",
      "teacherName": "Chinh",
      "notes": "Chào cờ đầu tuần"
    },
    "T2_S_2": {
      "subjectCode": "TV",
      "teacherName": "Chinh"
    },
    "T2_S_3": {
      "subjectCode": "TV",
      "teacherName": "Chinh"
    },
    "T2_S_4": {
      "subjectCode": "TOAN",
      "teacherName": "Chinh"
    },
    "T2_C_1": {
      "subjectCode": "TH",
      "teacherName": "Phương"
    },
    "T2_C_2": {
      "subjectCode": "TNXH",
      "teacherName": "Phước"
    },
    "T2_C_3": {
      "subjectCode": "DD",
      "teacherName": "Nhàn"
    },
    "T3_S_1": {
      "subjectCode": "TV",
      "teacherName": "Chinh"
    },
    "T3_S_2": {
      "subjectCode": "TV",
      "teacherName": "Chinh"
    },
    "T3_S_3": {
      "subjectCode": "MT",
      "teacherName": "Thy"
    },
    "T3_S_4": {
      "subjectCode": "AN",
      "teacherName": "Tâm"
    },
    "T3_C_1": {
      "subjectCode": "TOAN",
      "teacherName": "Chinh"
    },
    "T3_C_2": {
      "subjectCode": "TC_TV",
      "teacherName": "Chinh"
    },
    "T3_C_3": {
      "subjectCode": "TC_TOAN",
      "teacherName": "Nhàn"
    },
    "T4_S_1": {
      "subjectCode": "GDTC",
      "teacherName": "Thịnh"
    },
    "T4_S_2": {
      "subjectCode": "TC_TOAN",
      "teacherName": "Nhàn"
    },
    "T4_S_3": {
      "subjectCode": "TV",
      "teacherName": "Chinh"
    },
    "T4_S_4": {
      "subjectCode": "TV",
      "teacherName": "Chinh"
    },
    "T4_C_1": {
      "subjectCode": "BD_AN",
      "teacherName": "Tâm"
    },
    "T4_C_2": {
      "subjectCode": "HDTN_CD",
      "teacherName": "Thy"
    },
    "T4_C_3": {
      "subjectCode": "GDTC",
      "teacherName": "Thịnh"
    },
    "T5_S_1": {
      "subjectCode": "TV",
      "teacherName": "Chinh"
    },
    "T5_S_2": {
      "subjectCode": "TV",
      "teacherName": "Chinh"
    },
    "T5_S_3": {
      "subjectCode": "TOAN",
      "teacherName": "Chinh"
    },
    "T5_S_4": {
      "subjectCode": "TOAN",
      "teacherName": "Chinh"
    },
    "T5_C_1": {
      "subjectCode": "TC_TV",
      "teacherName": "Chinh"
    },
    "T5_C_2": {
      "subjectCode": "TC_TV",
      "teacherName": "Chinh"
    },
    "T5_C_3": {
      "subjectCode": "TC_TOAN",
      "teacherName": "Chinh"
    },
    "T6_S_1": {
      "subjectCode": "TOAN",
      "teacherName": "Chinh"
    },
    "T6_S_2": {
      "subjectCode": "TV",
      "teacherName": "Chinh"
    },
    "T6_S_3": {
      "subjectCode": "TV",
      "teacherName": "Chinh"
    },
    "T6_S_4": {
      "subjectCode": "SHL",
      "teacherName": "Chinh",
      "notes": "Sinh hoạt lớp cuối tuần"
    },
  },
  "3B": {
    "T2_S_1": {
      "subjectCode": "SHDC",
      "teacherName": "Đạt",
      "notes": "Chào cờ đầu tuần"
    },
    "T2_S_2": {
      "subjectCode": "TV",
      "teacherName": "Đạt"
    },
    "T2_S_3": {
      "subjectCode": "TV",
      "teacherName": "Đạt"
    },
    "T2_S_4": {
      "subjectCode": "TOAN",
      "teacherName": "Đạt"
    },
    "T2_C_1": {
      "subjectCode": "DD",
      "teacherName": "Đạt"
    },
    "T2_C_2": {
      "subjectCode": "TH",
      "teacherName": "Phương"
    },
    "T2_C_3": {
      "subjectCode": "TNXH",
      "teacherName": "Phước"
    },
    "T3_S_1": {
      "subjectCode": "AN",
      "teacherName": "Tâm"
    },
    "T3_S_2": {
      "subjectCode": "TV",
      "teacherName": "Đạt"
    },
    "T3_S_3": {
      "subjectCode": "TOAN",
      "teacherName": "Đạt"
    },
    "T3_S_4": {
      "subjectCode": "TA",
      "teacherName": "Nương"
    },
    "T3_C_1": {
      "subjectCode": "MT",
      "teacherName": "Thy"
    },
    "T3_C_2": {
      "subjectCode": "GDTC",
      "teacherName": "Thịnh"
    },
    "T3_C_3": {
      "subjectCode": "TH",
      "teacherName": "Đạt"
    },
    "T4_S_1": {
      "subjectCode": "TV",
      "teacherName": "Đạt"
    },
    "T4_S_2": {
      "subjectCode": "GDTC",
      "teacherName": "Thịnh"
    },
    "T4_S_3": {
      "subjectCode": "BD_AN",
      "teacherName": "Tâm"
    },
    "T4_S_4": {
      "subjectCode": "TOAN",
      "teacherName": "Đạt"
    },
    "T4_C_1": {
      "subjectCode": "HDTN_CD",
      "teacherName": "Thy"
    },
    "T4_C_2": {
      "subjectCode": "TA",
      "teacherName": "Nương"
    },
    "T4_C_3": {
      "subjectCode": "TC_TV",
      "teacherName": "Đạt"
    },
    "T5_S_1": {
      "subjectCode": "TNXH",
      "teacherName": "Phước"
    },
    "T5_S_2": {
      "subjectCode": "TV",
      "teacherName": "Đạt"
    },
    "T5_S_3": {
      "subjectCode": "TV",
      "teacherName": "Đạt"
    },
    "T5_S_4": {
      "subjectCode": "TOAN",
      "teacherName": "Đạt"
    },
    "T5_C_1": {
      "subjectCode": "GDTC",
      "teacherName": "Thịnh"
    },
    "T5_C_2": {
      "subjectCode": "TA",
      "teacherName": "Nương"
    },
    "T5_C_3": {
      "subjectCode": "TC_TOAN",
      "teacherName": "Đạt"
    },
    "T6_S_1": {
      "subjectCode": "TA",
      "teacherName": "Nương"
    },
    "T6_S_2": {
      "subjectCode": "TV",
      "teacherName": "Đạt"
    },
    "T6_S_3": {
      "subjectCode": "TV",
      "teacherName": "Đạt"
    },
    "T6_S_4": {
      "subjectCode": "SHL",
      "teacherName": "Đạt",
      "notes": "Sinh hoạt lớp cuối tuần"
    },
  },
  "4B": {
    "T2_S_1": {
      "subjectCode": "SHDC",
      "teacherName": "Yến",
      "notes": "Chào cờ đầu tuần"
    },
    "T2_S_2": {
      "subjectCode": "TV",
      "teacherName": "Yến"
    },
    "T2_S_3": {
      "subjectCode": "TV",
      "teacherName": "Yến"
    },
    "T2_S_4": {
      "subjectCode": "TOAN",
      "teacherName": "Yến"
    },
    "T2_C_1": {
      "subjectCode": "LS_DL",
      "teacherName": "Yến"
    },
    "T2_C_2": {
      "subjectCode": "KH",
      "teacherName": "Yến"
    },
    "T2_C_3": {
      "subjectCode": "TH",
      "teacherName": "Phương"
    },
    "T3_S_1": {
      "subjectCode": "TV",
      "teacherName": "Yến"
    },
    "T3_S_2": {
      "subjectCode": "TOAN",
      "teacherName": "Yến"
    },
    "T3_S_3": {
      "subjectCode": "TA",
      "teacherName": "Nương"
    },
    "T3_S_4": {
      "subjectCode": "TH",
      "teacherName": "Nhàn"
    },
    "T3_C_1": {
      "subjectCode": "DD",
      "teacherName": "Yến"
    },
    "T3_C_2": {
      "subjectCode": "KH",
      "teacherName": "Yến"
    },
    "T3_C_3": {
      "subjectCode": "MT",
      "teacherName": "Thy"
    },
    "T4_S_1": {
      "subjectCode": "TV",
      "teacherName": "Yến"
    },
    "T4_S_2": {
      "subjectCode": "TOAN",
      "teacherName": "Yến"
    },
    "T4_S_3": {
      "subjectCode": "HDTN_CD",
      "teacherName": "Thy"
    },
    "T4_S_4": {
      "subjectCode": "AN",
      "teacherName": "Tâm"
    },
    "T4_C_1": {
      "subjectCode": "LS_DL",
      "teacherName": "Yến"
    },
    "T4_C_2": {
      "subjectCode": "BD_AN",
      "teacherName": "Tâm"
    },
    "T4_C_3": {
      "subjectCode": "TA",
      "teacherName": "Nương"
    },
    "T5_S_1": {
      "subjectCode": "TV",
      "teacherName": "Yến"
    },
    "T5_S_2": {
      "subjectCode": "TV",
      "teacherName": "Yến"
    },
    "T5_S_3": {
      "subjectCode": "TOAN",
      "teacherName": "Yến"
    },
    "T5_S_4": {
      "subjectCode": "HDTN_CD",
      "teacherName": "Thy"
    },
    "T5_C_1": {
      "subjectCode": "TC_TOAN",
      "teacherName": "Yến"
    },
    "T5_C_2": {
      "subjectCode": "GDTC",
      "teacherName": "Thịnh"
    },
    "T5_C_3": {
      "subjectCode": "TA",
      "teacherName": "Nương"
    },
    "T6_S_1": {
      "subjectCode": "TV",
      "teacherName": "Yến"
    },
    "T6_S_2": {
      "subjectCode": "TOAN",
      "teacherName": "Yến"
    },
    "T6_S_3": {
      "subjectCode": "TC_TV",
      "teacherName": "Yến"
    },
    "T6_S_4": {
      "subjectCode": "SHL",
      "teacherName": "Yến",
      "notes": "Sinh hoạt lớp cuối tuần"
    },
  },
  "5B": {
    "T2_S_1": {
      "subjectCode": "SHDC",
      "teacherName": "Huế",
      "notes": "Chào cờ đầu tuần"
    },
    "T2_S_2": {
      "subjectCode": "TV",
      "teacherName": "Huế"
    },
    "T2_S_3": {
      "subjectCode": "TV",
      "teacherName": "Huế"
    },
    "T2_S_4": {
      "subjectCode": "TOAN",
      "teacherName": "Huế"
    },
    "T2_C_1": {
      "subjectCode": "LS_DL",
      "teacherName": "Huế"
    },
    "T2_C_2": {
      "subjectCode": "KH",
      "teacherName": "Huế"
    },
    "T2_C_3": {
      "subjectCode": "DD",
      "teacherName": "Quan",
      "notes": "PHT Quan phụ trách Đạo đức Khối 5"
    },
    "T3_S_1": {
      "subjectCode": "TA",
      "teacherName": "Nương"
    },
    "T3_S_2": {
      "subjectCode": "AN",
      "teacherName": "Tâm"
    },
    "T3_S_3": {
      "subjectCode": "TV",
      "teacherName": "Huế"
    },
    "T3_S_4": {
      "subjectCode": "TOAN",
      "teacherName": "Huế"
    },
    "T3_C_1": {
      "subjectCode": "KH",
      "teacherName": "Huế"
    },
    "T3_C_2": {
      "subjectCode": "MT",
      "teacherName": "Thy"
    },
    "T3_C_3": {
      "subjectCode": "GDTC",
      "teacherName": "Thịnh"
    },
    "T4_S_1": {
      "subjectCode": "TH",
      "teacherName": "Nhàn"
    },
    "T4_S_2": {
      "subjectCode": "TV",
      "teacherName": "Huế"
    },
    "T4_S_3": {
      "subjectCode": "TOAN",
      "teacherName": "Huế"
    },
    "T4_S_4": {
      "subjectCode": "LS_DL",
      "teacherName": "Huế"
    },
    "T4_C_1": {
      "subjectCode": "TA",
      "teacherName": "Nương"
    },
    "T4_C_2": {
      "subjectCode": "TH",
      "teacherName": "Phương"
    },
    "T4_C_3": {
      "subjectCode": "TC_TOAN",
      "teacherName": "Huế"
    },
    "T5_S_1": {
      "subjectCode": "TV",
      "teacherName": "Huế"
    },
    "T5_S_2": {
      "subjectCode": "TV",
      "teacherName": "Huế"
    },
    "T5_S_3": {
      "subjectCode": "TOAN",
      "teacherName": "Huế"
    },
    "T5_S_4": {
      "subjectCode": "TH",
      "teacherName": "Huế"
    },
    "T5_C_1": {
      "subjectCode": "TC_TOAN",
      "teacherName": "Huế"
    },
    "T5_C_2": {
      "subjectCode": "TC_TV",
      "teacherName": "Huế"
    },
    "T5_C_3": {
      "subjectCode": "BD_AN",
      "teacherName": "Huế"
    },
    "T6_S_1": {
      "subjectCode": "TV",
      "teacherName": "Huế"
    },
    "T6_S_2": {
      "subjectCode": "TOAN",
      "teacherName": "Huế"
    },
    "T6_S_3": {
      "subjectCode": "TC_TV",
      "teacherName": "Huế"
    },
    "T6_S_4": {
      "subjectCode": "SHL",
      "teacherName": "Huế",
      "notes": "Sinh hoạt lớp cuối tuần"
    },
  },
};
