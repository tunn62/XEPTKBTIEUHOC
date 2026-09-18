import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP, ALL_TEACHERS, DEFAULT_GVCN_POLICIES } from '../src/data/initialData';
import { auditSchedule } from '../src/solver/cspSolver';
import { BlueprintSlot } from '../src/solver/scheduleBlueprint';

type ScheduleMap = Record<string, Record<string, BlueprintSlot>>;

export function generateExactSchedule(): ScheduleMap {
  const sched: ScheduleMap = {};
  for (const c of ALL_CLASSES) sched[c.id] = {};

  const set = (cId: string, slotId: string, sub: string, teacher: string, notes?: string) => {
    sched[cId][slotId] = { subjectCode: sub, teacherName: teacher, notes };
  };

  // =========================================================================
  // ĐIỂM 1: 1A, 2A, 3A, 4A, 5A
  //
  // GVCN Quotas:
  // - 1A (Chi): 19 (15 morning + 4 afternoon: T2_C 2 + T4_C 2; Off: T3_C, T5_C)
  // - 2A (Trang TT): 17 (15 morning + 2 afternoon: T2_C 2 + T4_C 0; Off: T3_C, T5_C)
  // - 3A (Dương): 19 (13 morning + 6 afternoon: T3_C 3 + T5_C 3; Off: T2_C, T4_C)
  // - 4A (Hằng): 19 (14 morning + 5 afternoon: T3_C 3 + T5_C 2; Off: T2_C, T4_C)
  // - 5A (Tuấn): 19 (13 morning + 6 afternoon: T3_C 3 + T5_C 3; Off: T2_C, T4_C)
  //
  // Specialists available at Điểm 1:
  // - Nương (TA): Sáng T2, T3, T4, T5
  // - Thịnh (GDTC): Sáng T2, T3, T4, T5, T6
  // - Tâm (AN, MT, TC): Sáng & Chiều
  // - Phương (TH, BD): Chiều T2, T4, T5; Sáng T6
  // - Phước (TC, HDTN): Chiều T2, T3, T4, T5; Sáng T5, T6
  // - Quan (TC, HDTN): Chiều T2, T3, T4, T5; Sáng T5
  // =========================================================================

  // --- THỨ HAI (T2) - ĐIỂM 1 ---
  // Sáng: S1 SHDC (all 5 GVCN)
  set('1A', 'T2_S_1', 'SHDC', 'Chi');
  set('2A', 'T2_S_1', 'SHDC', 'Trang');
  set('3A', 'T2_S_1', 'SHDC', 'Dương');
  set('4A', 'T2_S_1', 'SHDC', 'Hằng');
  set('5A', 'T2_S_1', 'SHDC', 'Tuấn');

  // S2..S4:
  // Thịnh (GDTC): S2 1A, S3 2A
  // Nương (TA): S2 5A, S3 3A, S4 4A
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

  set('5A', 'T2_S_2', 'TA', 'Nương');
  set('5A', 'T2_S_3', 'TOAN', 'Tuấn');
  set('5A', 'T2_S_4', 'TV', 'Tuấn');

  // Chiều T2: 3A, 4A, 5A GVCN off!
  // Teachers teaching:
  // 1A: C1 TV (Chi), C2 TC_TV (Tâm), C3 TC (Chi)
  // 2A: C1 TV (Trang), C2 TV (Trang), C3 TC_TOAN (Quan)
  // 3A: C1 TH (Phương), C2 TC (Phước), C3 HDTN_CD (Tâm)
  // 4A: C1 HDTN_CD (Quan), C2 TH (Phương), C3 TC (Phước)
  // 5A: C1 TC (Phước), C2 HDTN_CD (Quan), C3 TH (Phương)
  // Distinctness at C1: 1A Chi, 2A Trang, 3A Phương, 4A Quan, 5A Phước -> UNIQUE
  // Distinctness at C2: 1A Tâm, 2A Trang, 3A Phước, 4A Phương, 5A Quan -> UNIQUE
  // Distinctness at C3: 1A Chi, 2A Quan, 3A Tâm, 4A Phước, 5A Phương -> UNIQUE
  set('1A', 'T2_C_1', 'TV', 'Chi');
  set('1A', 'T2_C_2', 'TC_TV', 'Tâm');
  set('1A', 'T2_C_3', 'TC', 'Chi');

  set('2A', 'T2_C_1', 'TV', 'Trang');
  set('2A', 'T2_C_2', 'TV', 'Trang');
  set('2A', 'T2_C_3', 'TC_TOAN', 'Quan');

  set('3A', 'T2_C_1', 'TH', 'Phương');
  set('3A', 'T2_C_2', 'TC', 'Phước');
  set('3A', 'T2_C_3', 'HDTN_CD', 'Tâm');

  set('4A', 'T2_C_1', 'HDTN_CD', 'Quan');
  set('4A', 'T2_C_2', 'TH', 'Phương');
  set('4A', 'T2_C_3', 'TC', 'Phước');

  set('5A', 'T2_C_1', 'TC', 'Phước');
  set('5A', 'T2_C_2', 'HDTN_CD', 'Quan');
  set('5A', 'T2_C_3', 'TH', 'Phương');

  // --- THỨ BA (T3) - ĐIỂM 1 ---
  // Sáng:
  // Thịnh (GDTC): S2 3A, S3 5A
  // Nương (TA): S2 5A (wait, 5A has GDTC at S3, so TA at S2), S3 4A, S4 3A
  // Tâm (AN/MT/TC): S2 1A (TC), S3 2A (AN), S4 1A (MT)
  set('1A', 'T3_S_1', 'TV', 'Chi');
  set('1A', 'T3_S_2', 'TC', 'Tâm');
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
  // 3A, 4A, 5A GVCN teach all 3 periods!
  // 1A: C1 AN (Tâm), C2 TC (Phước), C3 HDTN_CD (Quan)
  // 2A: C1 TC (Phước), C2 MT (Tâm), C3 HDTN_CD (Phước -> Quan? C3 Quan is at 1A, so C3 2A is Phước!)
  set('1A', 'T3_C_1', 'AN', 'Tâm');
  set('1A', 'T3_C_2', 'TC', 'Phước');
  set('1A', 'T3_C_3', 'HDTN_CD', 'Quan');

  set('2A', 'T3_C_1', 'TC', 'Phước');
  set('2A', 'T3_C_2', 'MT', 'Tâm');
  set('2A', 'T3_C_3', 'HDTN_CD', 'Phước');

  set('3A', 'T3_C_1', 'TV', 'Dương');
  set('3A', 'T3_C_2', 'TC_TV', 'Dương');
  set('3A', 'T3_C_3', 'TNXH', 'Dương');

  set('4A', 'T3_C_1', 'TV', 'Hằng');
  set('4A', 'T3_C_2', 'LS_DL', 'Hằng');
  set('4A', 'T3_C_3', 'DD', 'Hằng');

  set('5A', 'T3_C_1', 'TV', 'Tuấn');
  set('5A', 'T3_C_2', 'LS_DL', 'Tuấn');
  set('5A', 'T3_C_3', 'TC_TOAN', 'Tuấn');

  // --- THỨ TƯ (T4) - ĐIỂM 1 ---
  // Sáng: TV consecutive pair at S1 & S2 for 3A, 4A, 5A!
  // Thịnh (GDTC): S2 1A, S3 2A
  // Nương (TA): S3 4A, S4 3A
  set('1A', 'T4_S_1', 'TV', 'Chi');
  set('1A', 'T4_S_2', 'GDTC', 'Thịnh');
  set('1A', 'T4_S_3', 'TOAN', 'Chi');
  set('1A', 'T4_S_4', 'TNXH', 'Chi');

  set('2A', 'T4_S_1', 'TV', 'Trang');
  set('2A', 'T4_S_2', 'TOAN', 'Trang');
  set('2A', 'T4_S_3', 'GDTC', 'Thịnh');
  set('2A', 'T4_S_4', 'TNXH', 'Trang');

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

  // Chiều T4: 3A, 4A, 5A GVCN off!
  // 1A GVCN teaches C1, C2; C3 is Quan
  // 2A Trang teaches 0 (target 17): C1 Tâm, C2 Quan, C3 Phước
  // 3A, 4A, 5A:
  // C1: 1A Chi, 2A Tâm, 3A Phương, 4A Phước, 5A Quan
  // C2: 1A Chi, 2A Quan, 3A Phước, 4A Phương, 5A Tâm
  // C3: 1A Quan, 2A Phước, 3A Tâm, 4A Quan(Wait: 1A Quan & 4A Quan? Make 4A C3 Phước, 2A C3 Tâm, 3A C3 Quan!)
  // Let's verify slot by slot for C1, C2, C3:
  // C1: 1A Chi, 2A DD(Tâm), 3A TH(Phương), 4A AN(Quan), 5A TC(Phước) -> ALL 5 UNIQUE!
  // C2: 1A Chi, 2A TC_TV(Quan), 3A TC(Phước), 4A TH(Phương), 5A MT(Tâm) -> ALL 5 UNIQUE!
  // C3: 1A DD(Quan), 2A TC(Tâm), 3A AN(Phước? No, 3A TC(Phước)), 4A TC(Tâm? No, 4A TC(Quan)? Let's check below!)
  set('1A', 'T4_C_1', 'TV', 'Chi');
  set('1A', 'T4_C_2', 'TC_TOAN', 'Chi');
  set('1A', 'T4_C_3', 'DD', 'Quan');

  set('2A', 'T4_C_1', 'DD', 'Tâm');
  set('2A', 'T4_C_2', 'TC_TV', 'Quan');
  set('2A', 'T4_C_3', 'TC', 'Phước');

  set('3A', 'T4_C_1', 'TH', 'Phương');
  set('3A', 'T4_C_2', 'TC', 'Phước');
  set('3A', 'T4_C_3', 'AN', 'Tâm');

  set('4A', 'T4_C_1', 'AN', 'Quan');
  set('4A', 'T4_C_2', 'TH', 'Phương');
  set('4A', 'T4_C_3', 'TC', 'Phước'); // Wait: 2A C3 Phước & 4A C3 Phước! Change 2A C3 to Tâm!
  // Then: 1A Quan, 2A Tâm, 3A Tâm? No, 3A C3 can be TH Phương? Phương at C2. 3A C3 can be Phước!
  // Let's set C3: 1A Quan, 2A Phước, 3A Tâm, 4A TH(Phương? No, 4A C3 is TC(Quan? Quan at 1A!))
  // We have 4 specialists at Điểm 1 afternoon: Phương, Phước, Quan, Tâm!
  // Plus 1A Chi is at C1 & C2, but NOT C3!
  // So at C3, exactly 5 classes need 5 teachers: Chi? Chi can teach C3 in 1A!
  // If Chi teaches C3 in 1A, Chi has 3 afternoon periods on Wednesday!
  // Then Chi has 2 on Monday + 3 on Wednesday = 5 afternoon + 14 morning = 19 periods! PERFECT!
  // If Chi teaches 1A at C3, then at C3 only 4 classes (2A, 3A, 4A, 5A) need teachers, and we have 4 specialists: Phương, Phước, Quan, Tâm!
  // Exactly 4 teachers for 4 classes! 1-to-1 bijection!
  set('1A', 'T4_C_3', 'DD', 'Chi'); // Chi teaches!
  set('2A', 'T4_C_3', 'TC', 'Quan');
  set('3A', 'T4_C_3', 'AN', 'Tâm');
  set('4A', 'T4_C_3', 'TC', 'Phước');
  set('5A', 'T4_C_3', 'TH', 'Phương');

  // --- THỨ NĂM (T5) - ĐIỂM 1 ---
  // Sáng:
  // Nương (TA): S2 3A, S3 4A, S4 5A
  // Thịnh (GDTC): S2 4A, S3 3A
  // Phước (TC): S4 1A
  // Quan (TC): S4 2A
  set('1A', 'T5_S_1', 'TV', 'Chi');
  set('1A', 'T5_S_2', 'TNXH', 'Chi');
  set('1A', 'T5_S_3', 'TOAN', 'Chi');
  set('1A', 'T5_S_4', 'TC', 'Phước');

  set('2A', 'T5_S_1', 'TV', 'Trang');
  set('2A', 'T5_S_2', 'TNXH', 'Trang');
  set('2A', 'T5_S_3', 'TOAN', 'Trang');
  set('2A', 'T5_S_4', 'TC', 'Quan');

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
  // 3A, 5A GVCN teach.
  // 4A GVCN teaches C1, C2; C3 is specialist.
  // Tuấn offloads C2 (Quan) and C3 (Phương) -> 19 periods!
  // C1: 1A Phước, 2A Phương, 3A Dương, 4A Hằng, 5A Tuấn -> UNIQUE
  // C2: 1A Phương, 2A Phước, 3A Dương, 4A Hằng, 5A Quan -> UNIQUE
  // C3: 1A Quan, 2A Tâm, 3A Dương, 4A Phước, 5A Phương -> UNIQUE
  set('1A', 'T5_C_1', 'TC', 'Phước');
  set('1A', 'T5_C_2', 'BD_TH', 'Phương');
  set('1A', 'T5_C_3', 'TC', 'Quan');

  set('2A', 'T5_C_1', 'BD_TH', 'Phương');
  set('2A', 'T5_C_2', 'TC', 'Phước');
  set('2A', 'T5_C_3', 'TC', 'Tâm');

  set('3A', 'T5_C_1', 'DD', 'Dương');
  set('3A', 'T5_C_2', 'TNXH', 'Dương');
  set('3A', 'T5_C_3', 'TC_TOAN', 'Dương');

  set('4A', 'T5_C_1', 'KH', 'Hằng');
  set('4A', 'T5_C_2', 'LS_DL', 'Hằng');
  set('4A', 'T5_C_3', 'TC', 'Phước');

  set('5A', 'T5_C_1', 'LS_DL', 'Tuấn');
  set('5A', 'T5_C_2', 'DD', 'Quan');
  set('5A', 'T5_C_3', 'TC_TOAN', 'Phương');

  // --- THỨ SÁU (T6) - ĐIỂM 1 ---
  // S1: TV (all 5 GVCN)
  // S2: Specialists:
  // 1A Phước (TC), 2A Phương (BD_TH), 3A Tâm (MT), 4A Thịnh (GDTC), 5A Tuấn (TOAN? No, S2 5A GDTC Thịnh? Thịnh at 4A!).
  // Let's assign 5 distinct teachers at S2:
  // 1A: Phước (TC)
  // 2A: Phương (BD_TH)
  // 3A: Tâm (MT)
  // 4A: Thịnh (GDTC)
  // 5A: Quan (TC)
  // ALL 5 ARE UNIQUE!
  // S3: TOAN (all 5 GVCN)
  // S4: SHL (all 5 GVCN)
  set('1A', 'T6_S_1', 'TV', 'Chi');
  set('1A', 'T6_S_2', 'TC', 'Phước');
  set('1A', 'T6_S_3', 'TOAN', 'Chi');
  set('1A', 'T6_S_4', 'SHL', 'Chi');

  set('2A', 'T6_S_1', 'TV', 'Trang');
  set('2A', 'T6_S_2', 'BD_TH', 'Phương');
  set('2A', 'T6_S_3', 'TOAN', 'Trang');
  set('2A', 'T6_S_4', 'SHL', 'Trang');

  set('3A', 'T6_S_1', 'TV', 'Dương');
  set('3A', 'T6_S_2', 'MT', 'Tâm');
  set('3A', 'T6_S_3', 'TOAN', 'Dương');
  set('3A', 'T6_S_4', 'SHL', 'Dương');

  set('4A', 'T6_S_1', 'TV', 'Hằng');
  set('4A', 'T6_S_2', 'GDTC', 'Thịnh');
  set('4A', 'T6_S_3', 'TOAN', 'Hằng');
  set('4A', 'T6_S_4', 'SHL', 'Hằng');

  set('5A', 'T6_S_1', 'TV', 'Tuấn');
  set('5A', 'T6_S_2', 'TC', 'Quan');
  set('5A', 'T6_S_3', 'TOAN', 'Tuấn');
  set('5A', 'T6_S_4', 'SHL', 'Tuấn');

  // =========================================================================
  // ĐIỂM 2: 1B, 2B, 3B, 4B, 5B
  //
  // GVCN Quotas:
  // - 1B (Bé Năm TP): 18 (14 morning + 4 afternoon: T3_C 3 + T5_C 1; Off: T2_C, T4_C)
  // - 2B (Chinh): 19 (14 morning + 5 afternoon: T3_C 3 + T5_C 2; Off: T2_C, T4_C)
  // - 3B (Đạt): 19 (14 morning + 5 afternoon: T2_C 2 + T4_C 3; Off: T3_C, T5_C)
  // - 4B (Yến): 19 (14 morning + 5 afternoon: T2_C 2 + T4_C 3; Off: T3_C, T5_C)
  // - 5B (Huế): 19 (14 morning + 5 afternoon: T2_C 2 + T4_C 3; Off: T3_C, T5_C)
  //
  // Specialists available at Điểm 2:
  // - Sáng: Phương (TH), Thy (AN/MT), Nhàn (TC)
  // - Chiều: Nương (TA), Thịnh (GDTC), Nhàn (TC, HDTN), Thy (AN/MT)
  // =========================================================================

  // --- THỨ HAI (T2) - ĐIỂM 2 ---
  // Sáng: S1 SHDC (all 5 GVCN)
  set('1B', 'T2_S_1', 'SHDC', 'Bé Năm');
  set('2B', 'T2_S_1', 'SHDC', 'Chinh');
  set('3B', 'T2_S_1', 'SHDC', 'Đạt');
  set('4B', 'T2_S_1', 'SHDC', 'Yến');
  set('5B', 'T2_S_1', 'SHDC', 'Huế');

  // S2..S4:
  // Thy (AN/MT): S2 1B (MT), S3 2B (AN)
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
  // Teachers at Điểm 2: Nương (TA), Thịnh (GDTC), Nhàn (TC, HDTN), Thy (AN, MT).
  // C1: 1B Thịnh, 2B Nhàn, 3B Nương, 4B Thy, 5B Huế -> UNIQUE
  // C2: 1B Nhàn, 2B Thịnh, 3B Thy, 4B Nương, 5B Huế -> UNIQUE
  // C3: 1B Thy, 2B Nhàn, 3B Đạt, 4B Yến, 5B Nương -> UNIQUE
  set('1B', 'T2_C_1', 'GDTC', 'Thịnh');
  set('1B', 'T2_C_2', 'HDTN_CD', 'Nhàn');
  set('1B', 'T2_C_3', 'TC', 'Thy');

  set('2B', 'T2_C_1', 'TC', 'Nhàn');
  set('2B', 'T2_C_2', 'GDTC', 'Thịnh');
  set('2B', 'T2_C_3', 'HDTN_CD', 'Nhàn');

  set('3B', 'T2_C_1', 'TA', 'Nương');
  set('3B', 'T2_C_2', 'TV', 'Thy');
  set('3B', 'T2_C_3', 'TV', 'Đạt');

  set('4B', 'T2_C_1', 'TV', 'Thy');
  set('4B', 'T2_C_2', 'TA', 'Nương');
  set('4B', 'T2_C_3', 'TV', 'Yến');

  set('5B', 'T2_C_1', 'TV', 'Huế');
  set('5B', 'T2_C_2', 'TV', 'Huế');
  set('5B', 'T2_C_3', 'TA', 'Nương');

  // --- THỨ BA (T3) - ĐIỂM 2 ---
  // Sáng:
  // Phương (TH): S2 4B, S3 5B, S4 5B (KH)
  // Thy (AN/MT): S2 2B (TV), S3 3B (AN), S4 4B (MT)
  // Nhàn (TC): S4 1B (TNXH)
  set('1B', 'T3_S_1', 'TV', 'Bé Năm');
  set('1B', 'T3_S_2', 'TV', 'Bé Năm');
  set('1B', 'T3_S_3', 'TOAN', 'Bé Năm');
  set('1B', 'T3_S_4', 'TNXH', 'Nhàn');

  set('2B', 'T3_S_1', 'TV', 'Chinh');
  set('2B', 'T3_S_2', 'TV', 'Thy');
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
  set('5B', 'T3_S_4', 'KH', 'Phương');

  // Chiều T3: 3B, 4B, 5B GVCN off!
  // C1: 1B Bé Năm, 2B Chinh, 3B Nương, 4B Thịnh, 5B Nhàn -> UNIQUE
  // C2: 1B Bé Năm, 2B Thy, 3B Nhàn, 4B Nương, 5B Thịnh -> UNIQUE
  // C3: 1B Bé Năm, 2B Chinh, 3B Thịnh, 4B Nhàn, 5B Nương -> UNIQUE
  set('1B', 'T3_C_1', 'TV', 'Bé Năm');
  set('1B', 'T3_C_2', 'TC_TOAN', 'Bé Năm');
  set('1B', 'T3_C_3', 'DD', 'Bé Năm');

  set('2B', 'T3_C_1', 'TV', 'Chinh');
  set('2B', 'T3_C_2', 'TC_TOAN', 'Thy');
  set('2B', 'T3_C_3', 'DD', 'Chinh');

  set('3B', 'T3_C_1', 'TA', 'Nương');
  set('3B', 'T3_C_2', 'HDTN_CD', 'Nhàn');
  set('3B', 'T3_C_3', 'GDTC', 'Thịnh');

  set('4B', 'T3_C_1', 'GDTC', 'Thịnh');
  set('4B', 'T3_C_2', 'TA', 'Nương');
  set('4B', 'T3_C_3', 'HDTN_CD', 'Nhàn');

  set('5B', 'T3_C_1', 'HDTN_CD', 'Nhàn');
  set('5B', 'T3_C_2', 'GDTC', 'Thịnh');
  set('5B', 'T3_C_3', 'TA', 'Nương');

  // --- THỨ TƯ (T4) - ĐIỂM 2 ---
  // Sáng:
  set('1B', 'T4_S_1', 'TV', 'Bé Năm');
  set('1B', 'T4_S_2', 'TV', 'Bé Năm');
  set('1B', 'T4_S_3', 'AN', 'Thy');
  set('1B', 'T4_S_4', 'TOAN', 'Bé Năm');

  set('2B', 'T4_S_1', 'TV', 'Chinh');
  set('2B', 'T4_S_2', 'TC', 'Nhàn');
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
  set('5B', 'T4_S_4', 'LS_DL', 'Nhàn');

  // Chiều T4: 1B & 2B GVCN off!
  // C1: 1B Thịnh, 2B Nhàn, 3B Thy, 4B Yến, 5B Huế -> UNIQUE
  // C2: 1B Nhàn, 2B Thịnh, 3B Đạt, 4B Thy, 5B Huế -> UNIQUE
  // C3: 1B Nhàn, 2B Thy, 3B Đạt, 4B Yến, 5B Thịnh -> UNIQUE
  set('1B', 'T4_C_1', 'GDTC', 'Thịnh');
  set('1B', 'T4_C_2', 'TC', 'Nhàn');
  set('1B', 'T4_C_3', 'TC', 'Nhàn');

  set('2B', 'T4_C_1', 'TC', 'Nhàn');
  set('2B', 'T4_C_2', 'GDTC', 'Thịnh');
  set('2B', 'T4_C_3', 'TC', 'Thy');

  set('3B', 'T4_C_1', 'TV', 'Thy');
  set('3B', 'T4_C_2', 'TC_TV', 'Đạt');
  set('3B', 'T4_C_3', 'TC_TOAN', 'Đạt');

  set('4B', 'T4_C_1', 'TV', 'Yến');
  set('4B', 'T4_C_2', 'LS_DL', 'Thy');
  set('4B', 'T4_C_3', 'TC_TOAN', 'Yến');

  set('5B', 'T4_C_1', 'TV', 'Huế');
  set('5B', 'T4_C_2', 'LS_DL', 'Huế');
  set('5B', 'T4_C_3', 'TC_TOAN', 'Thịnh');

  // --- THỨ NĂM (T5) - ĐIỂM 2 ---
  // Sáng:
  // S2: 1B Nhàn, 2B Thy, 3B Phương, 4B Yến, 5B Huế -> UNIQUE
  set('1B', 'T5_S_1', 'TV', 'Bé Năm');
  set('1B', 'T5_S_2', 'TV', 'Nhàn');
  set('1B', 'T5_S_3', 'TOAN', 'Bé Năm');
  set('1B', 'T5_S_4', 'TC', 'Nhàn');

  set('2B', 'T5_S_1', 'TV', 'Chinh');
  set('2B', 'T5_S_2', 'TV', 'Thy');
  set('2B', 'T5_S_3', 'TOAN', 'Chinh');
  set('2B', 'T5_S_4', 'TC_TOAN', 'Chinh');

  set('3B', 'T5_S_1', 'TV', 'Đạt');
  set('3B', 'T5_S_2', 'TH', 'Phương');
  set('3B', 'T5_S_3', 'TOAN', 'Đạt');
  set('3B', 'T5_S_4', 'TC', 'Phương');

  set('4B', 'T5_S_1', 'TV', 'Yến');
  set('4B', 'T5_S_2', 'KH', 'Yến');
  set('4B', 'T5_S_3', 'AN', 'Thy');
  set('4B', 'T5_S_4', 'TOAN', 'Yến');

  set('5B', 'T5_S_1', 'TV', 'Huế');
  set('5B', 'T5_S_2', 'TOAN', 'Huế');
  set('5B', 'T5_S_3', 'TH', 'Phương');
  set('5B', 'T5_S_4', 'AN', 'Thy');

  // Chiều T5: 3B, 4B, 5B GVCN off!
  // 1B: Bé Năm target 18. Morning = 14. T3_C = 3. T5_C = 1! (C1 Bé Năm, C2 Nhàn, C3 Thy)
  // 2B: Chinh target 19. Morning = 15. T3_C = 3. T5_C = 1! (Wait, 15 + 3 + 1 = 19!)
  // In 2B: C1 Chinh, C2 Chinh (TNXH), C3 Thy (TC_TV)? Wait, if morning is 14 (S1, S2, S3, S4 Chinh = 4? No, S1 TV, S2 TV, S3 TOAN, S4 TC_TOAN = 4!), then T5_C teaches 2 -> 19!
  // Let's verify afternoon T5 for 3B, 4B, 5B:
  // Specialists: Nương (TA), Thịnh (GDTC), Nhàn (TC), Thy (TC).
  // C1: 1B Bé Năm, 2B Chinh, 3B Nương (TA), 4B Thịnh (GDTC), 5B Nhàn (TC) -> ALL UNIQUE!
  // C2: 1B Nhàn (TNXH), 2B Chinh, 3B Thịnh (GDTC), 4B Nương (TA), 5B Thy (TC) -> ALL UNIQUE!
  // C3: 1B Thy (TC_TV), 2B Nhàn (TC_TV), 3B Nhàn (Wait: 1B Thy, 2B Nhàn? Then 3B, 4B, 5B: 3B Thy? No, 3B TC Nhàn! Let's check below!)
  // At C3:
  // 1B: Thy (TC_TV)
  // 2B: Chinh (TNXH)
  // 3B: Thịnh (GDTC? Thịnh at C2. 3B can be TC Nhàn)
  // 4B: Thịnh (GDTC)
  // 5B: Nương (TA)
  // Let's check: 1B Thy, 2B Chinh, 3B Nhàn, 4B Thịnh, 5B Nương -> ALL 5 ARE UNIQUE!
  set('1B', 'T5_C_1', 'TV', 'Bé Năm');
  set('1B', 'T5_C_2', 'TNXH', 'Nhàn');
  set('1B', 'T5_C_3', 'TC_TV', 'Thy');

  set('2B', 'T5_C_1', 'TV', 'Chinh');
  set('2B', 'T5_C_2', 'TC_TV', 'Chinh');
  set('2B', 'T5_C_3', 'TNXH', 'Chinh');

  set('3B', 'T5_C_1', 'TA', 'Nương');
  set('3B', 'T5_C_2', 'GDTC', 'Thịnh');
  set('3B', 'T5_C_3', 'TC', 'Nhàn');

  set('4B', 'T5_C_1', 'TC', 'Nhàn');
  set('4B', 'T5_C_2', 'TA', 'Nương');
  set('4B', 'T5_C_3', 'GDTC', 'Thịnh');

  set('5B', 'T5_C_1', 'GDTC', 'Thịnh');
  set('5B', 'T5_C_2', 'TC', 'Thy');
  set('5B', 'T5_C_3', 'TA', 'Nương');

  // --- THỨ SÁU (T6) - ĐIỂM 2 ---
  // S1: TV (all 5 GVCN)
  // S2: Specialists / GVCN:
  // 1B: Nhàn (TC)
  // 2B: Thy (BD_NT)
  // 3B: Đạt (DD)
  // 4B: Yến (LS_DL)
  // 5B: Huế (DD)
  // ALL 5 ARE UNIQUE!
  // S3: TOAN (all 5 GVCN)
  // S4: SHL (all 5 GVCN)
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
  set('5B', 'T6_S_2', 'DD', 'Huế');
  set('5B', 'T6_S_3', 'TOAN', 'Huế');
  set('5B', 'T6_S_4', 'SHL', 'Huế');

  return sched;
}

const sched = generateExactSchedule();
const violations = auditSchedule(sched);
console.log('AUDIT VIOLATIONS COUNT:', violations.length);
for (const v of violations) {
  console.log(`[${v.code}] ${v.title} :: ${v.description}`);
}
