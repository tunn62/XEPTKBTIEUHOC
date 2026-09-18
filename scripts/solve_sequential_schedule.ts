import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP, DEFAULT_GVCN_POLICIES } from '../src/data/initialData';
import { auditSchedule, isDiem1 } from '../src/solver/cspSolver';
import { BlueprintSlot } from '../src/solver/scheduleBlueprint';
import * as fs from 'fs';

type ScheduleMap = Record<string, Record<string, BlueprintSlot>>;

function buildSequentialSchedule(): ScheduleMap {
  const sched: ScheduleMap = {};
  for (const c of ALL_CLASSES) sched[c.id] = {};

  const set = (cId: string, slotId: string, sub: string, teacher: string, notes?: string) => {
    sched[cId][slotId] = { subjectCode: sub, teacherName: teacher, notes };
  };

  // =========================================================================
  // CORE POLICY REQUIREMENTS:
  // 1. Math (TOAN): Exactly 1/day (T2, T3, T4, T5, T6).
  // 2. Wednesday TV consecutive pair in grades 3, 4, 5 (T4_S_1 & T4_S_2).
  // 3. T2_S_1 = SHDC (GVCN), T6_S_4 = SHL (GVCN).
  // 4. Mid-week HDTN (Tiết 2 HĐTN): GV tăng cường / bộ môn dạy.
  // 5. GVCN Target periods & 2 afternoons off:
  //    - 1A (Chi): 19 periods, off T3 & T5 afternoons
  //    - 2A (Trang TT): 17 periods, off T3 & T5 afternoons
  //    - 3A (Dương): 19 periods, off T2 & T4 afternoons
  //    - 4A (Hằng): 19 periods, off T2 & T4 afternoons
  //    - 5A (Tuấn): 19 periods, off T2 & T4 afternoons
  //    - 1B (Bé Năm TP): 18 periods, off T2 & T4 afternoons
  //    - 2B (Chinh): 19 periods, off T2 & T4 afternoons
  //    - 3B (Đạt): 19 periods, off T3 & T5 afternoons
  //    - 4B (Yến): 19 periods, off T3 & T5 afternoons
  //    - 5B (Huế): 19 periods, off T3 & T5 afternoons
  // =========================================================================

  // -------------------------------------------------------------------------
  // ĐIỂM 1: 1A, 2A, 3A, 4A, 5A
  // -------------------------------------------------------------------------

  // --- THỨ HAI (T2) ---
  // Sáng: S1 SHDC (all 5 GVCN)
  set('1A', 'T2_S_1', 'SHDC', 'Chi');
  set('2A', 'T2_S_1', 'SHDC', 'Trang');
  set('3A', 'T2_S_1', 'SHDC', 'Dương');
  set('4A', 'T2_S_1', 'SHDC', 'Hằng');
  set('5A', 'T2_S_1', 'SHDC', 'Tuấn');

  // Sáng T2: Specialist Thịnh (GDTC) sequentially: S2 1A, S3 2A
  // Specialist Nương (TA) sequentially: S3 3A, S4 4A
  set('1A', 'T2_S_2', 'GDTC', 'Thịnh');
  set('1A', 'T2_S_3', 'TV', 'Chi');
  set('1A', 'T2_S_4', 'TOAN', 'Chi');

  set('2A', 'T2_S_2', 'TV', 'Trang');
  set('2A', 'T2_S_3', 'GDTC', 'Thịnh');
  set('2A', 'T2_S_4', 'TOAN', 'Trang');

  set('3A', 'T2_S_2', 'TV', 'Dương');
  set('3A', 'T2_S_3', 'TA', 'Nương');
  set('3A', 'T2_S_4', 'TOAN', 'Dương');

  set('4A', 'T2_S_2', 'TV', 'Hằng');
  set('4A', 'T2_S_3', 'TOAN', 'Hằng');
  set('4A', 'T2_S_4', 'TA', 'Nương');

  set('5A', 'T2_S_2', 'TV', 'Tuấn');
  set('5A', 'T2_S_3', 'TOAN', 'Tuấn');
  set('5A', 'T2_S_4', 'TV', 'Tuấn');

  // Chiều T2: 3A, 4A, 5A GVCN off.
  // 1A & 2A GVCN teach:
  set('1A', 'T2_C_1', 'TV', 'Chi');
  set('1A', 'T2_C_2', 'TC_TV', 'Chi');
  set('1A', 'T2_C_3', 'TNXH', 'Chi');

  set('2A', 'T2_C_1', 'TV', 'Trang');
  set('2A', 'T2_C_2', 'TV', 'Trang');
  set('2A', 'T2_C_3', 'TC_TOAN', 'Phước'); // Trang TT offloaded 1 period

  // For 3A, 4A, 5A (off): Phương (TH) sequentially: C1 3A, C2 4A, C3 5A
  // Phước (TC / HDTN_CD): C1 5A, C2 3A, C3 4A
  set('3A', 'T2_C_1', 'TH', 'Phương');
  set('3A', 'T2_C_2', 'TC', 'Phước');
  set('3A', 'T2_C_3', 'HDTN_CD', 'Quan');

  set('4A', 'T2_C_1', 'HDTN_CD', 'Quan');
  set('4A', 'T2_C_2', 'TH', 'Phương');
  set('4A', 'T2_C_3', 'TC', 'Phước');

  set('5A', 'T2_C_1', 'TC', 'Phước');
  set('5A', 'T2_C_2', 'HDTN_CD', 'Quan');
  set('5A', 'T2_C_3', 'TH', 'Phương');

  // --- THỨ BA (T3) ---
  // Sáng T3: Nương (TA): S2 5A, S3 4A, S4 3A
  // Thịnh (GDTC): S2 3A, S3 5A
  // Tâm (AN/MT): S4 1A (MT), S3 2A (AN) -> sequential!
  set('1A', 'T3_S_1', 'TV', 'Chi');
  set('1A', 'T3_S_2', 'TV', 'Chi');
  set('1A', 'T3_S_3', 'TOAN', 'Chi');
  set('1A', 'T3_S_4', 'MT', 'Tâm');

  set('2A', 'T3_S_1', 'TV', 'Trang');
  set('2A', 'T3_S_2', 'TV', 'Trang');
  set('2A', 'T3_S_3', 'AN', 'Tâm');
  set('2A', 'T3_S_4', 'TOAN', 'Trang');

  set('3A', 'T3_S_1', 'TV', 'Dương');
  set('3A', 'T3_S_2', 'GDTC', 'Thịnh');
  set('3A', 'T3_S_3', 'TOAN', 'Dương');
  set('3A', 'T3_S_4', 'TA', 'Nương');

  set('4A', 'T3_S_1', 'TV', 'Hằng');
  set('4A', 'T3_S_2', 'TOAN', 'Hằng');
  set('4A', 'T3_S_3', 'TA', 'Nương');
  set('4A', 'T3_S_4', 'KH', 'Hằng');

  set('5A', 'T3_S_1', 'TV', 'Tuấn');
  set('5A', 'T3_S_2', 'TA', 'Nương');
  set('5A', 'T3_S_3', 'GDTC', 'Thịnh');
  set('5A', 'T3_S_4', 'TOAN', 'Tuấn');

  // Chiều T3: 1A & 2A GVCN off!
  // 1A: C1 AN (Tâm), C2 TC (Phước), C3 TC (Quan)
  // 2A: C1 MT (Tâm? no, C2 MT Tâm), C1 TC (Phước), C3 TC (Phước? no, Quan)
  set('1A', 'T3_C_1', 'AN', 'Tâm');
  set('1A', 'T3_C_2', 'TC', 'Phước');
  set('1A', 'T3_C_3', 'HDTN_CD', 'Quan');

  set('2A', 'T3_C_1', 'TC', 'Phước');
  set('2A', 'T3_C_2', 'MT', 'Tâm');
  set('2A', 'T3_C_3', 'HDTN_CD', 'Phước');

  // 3A, 4A, 5A GVCN teach on T3 afternoon:
  set('3A', 'T3_C_1', 'TV', 'Dương');
  set('3A', 'T3_C_2', 'TC_TV', 'Dương');
  set('3A', 'T3_C_3', 'TNXH', 'Dương');

  set('4A', 'T3_C_1', 'TV', 'Hằng');
  set('4A', 'T3_C_2', 'LS_DL', 'Hằng');
  set('4A', 'T3_C_3', 'DD', 'Hằng');

  set('5A', 'T3_C_1', 'TV', 'Tuấn');
  set('5A', 'T3_C_2', 'LS_DL', 'Tuấn');
  set('5A', 'T3_C_3', 'TC_TOAN', 'Tuấn');

  // --- THỨ TƯ (T4) ---
  // Sáng T4: TV pair (S1 & S2) for 3A, 4A, 5A!
  // Thịnh (GDTC): S2 1A, S3 2A
  // Nương (TA): S3 5A, S4 4A, S2 3A (Wait: 3A has TV at S1&S2, so Nương at S4 3A, S3 5A, S2 - wait!)
  // In 3A, 4A, 5A: S1 TV, S2 TV.
  set('3A', 'T4_S_1', 'TV', 'Dương');
  set('3A', 'T4_S_2', 'TV', 'Dương');
  set('3A', 'T4_S_3', 'TOAN', 'Dương');
  set('3A', 'T4_S_4', 'TA', 'Nương');

  set('4A', 'T4_S_1', 'TV', 'Hằng');
  set('4A', 'T4_S_2', 'TV', 'Hằng');
  set('4A', 'T4_S_3', 'TA', 'Nương');
  set('4A', 'T4_S_4', 'TOAN', 'Hằng');

  set('5A', 'T4_S_1', 'TV', 'Tuấn');
  set('5A', 'T4_S_2', 'TV', 'Tuấn');
  set('5A', 'T4_S_3', 'TOAN', 'Tuấn');
  set('5A', 'T4_S_4', 'KH', 'Tuấn');

  set('1A', 'T4_S_1', 'TV', 'Chi');
  set('1A', 'T4_S_2', 'GDTC', 'Thịnh');
  set('1A', 'T4_S_3', 'TOAN', 'Chi');
  set('1A', 'T4_S_4', 'TNXH', 'Chi');

  set('2A', 'T4_S_1', 'TV', 'Trang');
  set('2A', 'T4_S_2', 'TOAN', 'Trang');
  set('2A', 'T4_S_3', 'GDTC', 'Thịnh');
  set('2A', 'T4_S_4', 'TNXH', 'Trang');

  // Chiều T4: 3A, 4A, 5A off!
  // 1A & 2A GVCN teach:
  set('1A', 'T4_C_1', 'TV', 'Chi');
  set('1A', 'T4_C_2', 'TC_TOAN', 'Chi');
  set('1A', 'T4_C_3', 'DD', 'Chi');

  set('2A', 'T4_C_1', 'TNXH', 'Trang');
  set('2A', 'T4_C_2', 'TC_TV', 'Phước'); // Trang offloaded
  set('2A', 'T4_C_3', 'DD', 'Trang');

  // 3A, 4A, 5A: Phương (TH) sequentially: C1 3A, C2 4A, C3 5A
  // Phước (TC): C1 5A, C2 3A, C3 4A
  set('3A', 'T4_C_1', 'TH', 'Phương');
  set('3A', 'T4_C_2', 'TC', 'Phước');
  set('3A', 'T4_C_3', 'AN', 'Tâm');

  set('4A', 'T4_C_1', 'AN', 'Tâm');
  set('4A', 'T4_C_2', 'TH', 'Phương');
  set('4A', 'T4_C_3', 'TC', 'Phước');

  set('5A', 'T4_C_1', 'TC', 'Phước');
  set('5A', 'T4_C_2', 'MT', 'Tâm');
  set('5A', 'T4_C_3', 'TH', 'Phương');

  // --- THỨ NĂM (T5) ---
  // Sáng T5:
  // Nương (TA): S2 3A, S3 4A, S4 5A
  // Thịnh (GDTC): S4 4A -> wait, 5A is at S4? Thịnh at S3 3A, S4 4A? Let's check!
  // Nương at S2 3A, S3 4A, S4 5A
  // Thịnh at S3 5A? Wait, 5A has Nương at S4! So Thịnh can teach 5A at S2? No, Nương is at S2 3A.
  // In 4A: Thịnh teaches GDTC at S2 4A!
  // In 3A: Thịnh teaches GDTC at S3 3A!
  // In 5A: Tuấn teaches TV/TOAN/KH!
  set('1A', 'T5_S_1', 'TV', 'Chi');
  set('1A', 'T5_S_2', 'TV', 'Chi');
  set('1A', 'T5_S_3', 'TOAN', 'Chi');
  set('1A', 'T5_S_4', 'TC', 'Phước');

  set('2A', 'T5_S_1', 'TV', 'Trang');
  set('2A', 'T5_S_2', 'TV', 'Trang');
  set('2A', 'T5_S_3', 'TOAN', 'Trang');
  set('2A', 'T5_S_4', 'TC', 'Phước');

  set('3A', 'T5_S_1', 'TV', 'Dương');
  set('3A', 'T5_S_2', 'TA', 'Nương');
  set('3A', 'T5_S_3', 'GDTC', 'Thịnh');
  set('3A', 'T5_S_4', 'TOAN', 'Dương');

  set('4A', 'T5_S_1', 'TV', 'Hằng');
  set('4A', 'T5_S_2', 'GDTC', 'Thịnh');
  set('4A', 'T5_S_3', 'TA', 'Nương');
  set('4A', 'T5_S_4', 'TOAN', 'Hằng');

  set('5A', 'T5_S_1', 'TV', 'Tuấn');
  set('5A', 'T5_S_2', 'TOAN', 'Tuấn');
  set('5A', 'T5_S_3', 'KH', 'Tuấn');
  set('5A', 'T5_S_4', 'TA', 'Nương');

  // Chiều T5: 1A & 2A GVCN off!
  // 1A: C1 TC (Phước), C2 BD_TH (Phương), C3 TC (Phước) -> Phước cannot teach C1 & C3 with gap? Phước is at 1A C1, 2A C2, 1A C3?
  // Let's use:
  // 1A: C1 TC (Phước), C2 BD_TH (Phương), C3 TC (Quan)
  // 2A: C1 BD_TH (Phương), C2 TC (Phước), C3 TC (Phước? No, Tâm!)
  set('1A', 'T5_C_1', 'TC', 'Phước');
  set('1A', 'T5_C_2', 'BD_TH', 'Phương');
  set('1A', 'T5_C_3', 'TC', 'Quan');

  set('2A', 'T5_C_1', 'BD_TH', 'Phương');
  set('2A', 'T5_C_2', 'TC', 'Phước');
  set('2A', 'T5_C_3', 'TC', 'Tâm');

  // 3A, 4A, 5A GVCN teach:
  set('3A', 'T5_C_1', 'DD', 'Dương');
  set('3A', 'T5_C_2', 'TNXH', 'Dương');
  set('3A', 'T5_C_3', 'TC_TOAN', 'Dương');

  set('4A', 'T5_C_1', 'KH', 'Hằng');
  set('4A', 'T5_C_2', 'LS_DL', 'Hằng');
  set('4A', 'T5_C_3', 'TC_TOAN', 'Hằng');

  set('5A', 'T5_C_1', 'KH', 'Tuấn');
  set('5A', 'T5_C_2', 'LS_DL', 'Tuấn');
  set('5A', 'T5_C_3', 'DD', 'Tuấn');

  // --- THỨ SÁU (T6) ---
  // S1: TV (all 5 classes)
  // S2: GDTC Thịnh for 3A & 5A? Thịnh S2 3A, S3 5A?
  // S3: TOAN (ALL 5 CLASSES - GVCN teaches!)
  // S4: SHL (ALL 5 CLASSES - GVCN teaches!)
  set('1A', 'T6_S_1', 'TV', 'Chi');
  set('1A', 'T6_S_2', 'BD_TH', 'Phương');
  set('1A', 'T6_S_3', 'TOAN', 'Chi');
  set('1A', 'T6_S_4', 'SHL', 'Chi');

  set('2A', 'T6_S_1', 'TV', 'Trang');
  set('2A', 'T6_S_2', 'BD_NT', 'Tâm');
  set('2A', 'T6_S_3', 'TOAN', 'Trang');
  set('2A', 'T6_S_4', 'SHL', 'Trang');

  set('3A', 'T6_S_1', 'TV', 'Dương');
  set('3A', 'T6_S_2', 'GDTC', 'Thịnh');
  set('3A', 'T6_S_3', 'TOAN', 'Dương');
  set('3A', 'T6_S_4', 'SHL', 'Dương');

  set('4A', 'T6_S_1', 'TV', 'Hằng');
  set('4A', 'T6_S_2', 'MT', 'Tâm');
  set('4A', 'T6_S_3', 'TOAN', 'Hằng');
  set('4A', 'T6_S_4', 'SHL', 'Hằng');

  set('5A', 'T6_S_1', 'TV', 'Tuấn');
  set('5A', 'T6_S_2', 'AN', 'Tâm'); // wait, Tâm at S2 2A & 5A? Change 5A to GDTC Thịnh at S2? No, 3A has Thịnh. So 5A has TC Phước!
  set('5A', 'T6_S_2', 'TC', 'Phước');
  set('5A', 'T6_S_3', 'TOAN', 'Tuấn');
  set('5A', 'T6_S_4', 'SHL', 'Tuấn');

  // -------------------------------------------------------------------------
  // ĐIỂM 2: 1B, 2B, 3B, 4B, 5B
  // In Điểm 2:
  // Teachers available:
  // Sáng: Phương (TH), Thy (AN/MT), Nhàn (TC), Quan (TC)
  // Chiều: Nương (TA), Thịnh (GDTC), Nhàn (TC/HDTN), Thy (AN/MT)
  // -------------------------------------------------------------------------

  // --- THỨ HAI (T2) ---
  // Sáng: S1 SHDC (all 5 GVCN)
  set('1B', 'T2_S_1', 'SHDC', 'Bé Năm');
  set('2B', 'T2_S_1', 'SHDC', 'Chinh');
  set('3B', 'T2_S_1', 'SHDC', 'Đạt');
  set('4B', 'T2_S_1', 'SHDC', 'Yến');
  set('5B', 'T2_S_1', 'SHDC', 'Huế');

  // Sáng T2: Thy (AN/MT): S2 1B (MT), S3 2B (AN)
  // Phương (TH): S4 3B
  set('1B', 'T2_S_2', 'MT', 'Thy');
  set('1B', 'T2_S_3', 'TV', 'Bé Năm');
  set('1B', 'T2_S_4', 'TOAN', 'Bé Năm');

  set('2B', 'T2_S_2', 'TV', 'Chinh');
  set('2B', 'T2_S_3', 'AN', 'Thy');
  set('2B', 'T2_S_4', 'TOAN', 'Chinh');

  set('3B', 'T2_S_2', 'TV', 'Đạt');
  set('3B', 'T2_S_3', 'TOAN', 'Đạt');
  set('3B', 'T2_S_4', 'TH', 'Phương');

  set('4B', 'T2_S_2', 'TV', 'Yến');
  set('4B', 'T2_S_3', 'TOAN', 'Yến');
  set('4B', 'T2_S_4', 'KH', 'Yến');

  set('5B', 'T2_S_2', 'TV', 'Huế');
  set('5B', 'T2_S_3', 'TOAN', 'Huế');
  set('5B', 'T2_S_4', 'KH', 'Huế');

  // Chiều T2: 1B & 2B GVCN off!
  // Thịnh (GDTC): C1 1B, C2 2B
  // Nương (TA): C1 3B, C2 4B, C3 5B
  // Nhàn (TC/HDTN): C1 4B, C2 1B (HDTN_CD), C3 2B (HDTN_CD)
  // Thy (AN/MT): C2 3B, C3 4B
  set('1B', 'T2_C_1', 'GDTC', 'Thịnh');
  set('1B', 'T2_C_2', 'HDTN_CD', 'Nhàn');
  set('1B', 'T2_C_3', 'TC', 'Nhàn');

  set('2B', 'T2_C_1', 'TC', 'Nhàn');
  set('2B', 'T2_C_2', 'GDTC', 'Thịnh');
  set('2B', 'T2_C_3', 'HDTN_CD', 'Nhàn');

  // 3B, 4B, 5B GVCN teach or have specialists:
  // 3B: C1 TA(Nương), C2 TV(Đạt), C3 TV(Đạt)
  set('3B', 'T2_C_1', 'TA', 'Nương');
  set('3B', 'T2_C_2', 'TV', 'Đạt');
  set('3B', 'T2_C_3', 'TV', 'Đạt');

  // 4B: C1 TV(Yến), C2 TA(Nương), C3 TV(Yến)
  set('4B', 'T2_C_1', 'TV', 'Yến');
  set('4B', 'T2_C_2', 'TA', 'Nương');
  set('4B', 'T2_C_3', 'TV', 'Yến');

  // 5B: C1 TV(Huế), C2 TV(Huế), C3 TA(Nương)
  set('5B', 'T2_C_1', 'TV', 'Huế');
  set('5B', 'T2_C_2', 'TV', 'Huế');
  set('5B', 'T2_C_3', 'TA', 'Nương');

  // --- THỨ BA (T3) ---
  // Sáng T3:
  // Phương (TH): S2 4B, S3 5B
  // Thy (AN/MT): S3 3B (AN), S4 4B (MT)
  set('1B', 'T3_S_1', 'TV', 'Bé Năm');
  set('1B', 'T3_S_2', 'TV', 'Bé Năm');
  set('1B', 'T3_S_3', 'TOAN', 'Bé Năm');
  set('1B', 'T3_S_4', 'TNXH', 'Bé Năm');

  set('2B', 'T3_S_1', 'TV', 'Chinh');
  set('2B', 'T3_S_2', 'TV', 'Chinh');
  set('2B', 'T3_S_3', 'TOAN', 'Chinh');
  set('2B', 'T3_S_4', 'TNXH', 'Chinh');

  set('3B', 'T3_S_1', 'TV', 'Đạt');
  set('3B', 'T3_S_2', 'TNXH', 'Đạt');
  set('3B', 'T3_S_3', 'AN', 'Thy');
  set('3B', 'T3_S_4', 'TOAN', 'Đạt');

  set('4B', 'T3_S_1', 'TV', 'Yến');
  set('4B', 'T3_S_2', 'TH', 'Phương');
  set('4B', 'T3_S_3', 'TOAN', 'Yến');
  set('4B', 'T3_S_4', 'MT', 'Thy');

  set('5B', 'T3_S_1', 'TV', 'Huế');
  set('5B', 'T3_S_2', 'TOAN', 'Huế');
  set('5B', 'T3_S_3', 'TH', 'Phương');
  set('5B', 'T3_S_4', 'KH', 'Huế');

  // Chiều T3: 3B, 4B, 5B GVCN off!
  // 1B & 2B GVCN teach:
  set('1B', 'T3_C_1', 'TV', 'Bé Năm');
  set('1B', 'T3_C_2', 'TC_TOAN', 'Bé Năm');
  set('1B', 'T3_C_3', 'DD', 'Bé Năm');

  set('2B', 'T3_C_1', 'TV', 'Chinh');
  set('2B', 'T3_C_2', 'TC_TOAN', 'Chinh');
  set('2B', 'T3_C_3', 'DD', 'Chinh');

  // 3B, 4B, 5B (off):
  // Nương (TA): C1 3B, C2 4B, C3 5B
  // Thịnh (GDTC): C1 4B, C2 5B, C3 3B
  // Nhàn (TC / HDTN): C1 5B (HDTN_CD), C2 3B (HDTN_CD), C3 4B (HDTN_CD)
  set('3B', 'T3_C_1', 'TA', 'Nương');
  set('3B', 'T3_C_2', 'HDTN_CD', 'Nhàn');
  set('3B', 'T3_C_3', 'GDTC', 'Thịnh');

  set('4B', 'T3_C_1', 'GDTC', 'Thịnh');
  set('4B', 'T3_C_2', 'TA', 'Nương');
  set('4B', 'T3_C_3', 'HDTN_CD', 'Nhàn');

  set('5B', 'T3_C_1', 'HDTN_CD', 'Nhàn');
  set('5B', 'T3_C_2', 'GDTC', 'Thịnh');
  set('5B', 'T3_C_3', 'TA', 'Nương');

  // --- THỨ TƯ (T4) ---
  // Sáng T4: TV consecutive pair (S1 & S2) for 3B, 4B, 5B!
  // Phương (TH): S4 4B
  // Thy (AN/MT): S3 1B (AN), S4 2B (MT)
  set('1B', 'T4_S_1', 'TV', 'Bé Năm');
  set('1B', 'T4_S_2', 'TV', 'Bé Năm');
  set('1B', 'T4_S_3', 'AN', 'Thy');
  set('1B', 'T4_S_4', 'TOAN', 'Bé Năm');

  set('2B', 'T4_S_1', 'TV', 'Chinh');
  set('2B', 'T4_S_2', 'TV', 'Chinh');
  set('2B', 'T4_S_3', 'TOAN', 'Chinh');
  set('2B', 'T4_S_4', 'MT', 'Thy');

  set('3B', 'T4_S_1', 'TV', 'Đạt');
  set('3B', 'T4_S_2', 'TV', 'Đạt');
  set('3B', 'T4_S_3', 'TOAN', 'Đạt');
  set('3B', 'T4_S_4', 'TNXH', 'Đạt');

  set('4B', 'T4_S_1', 'TV', 'Yến');
  set('4B', 'T4_S_2', 'TV', 'Yến');
  set('4B', 'T4_S_3', 'TOAN', 'Yến');
  set('4B', 'T4_S_4', 'TH', 'Phương');

  set('5B', 'T4_S_1', 'TV', 'Huế');
  set('5B', 'T4_S_2', 'TV', 'Huế');
  set('5B', 'T4_S_3', 'TOAN', 'Huế');
  set('5B', 'T4_S_4', 'LS_DL', 'Huế');

  // Chiều T4: 1B & 2B GVCN off!
  // Thịnh (GDTC): C1 1B, C2 2B
  // Nhàn (TC): C1 2B, C2 1B
  set('1B', 'T4_C_1', 'GDTC', 'Thịnh');
  set('1B', 'T4_C_2', 'TC', 'Nhàn');
  set('1B', 'T4_C_3', 'TC', 'Nhàn');

  set('2B', 'T4_C_1', 'TC', 'Nhàn');
  set('2B', 'T4_C_2', 'GDTC', 'Thịnh');
  set('2B', 'T4_C_3', 'TC', 'Nhàn');

  // 3B, 4B, 5B GVCN teach:
  set('3B', 'T4_C_1', 'TV', 'Đạt');
  set('3B', 'T4_C_2', 'TC_TV', 'Đạt');
  set('3B', 'T4_C_3', 'TC_TOAN', 'Đạt');

  set('4B', 'T4_C_1', 'TV', 'Yến');
  set('4B', 'T4_C_2', 'LS_DL', 'Yến');
  set('4B', 'T4_C_3', 'TC_TOAN', 'Yến');

  set('5B', 'T4_C_1', 'TV', 'Huế');
  set('5B', 'T4_C_2', 'LS_DL', 'Huế');
  set('5B', 'T4_C_3', 'TC_TOAN', 'Huế');

  // --- THỨ NĂM (T5) ---
  // Sáng T5:
  // Phương (TH): S2 3B, S3 5B
  // Thy (AN/MT): S3 4B (AN), S4 5B (AN)
  // Nhàn (TC): S4 1B, S4 2B (Wait, Nhàn at S4 1B, Thy at S4 5B)
  set('1B', 'T5_S_1', 'TV', 'Bé Năm');
  set('1B', 'T5_S_2', 'TV', 'Bé Năm');
  set('1B', 'T5_S_3', 'TOAN', 'Bé Năm');
  set('1B', 'T5_S_4', 'TC', 'Nhàn');

  set('2B', 'T5_S_1', 'TV', 'Chinh');
  set('2B', 'T5_S_2', 'TV', 'Chinh');
  set('2B', 'T5_S_3', 'TOAN', 'Chinh');
  set('2B', 'T5_S_4', 'TC', 'Quan'); // Quan at Điểm 2 Thursday morning

  set('3B', 'T5_S_1', 'TV', 'Đạt');
  set('3B', 'T5_S_2', 'TH', 'Phương');
  set('3B', 'T5_S_3', 'TOAN', 'Đạt');
  set('3B', 'T5_S_4', 'MT', 'Thy');

  set('4B', 'T5_S_1', 'TV', 'Yến');
  set('4B', 'T5_S_2', 'KH', 'Yến');
  set('4B', 'T5_S_3', 'AN', 'Thy');
  set('4B', 'T5_S_4', 'TOAN', 'Yến');

  set('5B', 'T5_S_1', 'TV', 'Huế');
  set('5B', 'T5_S_2', 'KH', 'Huế');
  set('5B', 'T5_S_3', 'TH', 'Phương');
  set('5B', 'T5_S_4', 'AN', 'Thy');

  // Chiều T5: 3B, 4B, 5B GVCN off!
  // 1B & 2B GVCN teach (Bé Năm teaches 2 periods: C1 & C2; C3 is Nhàn TC_TV -> 14 morning + 4 afternoon = 18 total!)
  set('1B', 'T5_C_1', 'TV', 'Bé Năm');
  set('1B', 'T5_C_2', 'TNXH', 'Bé Năm');
  set('1B', 'T5_C_3', 'TC_TV', 'Nhàn'); // Bé Năm target = 18!

  set('2B', 'T5_C_1', 'TV', 'Chinh');
  set('2B', 'T5_C_2', 'TNXH', 'Chinh');
  set('2B', 'T5_C_3', 'TC_TV', 'Chinh'); // Chinh target = 19!

  // 3B, 4B, 5B (off):
  // Nương (TA): C1 3B, C2 4B, C3 5B
  // Thịnh (GDTC): C1 5B, C2 3B, C3 4B
  // Nhàn (TC): C1 4B, C2 5B, C3 3B
  set('3B', 'T5_C_1', 'TA', 'Nương');
  set('3B', 'T5_C_2', 'GDTC', 'Thịnh');
  set('3B', 'T5_C_3', 'TC', 'Nhàn');

  set('4B', 'T5_C_1', 'TC', 'Nhàn');
  set('4B', 'T5_C_2', 'TA', 'Nương');
  set('4B', 'T5_C_3', 'GDTC', 'Thịnh');

  set('5B', 'T5_C_1', 'GDTC', 'Thịnh');
  set('5B', 'T5_C_2', 'TC', 'Nhàn');
  set('5B', 'T5_C_3', 'TA', 'Nương');

  // --- THỨ SÁU (T6) ---
  // S1: TV (all 5 classes)
  // S2: BD / TC / MT: Thy (MT) for 5B, Nhàn for 1B/2B/3B?
  // Sequential: S2 1B (Nhàn), S2 2B (Thy), S2 3B (Đạt DD), S2 4B (Yến LS_DL), S2 5B (Huế LS_DL)
  // S3: TOAN (ALL 5 CLASSES - GVCN teaches!)
  // S4: SHL (ALL 5 CLASSES - GVCN teaches!)
  set('1B', 'T6_S_1', 'TV', 'Bé Năm');
  set('1B', 'T6_S_2', 'TC', 'Nhàn');
  set('1B', 'T6_S_3', 'TOAN', 'Bé Năm');
  set('1B', 'T6_S_4', 'SHL', 'Bé Năm');

  set('2B', 'T6_S_1', 'TV', 'Chinh');
  set('2B', 'T6_S_2', 'BD_NT', 'Thy');
  set('2B', 'T6_S_3', 'TOAN', 'Chinh');
  set('2B', 'T6_S_4', 'SHL', 'Chinh');

  set('3B', 'T6_S_1', 'TV', 'Đạt');
  set('3B', 'T6_S_2', 'DD', 'Đạt');
  set('3B', 'T6_S_3', 'TOAN', 'Đạt');
  set('3B', 'T6_S_4', 'SHL', 'Đạt');

  set('4B', 'T6_S_1', 'TV', 'Yến');
  set('4B', 'T6_S_2', 'LS_DL', 'Yến');
  set('4B', 'T6_S_3', 'TOAN', 'Yến');
  set('4B', 'T6_S_4', 'SHL', 'Yến');

  set('5B', 'T6_S_1', 'TV', 'Huế');
  set('5B', 'T6_S_2', 'MT', 'Thy'); // wait, Thy at S2 2B and S2 5B? Let's make 5B S2 be DD(Huế)!
  set('5B', 'T6_S_2', 'DD', 'Huế');
  set('5B', 'T6_S_3', 'TOAN', 'Huế');
  set('5B', 'T6_S_4', 'SHL', 'Huế');

  return sched;
}

const sched = buildSequentialSchedule();
const violations = auditSchedule(sched);
console.log('AUDIT VIOLATIONS COUNT:', violations.length);
for (const v of violations) {
  console.log(`[${v.code}] ${v.title} :: ${v.description}`);
}
