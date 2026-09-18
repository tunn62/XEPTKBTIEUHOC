import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP, DEFAULT_GVCN_POLICIES } from '../src/data/initialData';
import { auditSchedule, isDiem1 } from '../src/solver/cspSolver';
import { BlueprintSlot } from '../src/solver/scheduleBlueprint';
import * as fs from 'fs';

type ScheduleMap = Record<string, Record<string, BlueprintSlot>>;

// Let's build the complete 10-class schedule using the campus-separated model
function buildZeroConflictSchedule(): ScheduleMap {
  const sched: ScheduleMap = {};
  for (const c of ALL_CLASSES) sched[c.id] = {};

  // Helper to set slot
  const set = (cId: string, slotId: string, sub: string, teacher: string, notes?: string) => {
    sched[cId][slotId] = { subjectCode: sub, teacherName: teacher, notes };
  };

  // ==========================================
  // 1A: GVCN Chi (19 periods, off T3 & T5 afternoons)
  // ==========================================
  // T2: S1 SHDC(Chi), S2 TV(Chi), S3 GDTC(Thịnh), S4 TOAN(Chi)
  //     C1 TV(Chi), C2 TC_TV(Chi), C3 TC(Phước)
  set('1A', 'T2_S_1', 'SHDC', 'Chi');
  set('1A', 'T2_S_2', 'TV', 'Chi');
  set('1A', 'T2_S_3', 'GDTC', 'Thịnh');
  set('1A', 'T2_S_4', 'TOAN', 'Chi');
  set('1A', 'T2_C_1', 'TV', 'Chi');
  set('1A', 'T2_C_2', 'TC_TV', 'Chi');
  set('1A', 'T2_C_3', 'TC', 'Phước');

  // T3: S1 TV(Chi), S2 TV(Chi), S3 TOAN(Chi), S4 MT(Tâm)
  //     C1 AN(Tâm), C2 TC(Phước), C3 TC(Phước) -> Chi OFF T3_C
  set('1A', 'T3_S_1', 'TV', 'Chi');
  set('1A', 'T3_S_2', 'TV', 'Chi');
  set('1A', 'T3_S_3', 'TOAN', 'Chi');
  set('1A', 'T3_S_4', 'MT', 'Tâm');
  set('1A', 'T3_C_1', 'AN', 'Tâm');
  set('1A', 'T3_C_2', 'TC', 'Phước');
  set('1A', 'T3_C_3', 'TC', 'Phước');

  // T4: S1 TV(Chi), S2 GDTC(Thịnh), S3 TOAN(Chi), S4 TNXH(Chi)
  //     C1 TV(Chi), C2 TC_TOAN(Chi), C3 HDTN_CD(Phước)
  set('1A', 'T4_S_1', 'TV', 'Chi');
  set('1A', 'T4_S_2', 'GDTC', 'Thịnh');
  set('1A', 'T4_S_3', 'TOAN', 'Chi');
  set('1A', 'T4_S_4', 'TNXH', 'Chi');
  set('1A', 'T4_C_1', 'TV', 'Chi');
  set('1A', 'T4_C_2', 'TC_TOAN', 'Chi');
  set('1A', 'T4_C_3', 'HDTN_CD', 'Phước');

  // T5: S1 TV(Chi), S2 TNXH(Chi), S3 TOAN(Chi), S4 DD(Chi)
  //     C1 TC(Phước), C2 BD_TH(Phương), C3 TC(Phước) -> Chi OFF T5_C
  set('1A', 'T5_S_1', 'TV', 'Chi');
  set('1A', 'T5_S_2', 'TNXH', 'Chi');
  set('1A', 'T5_S_3', 'TOAN', 'Chi');
  set('1A', 'T5_S_4', 'DD', 'Chi');
  set('1A', 'T5_C_1', 'TC', 'Phước');
  set('1A', 'T5_C_2', 'BD_TH', 'Phương');
  set('1A', 'T5_C_3', 'TC', 'Phước');

  // T6: S1 TV(Chi), S2 BD_TH(Phương), S3 BD_NT(Tâm), S4 SHL(Chi)
  set('1A', 'T6_S_1', 'TV', 'Chi');
  set('1A', 'T6_S_2', 'BD_TH', 'Phương');
  set('1A', 'T6_S_3', 'BD_NT', 'Tâm');
  set('1A', 'T6_S_4', 'SHL', 'Chi');

  // ==========================================
  // 2A: GVCN Trang (17 periods, off T3 & T5 afternoons)
  // ==========================================
  // T2: S1 SHDC(Trang), S2 TV(Trang), S3 TOAN(Trang), S4 GDTC(Thịnh)
  //     C1 TV(Trang), C2 TV(Trang), C3 TC_TOAN(Phước)
  set('2A', 'T2_S_1', 'SHDC', 'Trang');
  set('2A', 'T2_S_2', 'TV', 'Trang');
  set('2A', 'T2_S_3', 'TOAN', 'Trang');
  set('2A', 'T2_S_4', 'GDTC', 'Thịnh');
  set('2A', 'T2_C_1', 'TV', 'Trang');
  set('2A', 'T2_C_2', 'TV', 'Trang');
  set('2A', 'T2_C_3', 'TC_TOAN', 'Phước');

  // T3: S1 TV(Trang), S2 TV(Trang), S3 TOAN(Trang), S4 AN(Tâm)
  //     C1 MT(Tâm), C2 TC(Phước), C3 TC(Phước) -> Trang OFF T3_C
  set('2A', 'T3_S_1', 'TV', 'Trang');
  set('2A', 'T3_S_2', 'TV', 'Trang');
  set('2A', 'T3_S_3', 'TOAN', 'Trang');
  set('2A', 'T3_S_4', 'AN', 'Tâm');
  set('2A', 'T3_C_1', 'MT', 'Tâm');
  set('2A', 'T3_C_2', 'TC', 'Phước');
  set('2A', 'T3_C_3', 'TC', 'Phước');

  // T4: S1 TV(Trang), S2 TOAN(Trang), S3 GDTC(Thịnh), S4 TNXH(Trang)
  //     C1 DD(Trang), C2 TC_TV(Phước), C3 HDTN_CD(Phước)
  set('2A', 'T4_S_1', 'TV', 'Trang');
  set('2A', 'T4_S_2', 'TOAN', 'Trang');
  set('2A', 'T4_S_3', 'GDTC', 'Thịnh');
  set('2A', 'T4_S_4', 'TNXH', 'Trang');
  set('2A', 'T4_C_1', 'DD', 'Trang');
  set('2A', 'T4_C_2', 'TC_TV', 'Phước');
  set('2A', 'T4_C_3', 'HDTN_CD', 'Phước');

  // T5: S1 TV(Trang), S2 TNXH(Trang), S3 TOAN(Trang), S4 TC(Phước)
  //     C1 BD_TH(Phương), C2 TC(Phước), C3 TC(Phước) -> Trang OFF T5_C
  set('2A', 'T5_S_1', 'TV', 'Trang');
  set('2A', 'T5_S_2', 'TNXH', 'Trang');
  set('2A', 'T5_S_3', 'TOAN', 'Trang');
  set('2A', 'T5_S_4', 'TC', 'Phước');
  set('2A', 'T5_C_1', 'BD_TH', 'Phương');
  set('2A', 'T5_C_2', 'TC', 'Phước');
  set('2A', 'T5_C_3', 'TC', 'Phước');

  // T6: S1 TV(Trang), S2 BD_NT(Tâm), S3 BD_TH(Phương), S4 SHL(Trang)
  set('2A', 'T6_S_1', 'TV', 'Trang');
  set('2A', 'T6_S_2', 'BD_NT', 'Tâm');
  set('2A', 'T6_S_3', 'BD_TH', 'Phương');
  set('2A', 'T6_S_4', 'SHL', 'Trang');

  // ==========================================
  // 3A: GVCN Dương (19 periods, off T2 & T4 afternoons)
  // ==========================================
  // T2: S1 SHDC(Dương), S2 TV(Dương), S3 TA(Nương), S4 TOAN(Dương)
  //     C1 TH(Phương), C2 TC(Phước), C3 HDTN_CD(Phước) -> Dương OFF T2_C
  set('3A', 'T2_S_1', 'SHDC', 'Dương');
  set('3A', 'T2_S_2', 'TV', 'Dương');
  set('3A', 'T2_S_3', 'TA', 'Nương');
  set('3A', 'T2_S_4', 'TOAN', 'Dương');
  set('3A', 'T2_C_1', 'TH', 'Phương');
  set('3A', 'T2_C_2', 'TC', 'Phước');
  set('3A', 'T2_C_3', 'HDTN_CD', 'Phước');

  // T3: S1 TV(Dương), S2 TA(Nương), S3 TOAN(Dương), S4 TNXH(Dương)
  //     C1 TV(Dương), C2 TC_TV(Dương), C3 AN(Tâm)
  set('3A', 'T3_S_1', 'TV', 'Dương');
  set('3A', 'T3_S_2', 'TA', 'Nương');
  set('3A', 'T3_S_3', 'TOAN', 'Dương');
  set('3A', 'T3_S_4', 'TNXH', 'Dương');
  set('3A', 'T3_C_1', 'TV', 'Dương');
  set('3A', 'T3_C_2', 'TC_TV', 'Dương');
  set('3A', 'T3_C_3', 'AN', 'Tâm');

  // T4: S1 TV(Dương), S2 TV(Dương), S3 TOAN(Dương), S4 TA(Nương) (Pair 1-2!)
  //     C1 TH(Phương), C2 TC(Phước), C3 TC(Phước) -> Dương OFF T4_C
  set('3A', 'T4_S_1', 'TV', 'Dương');
  set('3A', 'T4_S_2', 'TV', 'Dương');
  set('3A', 'T4_S_3', 'TOAN', 'Dương');
  set('3A', 'T4_S_4', 'TA', 'Nương');
  set('3A', 'T4_C_1', 'TH', 'Phương');
  set('3A', 'T4_C_2', 'TC', 'Phước');
  set('3A', 'T4_C_3', 'TC', 'Phước');

  // T5: S1 TV(Dương), S2 TA(Nương), S3 GDTC(Thịnh), S4 TOAN(Dương)
  //     C1 DD(Dương), C2 TNXH(Dương), C3 TC_TOAN(Dương)
  set('3A', 'T5_S_1', 'TV', 'Dương');
  set('3A', 'T5_S_2', 'TA', 'Nương');
  set('3A', 'T5_S_3', 'GDTC', 'Thịnh');
  set('3A', 'T5_S_4', 'TOAN', 'Dương');
  set('3A', 'T5_C_1', 'DD', 'Dương');
  set('3A', 'T5_C_2', 'TNXH', 'Dương');
  set('3A', 'T5_C_3', 'TC_TOAN', 'Dương');

  // T6: S1 TV(Dương), S2 GDTC(Thịnh), S3 MT(Tâm), S4 SHL(Dương)
  set('3A', 'T6_S_1', 'TV', 'Dương');
  set('3A', 'T6_S_2', 'GDTC', 'Thịnh');
  set('3A', 'T6_S_3', 'MT', 'Tâm');
  set('3A', 'T6_S_4', 'SHL', 'Dương');

  // ==========================================
  // 4A: GVCN Hằng (19 periods, off T2 & T4 afternoons)
  // ==========================================
  // T2: S1 SHDC(Hằng), S2 TV(Hằng), S3 TOAN(Hằng), S4 TA(Nương)
  //     C1 TH(Phương), C2 TC(Phước), C3 HDTN_CD(Phước) -> Hằng OFF T2_C
  set('4A', 'T2_S_1', 'SHDC', 'Hằng');
  set('4A', 'T2_S_2', 'TV', 'Hằng');
  set('4A', 'T2_S_3', 'TOAN', 'Hằng');
  set('4A', 'T2_S_4', 'TA', 'Nương');
  set('4A', 'T2_C_1', 'TH', 'Phương');
  set('4A', 'T2_C_2', 'TC', 'Phước');
  set('4A', 'T2_C_3', 'HDTN_CD', 'Phước');

  // T3: S1 TV(Hằng), S2 TOAN(Hằng), S3 TA(Nương), S4 KH(Hằng)
  //     C1 TV(Hằng), C2 LS_DL(Hằng), C3 AN(Tâm)
  set('4A', 'T3_S_1', 'TV', 'Hằng');
  set('4A', 'T3_S_2', 'TOAN', 'Hằng');
  set('4A', 'T3_S_3', 'TA', 'Nương');
  set('4A', 'T3_S_4', 'KH', 'Hằng');
  set('4A', 'T3_C_1', 'TV', 'Hằng');
  set('4A', 'T3_C_2', 'LS_DL', 'Hằng');
  set('4A', 'T3_C_3', 'AN', 'Tâm');

  // T4: S1 TV(Hằng), S2 TV(Hằng), S3 TA(Nương), S4 TOAN(Hằng) (Pair 1-2!)
  //     C1 TH(Phương), C2 TC(Quan), C3 TC(Phước) -> Hằng OFF T4_C
  set('4A', 'T4_S_1', 'TV', 'Hằng');
  set('4A', 'T4_S_2', 'TV', 'Hằng');
  set('4A', 'T4_S_3', 'TA', 'Nương');
  set('4A', 'T4_S_4', 'TOAN', 'Hằng');
  set('4A', 'T4_C_1', 'TH', 'Phương');
  set('4A', 'T4_C_2', 'TC', 'Quan');
  set('4A', 'T4_C_3', 'TC', 'Phước');

  // T5: S1 TV(Hằng), S2 TOAN(Hằng), S3 TA(Nương), S4 GDTC(Thịnh)
  //     C1 KH(Hằng), C2 LS_DL(Hằng), C3 DD(Hằng)
  set('4A', 'T5_S_1', 'TV', 'Hằng');
  set('4A', 'T5_S_2', 'TOAN', 'Hằng');
  set('4A', 'T5_S_3', 'TA', 'Nương');
  set('4A', 'T5_S_4', 'GDTC', 'Thịnh');
  set('4A', 'T5_C_1', 'KH', 'Hằng');
  set('4A', 'T5_C_2', 'LS_DL', 'Hằng');
  set('4A', 'T5_C_3', 'DD', 'Hằng');

  // T6: S1 TV(Hằng), S2 GDTC(Thịnh), S3 MT(Tâm), S4 SHL(Hằng)
  set('4A', 'T6_S_1', 'TV', 'Hằng');
  set('4A', 'T6_S_2', 'GDTC', 'Thịnh');
  set('4A', 'T6_S_3', 'MT', 'Tâm');
  set('4A', 'T6_S_4', 'SHL', 'Hằng');

  // ==========================================
  // 5A: GVCN Tuấn (19 periods, off T2 & T4 afternoons)
  // ==========================================
  // T2: S1 SHDC(Tuấn), S2 TA(Nương), S3 TOAN(Tuấn), S4 TV(Tuấn)
  //     C1 TH(Phương), C2 TC(Phước), C3 HDTN_CD(Phước) -> Tuấn OFF T2_C
  set('5A', 'T2_S_1', 'SHDC', 'Tuấn');
  set('5A', 'T2_S_2', 'TA', 'Nương');
  set('5A', 'T2_S_3', 'TOAN', 'Tuấn');
  set('5A', 'T2_S_4', 'TV', 'Tuấn');
  set('5A', 'T2_C_1', 'TH', 'Phương');
  set('5A', 'T2_C_2', 'TC', 'Phước');
  set('5A', 'T2_C_3', 'HDTN_CD', 'Phước');

  // T3: S1 TV(Tuấn), S2 TOAN(Tuấn), S3 GDTC(Thịnh), S4 TA(Nương)
  //     C1 TV(Tuấn), C2 LS_DL(Tuấn), C3 TC_TOAN(Tuấn)
  set('5A', 'T3_S_1', 'TV', 'Tuấn');
  set('5A', 'T3_S_2', 'TOAN', 'Tuấn');
  set('5A', 'T3_S_3', 'GDTC', 'Thịnh');
  set('5A', 'T3_S_4', 'TA', 'Nương');
  set('5A', 'T3_C_1', 'TV', 'Tuấn');
  set('5A', 'T3_C_2', 'LS_DL', 'Tuấn');
  set('5A', 'T3_C_3', 'TC_TOAN', 'Tuấn');

  // T4: S1 TV(Tuấn), S2 TV(Tuấn), S3 TOAN(Tuấn), S4 TA(Nương) (Pair 1-2!)
  //     C1 TH(Phương), C2 TC(Phước), C3 TC(Phước) -> Tuấn OFF T4_C
  set('5A', 'T4_S_1', 'TV', 'Tuấn');
  set('5A', 'T4_S_2', 'TV', 'Tuấn');
  set('5A', 'T4_S_3', 'TOAN', 'Tuấn');
  set('5A', 'T4_S_4', 'TA', 'Nương');
  set('5A', 'T4_C_1', 'TH', 'Phương');
  set('5A', 'T4_C_2', 'TC', 'Phước');
  set('5A', 'T4_C_3', 'TC', 'Phước');

  // T5: S1 TV(Tuấn), S2 TOAN(Tuấn), S3 KH(Tuấn), S4 TA(Nương)
  //     C1 KH(Tuấn), C2 LS_DL(Tuấn), C3 DD(Tuấn)
  set('5A', 'T5_S_1', 'TV', 'Tuấn');
  set('5A', 'T5_S_2', 'TOAN', 'Tuấn');
  set('5A', 'T5_S_3', 'KH', 'Tuấn');
  set('5A', 'T5_S_4', 'TA', 'Nương');
  set('5A', 'T5_C_1', 'KH', 'Tuấn');
  set('5A', 'T5_C_2', 'LS_DL', 'Tuấn');
  set('5A', 'T5_C_3', 'DD', 'Tuấn');

  // T6: S1 TV(Tuấn), S2 GDTC(Thịnh), S3 AN(Tâm), S4 SHL(Tuấn)
  set('5A', 'T6_S_1', 'TV', 'Tuấn');
  set('5A', 'T6_S_2', 'GDTC', 'Thịnh');
  set('5A', 'T6_S_3', 'AN', 'Tâm');
  set('5A', 'T6_S_4', 'SHL', 'Tuấn');

  // ==========================================
  // 1B: GVCN Bé Năm (18 periods, off T2 & T4 afternoons)
  // ==========================================
  // T2: S1 SHDC(Bé Năm), S2 TV(Bé Năm), S3 TOAN(Bé Năm), S4 MT(Thy)
  //     C1 TC(Nhàn), C2 GDTC(Thịnh), C3 HDTN_CD(Nhàn) -> Bé Năm OFF T2_C
  set('1B', 'T2_S_1', 'SHDC', 'Bé Năm');
  set('1B', 'T2_S_2', 'TV', 'Bé Năm');
  set('1B', 'T2_S_3', 'TOAN', 'Bé Năm');
  set('1B', 'T2_S_4', 'MT', 'Thy');
  set('1B', 'T2_C_1', 'TC', 'Nhàn');
  set('1B', 'T2_C_2', 'GDTC', 'Thịnh');
  set('1B', 'T2_C_3', 'HDTN_CD', 'Nhàn');

  // T3: S1 TV(Bé Năm), S2 TV(Bé Năm), S3 TOAN(Bé Năm), S4 AN(Thy)
  //     C1 TV(Bé Năm), C2 TC_TOAN(Bé Năm), C3 DD(Bé Năm)
  set('1B', 'T3_S_1', 'TV', 'Bé Năm');
  set('1B', 'T3_S_2', 'TV', 'Bé Năm');
  set('1B', 'T3_S_3', 'TOAN', 'Bé Năm');
  set('1B', 'T3_S_4', 'AN', 'Thy');
  set('1B', 'T3_C_1', 'TV', 'Bé Năm');
  set('1B', 'T3_C_2', 'TC_TOAN', 'Bé Năm');
  set('1B', 'T3_C_3', 'DD', 'Bé Năm');

  // T4: S1 TV(Bé Năm), S2 TV(Bé Năm), S3 TOAN(Bé Năm), S4 TC(Nhàn)
  //     C1 TC(Nhàn), C2 TC(Nhàn), C3 GDTC(Thịnh) -> Bé Năm OFF T4_C
  set('1B', 'T4_S_1', 'TV', 'Bé Năm');
  set('1B', 'T4_S_2', 'TV', 'Bé Năm');
  set('1B', 'T4_S_3', 'TOAN', 'Bé Năm');
  set('1B', 'T4_S_4', 'TC', 'Nhàn');
  set('1B', 'T4_C_1', 'TC', 'Nhàn');
  set('1B', 'T4_C_2', 'TC', 'Nhàn');
  set('1B', 'T4_C_3', 'GDTC', 'Thịnh');

  // T5: S1 TV(Bé Năm), S2 TNXH(Bé Năm), S3 TOAN(Bé Năm), S4 TC(Nhàn)
  //     C1 TV(Bé Năm), C2 TNXH(Bé Năm), C3 TC_TV(Nhàn) -> Bé Năm teaches 2 afternoon periods, total = 14 + 4 = 18!
  set('1B', 'T5_S_1', 'TV', 'Bé Năm');
  set('1B', 'T5_S_2', 'TNXH', 'Bé Năm');
  set('1B', 'T5_S_3', 'TOAN', 'Bé Năm');
  set('1B', 'T5_S_4', 'TC', 'Nhàn');
  set('1B', 'T5_C_1', 'TV', 'Bé Năm');
  set('1B', 'T5_C_2', 'TNXH', 'Bé Năm');
  set('1B', 'T5_C_3', 'TC_TV', 'Nhàn');

  // T6: S1 TV(Bé Năm), S2 BD_NT(Thy), S3 TC(Nhàn), S4 SHL(Bé Năm)
  set('1B', 'T6_S_1', 'TV', 'Bé Năm');
  set('1B', 'T6_S_2', 'BD_NT', 'Thy');
  set('1B', 'T6_S_3', 'TC', 'Nhàn');
  set('1B', 'T6_S_4', 'SHL', 'Bé Năm');

  // ==========================================
  // 2B: GVCN Chinh (19 periods, off T2 & T4 afternoons)
  // ==========================================
  // T2: S1 SHDC(Chinh), S2 TV(Chinh), S3 TOAN(Chinh), S4 AN(Thy)
  //     C1 TC(Nhàn), C2 GDTC(Thịnh), C3 HDTN_CD(Nhàn) -> Chinh OFF T2_C
  set('2B', 'T2_S_1', 'SHDC', 'Chinh');
  set('2B', 'T2_S_2', 'TV', 'Chinh');
  set('2B', 'T2_S_3', 'TOAN', 'Chinh');
  set('2B', 'T2_S_4', 'AN', 'Thy');
  set('2B', 'T2_C_1', 'TC', 'Nhàn');
  set('2B', 'T2_C_2', 'GDTC', 'Thịnh');
  set('2B', 'T2_C_3', 'HDTN_CD', 'Nhàn');

  // T3: S1 TV(Chinh), S2 TV(Chinh), S3 TOAN(Chinh), S4 MT(Thy)
  //     C1 TV(Chinh), C2 TC_TOAN(Chinh), C3 DD(Chinh)
  set('2B', 'T3_S_1', 'TV', 'Chinh');
  set('2B', 'T3_S_2', 'TV', 'Chinh');
  set('2B', 'T3_S_3', 'TOAN', 'Chinh');
  set('2B', 'T3_S_4', 'MT', 'Thy');
  set('2B', 'T3_C_1', 'TV', 'Chinh');
  set('2B', 'T3_C_2', 'TC_TOAN', 'Chinh');
  set('2B', 'T3_C_3', 'DD', 'Chinh');

  // T4: S1 TV(Chinh), S2 TV(Chinh), S3 TOAN(Chinh), S4 TC(Quan)
  //     C1 TC(Nhàn), C2 TC(Nhàn), C3 GDTC(Thịnh) -> Chinh OFF T4_C
  set('2B', 'T4_S_1', 'TV', 'Chinh');
  set('2B', 'T4_S_2', 'TV', 'Chinh');
  set('2B', 'T4_S_3', 'TOAN', 'Chinh');
  set('2B', 'T4_S_4', 'TC', 'Quan');
  set('2B', 'T4_C_1', 'TC', 'Nhàn');
  set('2B', 'T4_C_2', 'TC', 'Nhàn');
  set('2B', 'T4_C_3', 'GDTC', 'Thịnh');

  // T5: S1 TV(Chinh), S2 TNXH(Chinh), S3 TOAN(Chinh), S4 TC(Thy)
  //     C1 TV(Chinh), C2 TNXH(Chinh), C3 TC_TV(Chinh)
  set('2B', 'T5_S_1', 'TV', 'Chinh');
  set('2B', 'T5_S_2', 'TNXH', 'Chinh');
  set('2B', 'T5_S_3', 'TOAN', 'Chinh');
  set('2B', 'T5_S_4', 'TC', 'Thy');
  set('2B', 'T5_C_1', 'TV', 'Chinh');
  set('2B', 'T5_C_2', 'TNXH', 'Chinh');
  set('2B', 'T5_C_3', 'TC_TV', 'Chinh');

  // T6: S1 TV(Chinh), S2 BD_NT(Thy), S3 TC(Nhàn), S4 SHL(Chinh)
  set('2B', 'T6_S_1', 'TV', 'Chinh');
  set('2B', 'T6_S_2', 'BD_NT', 'Thy');
  set('2B', 'T6_S_3', 'TC', 'Nhàn');
  set('2B', 'T6_S_4', 'SHL', 'Chinh');

  // ==========================================
  // 3B: GVCN Đạt (19 periods, off T3 & T5 afternoons)
  // ==========================================
  // T2: S1 SHDC(Đạt), S2 TV(Đạt), S3 TOAN(Đạt), S4 TH(Phương)
  //     C1 TA(Nương), C2 TC(Nhàn), C3 HDTN_CD(Thy)
  set('3B', 'T2_S_1', 'SHDC', 'Đạt');
  set('3B', 'T2_S_2', 'TV', 'Đạt');
  set('3B', 'T2_S_3', 'TOAN', 'Đạt');
  set('3B', 'T2_S_4', 'TH', 'Phương');
  set('3B', 'T2_C_1', 'TA', 'Nương');
  set('3B', 'T2_C_2', 'TC', 'Nhàn');
  set('3B', 'T2_C_3', 'HDTN_CD', 'Thy');

  // T3: S1 TV(Đạt), S2 TNXH(Đạt), S3 TOAN(Đạt), S4 AN(Thy)
  //     C1 TA(Nương), C2 GDTC(Thịnh), C3 TC(Nhàn) -> Đạt OFF T3_C
  set('3B', 'T3_S_1', 'TV', 'Đạt');
  set('3B', 'T3_S_2', 'TNXH', 'Đạt');
  set('3B', 'T3_S_3', 'TOAN', 'Đạt');
  set('3B', 'T3_S_4', 'AN', 'Thy');
  set('3B', 'T3_C_1', 'TA', 'Nương');
  set('3B', 'T3_C_2', 'GDTC', 'Thịnh');
  set('3B', 'T3_C_3', 'TC', 'Nhàn');

  // T4: S1 TV(Đạt), S2 TV(Đạt), S3 TOAN(Đạt), S4 TH(Phương) (Pair 1-2!)
  //     C1 TV(Đạt), C2 TC_TV(Đạt), C3 TC_TOAN(Đạt)
  set('3B', 'T4_S_1', 'TV', 'Đạt');
  set('3B', 'T4_S_2', 'TV', 'Đạt');
  set('3B', 'T4_S_3', 'TOAN', 'Đạt');
  set('3B', 'T4_S_4', 'TH', 'Phương');
  set('3B', 'T4_C_1', 'TV', 'Đạt');
  set('3B', 'T4_C_2', 'TC_TV', 'Đạt');
  set('3B', 'T4_C_3', 'TC_TOAN', 'Đạt');

  // T5: S1 TV(Đạt), S2 TNXH(Đạt), S3 TOAN(Đạt), S4 MT(Thy)
  //     C1 TA(Nương), C2 GDTC(Thịnh), C3 TC(Nhàn) -> Đạt OFF T5_C
  set('3B', 'T5_S_1', 'TV', 'Đạt');
  set('3B', 'T5_S_2', 'TNXH', 'Đạt');
  set('3B', 'T5_S_3', 'TOAN', 'Đạt');
  set('3B', 'T5_S_4', 'MT', 'Thy');
  set('3B', 'T5_C_1', 'TA', 'Nương');
  set('3B', 'T5_C_2', 'GDTC', 'Thịnh');
  set('3B', 'T5_C_3', 'TC', 'Nhàn');

  // T6: S1 TV(Đạt), S2 DD(Đạt), S3 TC(Nhàn), S4 SHL(Đạt)
  set('3B', 'T6_S_1', 'TV', 'Đạt');
  set('3B', 'T6_S_2', 'DD', 'Đạt');
  set('3B', 'T6_S_3', 'TC', 'Nhàn');
  set('3B', 'T6_S_4', 'SHL', 'Đạt');

  // ==========================================
  // 4B: GVCN Yến (19 periods, off T3 & T5 afternoons)
  // ==========================================
  // T2: S1 SHDC(Yến), S2 TV(Yến), S3 TOAN(Yến), S4 TH(Phương)
  //     C1 TC(Nhàn), C2 TA(Nương), C3 HDTN_CD(Thy)
  set('4B', 'T2_S_1', 'SHDC', 'Yến');
  set('4B', 'T2_S_2', 'TV', 'Yến');
  set('4B', 'T2_S_3', 'TOAN', 'Yến');
  set('4B', 'T2_S_4', 'TH', 'Phương');
  set('4B', 'T2_C_1', 'TC', 'Nhàn');
  set('4B', 'T2_C_2', 'TA', 'Nương');
  set('4B', 'T2_C_3', 'HDTN_CD', 'Thy');

  // T3: S1 TV(Yến), S2 KH(Yến), S3 TOAN(Yến), S4 MT(Thy)
  //     C1 TC(Nhàn), C2 TA(Nương), C3 GDTC(Thịnh) -> Yến OFF T3_C
  set('4B', 'T3_S_1', 'TV', 'Yến');
  set('4B', 'T3_S_2', 'KH', 'Yến');
  set('4B', 'T3_S_3', 'TOAN', 'Yến');
  set('4B', 'T3_S_4', 'MT', 'Thy');
  set('4B', 'T3_C_1', 'TC', 'Nhàn');
  set('4B', 'T3_C_2', 'TA', 'Nương');
  set('4B', 'T3_C_3', 'GDTC', 'Thịnh');

  // T4: S1 TV(Yến), S2 TV(Yến), S3 TOAN(Yến), S4 TH(Phương) (Pair 1-2!)
  //     C1 TV(Yến), C2 LS_DL(Yến), C3 TC_TOAN(Yến)
  set('4B', 'T4_S_1', 'TV', 'Yến');
  set('4B', 'T4_S_2', 'TV', 'Yến');
  set('4B', 'T4_S_3', 'TOAN', 'Yến');
  set('4B', 'T4_S_4', 'TH', 'Phương');
  set('4B', 'T4_C_1', 'TV', 'Yến');
  set('4B', 'T4_C_2', 'LS_DL', 'Yến');
  set('4B', 'T4_C_3', 'TC_TOAN', 'Yến');

  // T5: S1 TV(Yến), S2 KH(Yến), S3 TOAN(Yến), S4 AN(Thy)
  //     C1 TC(Nhàn), C2 TA(Nương), C3 GDTC(Thịnh) -> Yến OFF T5_C
  set('4B', 'T5_S_1', 'TV', 'Yến');
  set('4B', 'T5_S_2', 'KH', 'Yến');
  set('4B', 'T5_S_3', 'TOAN', 'Yến');
  set('4B', 'T5_S_4', 'AN', 'Thy');
  set('4B', 'T5_C_1', 'TC', 'Nhàn');
  set('4B', 'T5_C_2', 'TA', 'Nương');
  set('4B', 'T5_C_3', 'GDTC', 'Thịnh');

  // T6: S1 TV(Yến), S2 LS_DL(Yến), S3 DD(Yến), S4 SHL(Yến)
  set('4B', 'T6_S_1', 'TV', 'Yến');
  set('4B', 'T6_S_2', 'LS_DL', 'Yến');
  set('4B', 'T6_S_3', 'DD', 'Yến');
  set('4B', 'T6_S_4', 'SHL', 'Yến');

  // ==========================================
  // 5B: GVCN Huế (19 periods, off T3 & T5 afternoons)
  // ==========================================
  // T2: S1 SHDC(Huế), S2 TV(Huế), S3 TOAN(Huế), S4 TH(Phương)
  //     C1 TC(Nhàn), C2 TC(Nhàn), C3 TA(Nương)
  set('5B', 'T2_S_1', 'SHDC', 'Huế');
  set('5B', 'T2_S_2', 'TV', 'Huế');
  set('5B', 'T2_S_3', 'TOAN', 'Huế');
  set('5B', 'T2_S_4', 'TH', 'Phương');
  set('5B', 'T2_C_1', 'TC', 'Nhàn');
  set('5B', 'T2_C_2', 'TC', 'Nhàn');
  set('5B', 'T2_C_3', 'TA', 'Nương');

  // T3: S1 TV(Huế), S2 KH(Huế), S3 TOAN(Huế), S4 AN(Thy)
  //     C1 HDTN_CD(Nhàn), C2 GDTC(Thịnh), C3 TA(Nương) -> Huế OFF T3_C
  set('5B', 'T3_S_1', 'TV', 'Huế');
  set('5B', 'T3_S_2', 'KH', 'Huế');
  set('5B', 'T3_S_3', 'TOAN', 'Huế');
  set('5B', 'T3_S_4', 'AN', 'Thy');
  set('5B', 'T3_C_1', 'HDTN_CD', 'Nhàn');
  set('5B', 'T3_C_2', 'GDTC', 'Thịnh');
  set('5B', 'T3_C_3', 'TA', 'Nương');

  // T4: S1 TV(Huế), S2 TV(Huế), S3 TOAN(Huế), S4 TH(Phương) (Pair 1-2!)
  //     C1 TV(Huế), C2 LS_DL(Huế), C3 TC_TOAN(Huế)
  set('5B', 'T4_S_1', 'TV', 'Huế');
  set('5B', 'T4_S_2', 'TV', 'Huế');
  set('5B', 'T4_S_3', 'TOAN', 'Huế');
  set('5B', 'T4_S_4', 'TH', 'Phương');
  set('5B', 'T4_C_1', 'TV', 'Huế');
  set('5B', 'T4_C_2', 'LS_DL', 'Huế');
  set('5B', 'T4_C_3', 'TC_TOAN', 'Huế');

  // T5: S1 TV(Huế), S2 KH(Huế), S3 TOAN(Huế), S4 MT(Thy)
  //     C1 TC(Nhàn), C2 GDTC(Thịnh), C3 TA(Nương) -> Huế OFF T5_C
  set('5B', 'T5_S_1', 'TV', 'Huế');
  set('5B', 'T5_S_2', 'KH', 'Huế');
  set('5B', 'T5_S_3', 'TOAN', 'Huế');
  set('5B', 'T5_S_4', 'MT', 'Thy');
  set('5B', 'T5_C_1', 'TC', 'Nhàn');
  set('5B', 'T5_C_2', 'GDTC', 'Thịnh');
  set('5B', 'T5_C_3', 'TA', 'Nương');

  // T6: S1 TV(Huế), S2 LS_DL(Huế), S3 DD(Huế), S4 SHL(Huế)
  set('5B', 'T6_S_1', 'TV', 'Huế');
  set('5B', 'T6_S_2', 'LS_DL', 'Huế');
  set('5B', 'T6_S_3', 'DD', 'Huế');
  set('5B', 'T6_S_4', 'SHL', 'Huế');

  return sched;
}

const schedule = buildZeroConflictSchedule();
const violations = auditSchedule(schedule);
console.log('AUDIT VIOLATIONS COUNT:', violations.length);
for (const v of violations) {
  console.log(`[${v.code}] ${v.title} :: ${v.description}`);
}
