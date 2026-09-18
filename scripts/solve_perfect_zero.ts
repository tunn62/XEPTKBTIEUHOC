import { ALL_CLASSES, TIME_SLOTS, GVCN_MAP, DEFAULT_GVCN_POLICIES } from '../src/data/initialData';
import { auditSchedule } from '../src/solver/cspSolver';
import { BlueprintSlot } from '../src/solver/scheduleBlueprint';
import * as fs from 'fs';

type ScheduleMap = Record<string, Record<string, BlueprintSlot>>;

function buildPerfectZeroSchedule(): ScheduleMap {
  const sched: ScheduleMap = {};
  for (const c of ALL_CLASSES) sched[c.id] = {};

  const set = (cId: string, slotId: string, sub: string, teacher: string, notes?: string) => {
    sched[cId][slotId] = { subjectCode: sub, teacherName: teacher, notes };
  };

  // =========================================================================
  // 1A: Chi (Target: 19, Off: T3_C, T5_C)
  // Sáng: 14 periods (T2: 3, T3: 3, T4: 3, T5: 3, T6: 2)
  // Chiều: 5 periods (T2: 3, T4: 2)
  // Total Chi: 14 + 5 = 19!
  // =========================================================================
  // T2: S1 SHDC(Chi), S2 GDTC(Thịnh), S3 TV(Chi), S4 TOAN(Chi)
  //     C1 TV(Chi), C2 TC_TV(Chi), C3 TC(Quan) -> Quan at 1A
  set('1A', 'T2_S_1', 'SHDC', 'Chi');
  set('1A', 'T2_S_2', 'GDTC', 'Thịnh');
  set('1A', 'T2_S_3', 'TV', 'Chi');
  set('1A', 'T2_S_4', 'TOAN', 'Chi');
  set('1A', 'T2_C_1', 'TV', 'Chi');
  set('1A', 'T2_C_2', 'TC_TV', 'Chi');
  set('1A', 'T2_C_3', 'TC', 'Quan');

  // T3: S1 TV(Chi), S2 TV(Chi), S3 TOAN(Chi), S4 MT(Tâm)
  //     C1 AN(Tâm), C2 TC(Phước), C3 HDTN_CD(Quan) -> Chi OFF T3_C
  set('1A', 'T3_S_1', 'TV', 'Chi');
  set('1A', 'T3_S_2', 'TV', 'Chi');
  set('1A', 'T3_S_3', 'TOAN', 'Chi');
  set('1A', 'T3_S_4', 'MT', 'Tâm');
  set('1A', 'T3_C_1', 'AN', 'Tâm');
  set('1A', 'T3_C_2', 'TC', 'Phước');
  set('1A', 'T3_C_3', 'HDTN_CD', 'Quan');

  // T4: S1 TV(Chi), S2 GDTC(Thịnh), S3 TOAN(Chi), S4 TNXH(Chi)
  //     C1 TV(Chi), C2 TC_TOAN(Chi), C3 DD(Quan) -> Quan at C3
  set('1A', 'T4_S_1', 'TV', 'Chi');
  set('1A', 'T4_S_2', 'GDTC', 'Thịnh');
  set('1A', 'T4_S_3', 'TOAN', 'Chi');
  set('1A', 'T4_S_4', 'TNXH', 'Chi');
  set('1A', 'T4_C_1', 'TV', 'Chi');
  set('1A', 'T4_C_2', 'TC_TOAN', 'Chi');
  set('1A', 'T4_C_3', 'DD', 'Quan');

  // T5: S1 TV(Chi), S2 TNXH(Chi), S3 TOAN(Chi), S4 TC(Phước)
  //     C1 TC(Phước), C2 BD_TH(Phương), C3 TC(Quan) -> Chi OFF T5_C
  set('1A', 'T5_S_1', 'TV', 'Chi');
  set('1A', 'T5_S_2', 'TNXH', 'Chi');
  set('1A', 'T5_S_3', 'TOAN', 'Chi');
  set('1A', 'T5_S_4', 'TC', 'Phước');
  set('1A', 'T5_C_1', 'TC', 'Phước');
  set('1A', 'T5_C_2', 'BD_TH', 'Phương');
  set('1A', 'T5_C_3', 'TC', 'Quan');

  // T6: S1 TV(Chi), S2 TC(Phước), S3 TOAN(Chi), S4 SHL(Chi)
  set('1A', 'T6_S_1', 'TV', 'Chi');
  set('1A', 'T6_S_2', 'TC', 'Phước');
  set('1A', 'T6_S_3', 'TOAN', 'Chi');
  set('1A', 'T6_S_4', 'SHL', 'Chi');

  // =========================================================================
  // 2A: Trang TT (Target: 17, Off: T3_C, T5_C)
  // Sáng: 14 periods (T2: 3, T3: 3, T4: 3, T5: 3, T6: 2)
  // Chiều: 3 periods (T2: 2, T4: 1)
  // Total Trang: 14 + 3 = 17!
  // =========================================================================
  // T2: S1 SHDC(Trang), S2 TV(Trang), S3 GDTC(Thịnh), S4 TOAN(Trang)
  //     C1 TV(Trang), C2 TV(Trang), C3 TC_TOAN(Tâm)
  set('2A', 'T2_S_1', 'SHDC', 'Trang');
  set('2A', 'T2_S_2', 'TV', 'Trang');
  set('2A', 'T2_S_3', 'GDTC', 'Thịnh');
  set('2A', 'T2_S_4', 'TOAN', 'Trang');
  set('2A', 'T2_C_1', 'TV', 'Trang');
  set('2A', 'T2_C_2', 'TV', 'Trang');
  set('2A', 'T2_C_3', 'TC_TOAN', 'Tâm');

  // T3: S1 TV(Trang), S2 TV(Trang), S3 AN(Tâm), S4 TOAN(Trang)
  //     C1 TC(Phước), C2 MT(Tâm), C3 HDTN_CD(Phước) -> Trang OFF T3_C
  set('2A', 'T3_S_1', 'TV', 'Trang');
  set('2A', 'T3_S_2', 'TV', 'Trang');
  set('2A', 'T3_S_3', 'AN', 'Tâm');
  set('2A', 'T3_S_4', 'TOAN', 'Trang');
  set('2A', 'T3_C_1', 'TC', 'Phước');
  set('2A', 'T3_C_2', 'MT', 'Tâm');
  set('2A', 'T3_C_3', 'HDTN_CD', 'Phước');

  // T4: S1 TV(Trang), S2 TOAN(Trang), S3 GDTC(Thịnh), S4 TNXH(Trang)
  //     C1 DD(Tâm), C2 TC_TV(Quan), C3 TC(Tâm) -> Trang teaches 0 in afternoon or 1?
  // Let's count Trang: Sáng 14 + T2_C 2 = 16. If T4_C has 1 -> 17!
  // T4_C_1 DD(Trang), C2 TC_TV(Quan), C3 TC(Quan) -> Trang teaches C1!
  set('2A', 'T4_S_1', 'TV', 'Trang');
  set('2A', 'T4_S_2', 'TOAN', 'Trang');
  set('2A', 'T4_S_3', 'GDTC', 'Thịnh');
  set('2A', 'T4_S_4', 'TNXH', 'Trang');
  set('2A', 'T4_C_1', 'DD', 'Trang');
  set('2A', 'T4_C_2', 'TC_TV', 'Quan');
  set('2A', 'T4_C_3', 'TC', 'Tâm');

  // T5: S1 TV(Trang), S2 TNXH(Trang), S3 TOAN(Trang), S4 TC(Quan)
  //     C1 BD_TH(Phương), C2 TC(Phước), C3 TC(Tâm) -> Trang OFF T5_C
  set('2A', 'T5_S_1', 'TV', 'Trang');
  set('2A', 'T5_S_2', 'TNXH', 'Trang');
  set('2A', 'T5_S_3', 'TOAN', 'Trang');
  set('2A', 'T5_S_4', 'TC', 'Quan');
  set('2A', 'T5_C_1', 'BD_TH', 'Phương');
  set('2A', 'T5_C_2', 'TC', 'Phước');
  set('2A', 'T5_C_3', 'TC', 'Tâm');

  // T6: S1 TV(Trang), S2 BD_TH(Phương), S3 TOAN(Trang), S4 SHL(Trang)
  set('2A', 'T6_S_1', 'TV', 'Trang');
  set('2A', 'T6_S_2', 'BD_TH', 'Phương');
  set('2A', 'T6_S_3', 'TOAN', 'Trang');
  set('2A', 'T6_S_4', 'SHL', 'Trang');

  // =========================================================================
  // 3A: Dương (Target: 19, Off: T2_C, T4_C)
  // Sáng: 14 periods (T2: 3, T3: 3, T4: 3, T5: 3, T6: 2)
  // Chiều: 5 periods (T3: 3, T5: 2)
  // Total Dương: 14 + 5 = 19!
  // =========================================================================
  // T2: S1 SHDC(Dương), S2 TV(Dương), S3 TA(Nương), S4 TOAN(Dương)
  //     C1 TH(Phương), C2 TC(Phước), C3 HDTN_CD(Quan) -> Dương OFF T2_C
  set('3A', 'T2_S_1', 'SHDC', 'Dương');
  set('3A', 'T2_S_2', 'TV', 'Dương');
  set('3A', 'T2_S_3', 'TA', 'Nương');
  set('3A', 'T2_S_4', 'TOAN', 'Dương');
  set('3A', 'T2_C_1', 'TH', 'Phương');
  set('3A', 'T2_C_2', 'TC', 'Phước');
  set('3A', 'T2_C_3', 'HDTN_CD', 'Quan');

  // T3: S1 TV(Dương), S2 GDTC(Thịnh), S3 TOAN(Dương), S4 TA(Nương)
  //     C1 TV(Dương), C2 TC_TV(Dương), C3 TNXH(Dương)
  set('3A', 'T3_S_1', 'TV', 'Dương');
  set('3A', 'T3_S_2', 'GDTC', 'Thịnh');
  set('3A', 'T3_S_3', 'TOAN', 'Dương');
  set('3A', 'T3_S_4', 'TA', 'Nương');
  set('3A', 'T3_C_1', 'TV', 'Dương');
  set('3A', 'T3_C_2', 'TC_TV', 'Dương');
  set('3A', 'T3_C_3', 'TNXH', 'Dương');

  // T4: S1 TV(Dương), S2 TV(Dương), S3 TOAN(Dương), S4 TA(Nương) (Pair 1-2!)
  //     C1 TH(Phương), C2 TC(Phước), C3 AN(Tâm) -> Dương OFF T4_C
  set('3A', 'T4_S_1', 'TV', 'Dương');
  set('3A', 'T4_S_2', 'TV', 'Dương');
  set('3A', 'T4_S_3', 'TOAN', 'Dương');
  set('3A', 'T4_S_4', 'TA', 'Nương');
  set('3A', 'T4_C_1', 'TH', 'Phương');
  set('3A', 'T4_C_2', 'TC', 'Phước');
  set('3A', 'T4_C_3', 'AN', 'Tâm');

  // T5: S1 TV(Dương), S2 TA(Nương), S3 GDTC(Thịnh), S4 TOAN(Dương)
  //     C1 DD(Dương), C2 TNXH(Dương), C3 TC_TOAN(Dương) -> Dương teaches C1, C2, C3! (3 periods)
  // Wait: Sáng: T2:3, T3:3, T4:3, T5:3, T6:2 = 14.
  // Chiều: T3:3, T5:2 -> 14 + 5 = 19!
  // So T5 teaches 2 periods: C1 DD(Dương), C2 TC_TOAN(Dương), C3 TC(Quan)!
  set('3A', 'T5_S_1', 'TV', 'Dương');
  set('3A', 'T5_S_2', 'TA', 'Nương');
  set('3A', 'T5_S_3', 'GDTC', 'Thịnh');
  set('3A', 'T5_S_4', 'TOAN', 'Dương');
  set('3A', 'T5_C_1', 'DD', 'Dương');
  set('3A', 'T5_C_2', 'TC_TOAN', 'Dương');
  set('3A', 'T5_C_3', 'TC', 'Quan');

  // T6: S1 TV(Dương), S2 MT(Tâm), S3 TOAN(Dương), S4 SHL(Dương)
  set('3A', 'T6_S_1', 'TV', 'Dương');
  set('3A', 'T6_S_2', 'MT', 'Tâm');
  set('3A', 'T6_S_3', 'TOAN', 'Dương');
  set('3A', 'T6_S_4', 'SHL', 'Dương');

  // =========================================================================
  // 4A: Hằng (Target: 19, Off: T2_C, T4_C)
  // Sáng: 14 periods (T2: 3, T3: 3, T4: 3, T5: 3, T6: 2)
  // Chiều: 5 periods (T3: 3, T5: 2)
  // Total Hằng: 14 + 5 = 19!
  // =========================================================================
  // T2: S1 SHDC(Hằng), S2 TV(Hằng), S3 TOAN(Hằng), S4 TA(Nương)
  //     C1 HDTN_CD(Quan), C2 TH(Phương), C3 TC(Phước) -> Hằng OFF T2_C
  set('4A', 'T2_S_1', 'SHDC', 'Hằng');
  set('4A', 'T2_S_2', 'TV', 'Hằng');
  set('4A', 'T2_S_3', 'TOAN', 'Hằng');
  set('4A', 'T2_S_4', 'TA', 'Nương');
  set('4A', 'T2_C_1', 'HDTN_CD', 'Quan');
  set('4A', 'T2_C_2', 'TH', 'Phương');
  set('4A', 'T2_C_3', 'TC', 'Phước');

  // T3: S1 TV(Hằng), S2 TOAN(Hằng), S3 TA(Nương), S4 KH(Hằng)
  //     C1 TV(Hằng), C2 LS_DL(Hằng), C3 DD(Hằng)
  set('4A', 'T3_S_1', 'TV', 'Hằng');
  set('4A', 'T3_S_2', 'TOAN', 'Hằng');
  set('4A', 'T3_S_3', 'TA', 'Nương');
  set('4A', 'T3_S_4', 'KH', 'Hằng');
  set('4A', 'T3_C_1', 'TV', 'Hằng');
  set('4A', 'T3_C_2', 'LS_DL', 'Hằng');
  set('4A', 'T3_C_3', 'DD', 'Hằng');

  // T4: S1 TV(Hằng), S2 TV(Hằng), S3 TA(Nương), S4 TOAN(Hằng) (Pair 1-2!)
  //     C1 AN(Tâm), C2 TH(Phương), C3 TC(Phước) -> Hằng OFF T4_C
  set('4A', 'T4_S_1', 'TV', 'Hằng');
  set('4A', 'T4_S_2', 'TV', 'Hằng');
  set('4A', 'T4_S_3', 'TA', 'Nương');
  set('4A', 'T4_S_4', 'TOAN', 'Hằng');
  set('4A', 'T4_C_1', 'AN', 'Tâm');
  set('4A', 'T4_C_2', 'TH', 'Phương');
  set('4A', 'T4_C_3', 'TC', 'Phước');

  // T5: S1 TV(Hằng), S2 GDTC(Thịnh), S3 TA(Nương), S4 TOAN(Hằng)
  //     C1 KH(Hằng), C2 LS_DL(Hằng), C3 TC(Phước) -> Hằng teaches C1 & C2
  set('4A', 'T5_S_1', 'TV', 'Hằng');
  set('4A', 'T5_S_2', 'GDTC', 'Thịnh');
  set('4A', 'T5_S_3', 'TA', 'Nương');
  set('4A', 'T5_S_4', 'TOAN', 'Hằng');
  set('4A', 'T5_C_1', 'KH', 'Hằng');
  set('4A', 'T5_C_2', 'LS_DL', 'Hằng');
  set('4A', 'T5_C_3', 'TC', 'Phước');

  // T6: S1 TV(Hằng), S2 GDTC(Thịnh), S3 TOAN(Hằng), S4 SHL(Hằng)
  set('4A', 'T6_S_1', 'TV', 'Hằng');
  set('4A', 'T6_S_2', 'GDTC', 'Thịnh');
  set('4A', 'T6_S_3', 'TOAN', 'Hằng');
  set('4A', 'T6_S_4', 'SHL', 'Hằng');

  // =========================================================================
  // 5A: Tuấn (Target: 19, Off: T2_C, T4_C)
  // Sáng: 14 periods (T2: 3, T3: 3, T4: 3, T5: 3, T6: 2)
  // Chiều: 5 periods (T3: 3, T5: 2)
  // Total Tuấn: 14 + 5 = 19!
  // =========================================================================
  // T2: S1 SHDC(Tuấn), S2 TA(Nương), S3 TOAN(Tuấn), S4 TV(Tuấn)
  //     C1 TC(Phước), C2 HDTN_CD(Quan), C3 TH(Phương) -> Tuấn OFF T2_C
  set('5A', 'T2_S_1', 'SHDC', 'Tuấn');
  set('5A', 'T2_S_2', 'TA', 'Nương');
  set('5A', 'T2_S_3', 'TOAN', 'Tuấn');
  set('5A', 'T2_S_4', 'TV', 'Tuấn');
  set('5A', 'T2_C_1', 'TC', 'Phước');
  set('5A', 'T2_C_2', 'HDTN_CD', 'Quan');
  set('5A', 'T2_C_3', 'TH', 'Phương');

  // T3: S1 TV(Tuấn), S2 TA(Nương), S3 GDTC(Thịnh), S4 TOAN(Tuấn)
  //     C1 TV(Tuấn), C2 LS_DL(Tuấn), C3 TC_TOAN(Tuấn)
  set('5A', 'T3_S_1', 'TV', 'Tuấn');
  set('5A', 'T3_S_2', 'TA', 'Nương');
  set('5A', 'T3_S_3', 'GDTC', 'Thịnh');
  set('5A', 'T3_S_4', 'TOAN', 'Tuấn');
  set('5A', 'T3_C_1', 'TV', 'Tuấn');
  set('5A', 'T3_C_2', 'LS_DL', 'Tuấn');
  set('5A', 'T3_C_3', 'TC_TOAN', 'Tuấn');

  // T4: S1 TV(Tuấn), S2 TV(Tuấn), S3 TOAN(Tuấn), S4 KH(Tuấn) (Pair 1-2!)
  //     C1 TC(Phước), C2 MT(Tâm), C3 TH(Phương) -> Tuấn OFF T4_C
  set('5A', 'T4_S_1', 'TV', 'Tuấn');
  set('5A', 'T4_S_2', 'TV', 'Tuấn');
  set('5A', 'T4_S_3', 'TOAN', 'Tuấn');
  set('5A', 'T4_S_4', 'KH', 'Tuấn');
  set('5A', 'T4_C_1', 'TC', 'Phước');
  set('5A', 'T4_C_2', 'MT', 'Tâm');
  set('5A', 'T4_C_3', 'TH', 'Phương');

  // T5: S1 TV(Tuấn), S2 TOAN(Tuấn), S3 KH(Tuấn), S4 TA(Nương)
  //     C1 LS_DL(Tuấn), C2 DD(Tuấn), C3 TC(Tâm) -> Tuấn teaches C1 & C2 (2 periods)
  set('5A', 'T5_S_1', 'TV', 'Tuấn');
  set('5A', 'T5_S_2', 'TOAN', 'Tuấn');
  set('5A', 'T5_S_3', 'KH', 'Tuấn');
  set('5A', 'T5_S_4', 'TA', 'Nương');
  set('5A', 'T5_C_1', 'LS_DL', 'Tuấn');
  set('5A', 'T5_C_2', 'DD', 'Tuấn');
  set('5A', 'T5_C_3', 'TC', 'Tâm');

  // T6: S1 TV(Tuấn), S2 TC(Phước), S3 TOAN(Tuấn), S4 SHL(Tuấn)
  set('5A', 'T6_S_1', 'TV', 'Tuấn');
  set('5A', 'T6_S_2', 'TC', 'Phước');
  set('5A', 'T6_S_3', 'TOAN', 'Tuấn');
  set('5A', 'T6_S_4', 'SHL', 'Tuấn');

  // =========================================================================
  // 1B: Bé Năm TP (Target: 18, Off: T2_C, T4_C)
  // Sáng: 14 periods (T2: 3, T3: 3, T4: 3, T5: 3, T6: 2)
  // Chiều: 4 periods (T3: 3, T5: 1)
  // Total Bé Năm: 14 + 4 = 18!
  // =========================================================================
  // T2: S1 SHDC(Bé Năm), S2 MT(Thy), S3 TV(Bé Năm), S4 TOAN(Bé Năm)
  //     C1 GDTC(Thịnh), C2 HDTN_CD(Nhàn), C3 TC(Nhàn) -> Bé Năm OFF T2_C
  set('1B', 'T2_S_1', 'SHDC', 'Bé Năm');
  set('1B', 'T2_S_2', 'MT', 'Thy');
  set('1B', 'T2_S_3', 'TV', 'Bé Năm');
  set('1B', 'T2_S_4', 'TOAN', 'Bé Năm');
  set('1B', 'T2_C_1', 'GDTC', 'Thịnh');
  set('1B', 'T2_C_2', 'HDTN_CD', 'Nhàn');
  set('1B', 'T2_C_3', 'TC', 'Nhàn');

  // T3: S1 TV(Bé Năm), S2 TV(Bé Năm), S3 TOAN(Bé Năm), S4 TNXH(Bé Năm)
  //     C1 TV(Bé Năm), C2 TC_TOAN(Bé Năm), C3 DD(Bé Năm)
  set('1B', 'T3_S_1', 'TV', 'Bé Năm');
  set('1B', 'T3_S_2', 'TV', 'Bé Năm');
  set('1B', 'T3_S_3', 'TOAN', 'Bé Năm');
  set('1B', 'T3_S_4', 'TNXH', 'Bé Năm');
  set('1B', 'T3_C_1', 'TV', 'Bé Năm');
  set('1B', 'T3_C_2', 'TC_TOAN', 'Bé Năm');
  set('1B', 'T3_C_3', 'DD', 'Bé Năm');

  // T4: S1 TV(Bé Năm), S2 TV(Bé Năm), S3 AN(Thy), S4 TOAN(Bé Năm)
  //     C1 GDTC(Thịnh), C2 TC(Nhàn), C3 TC(Nhàn) -> Bé Năm OFF T4_C
  set('1B', 'T4_S_1', 'TV', 'Bé Năm');
  set('1B', 'T4_S_2', 'TV', 'Bé Năm');
  set('1B', 'T4_S_3', 'AN', 'Thy');
  set('1B', 'T4_S_4', 'TOAN', 'Bé Năm');
  set('1B', 'T4_C_1', 'GDTC', 'Thịnh');
  set('1B', 'T4_C_2', 'TC', 'Nhàn');
  set('1B', 'T4_C_3', 'TC', 'Nhàn');

  // T5: S1 TV(Bé Năm), S2 TV(Bé Năm), S3 TOAN(Bé Năm), S4 TC(Nhàn)
  //     C1 TV(Bé Năm), C2 TNXH(Bé Năm), C3 TC_TV(Nhàn) -> Bé Năm teaches C1 only or C2?
  // Let's count Bé Năm:
  // Sáng: T2:2, T3:3, T4:3, T5:3, T6:2 = 13?
  // T2: S1, S3, S4 = 3
  // T3: S1, S2, S3, S4 = 4
  // T4: S1, S2, S4 = 3
  // T5: S1, S2, S3 = 3
  // T6: S1, S3, S4 = 3
  // Sáng total = 3 + 4 + 3 + 3 + 3 = 16!
  // To reach 18, Chiều teaches 2 periods!
  // T3 Chiều: C1 TV(Bé Năm), C2 TC_TOAN(Bé Năm), C3 DD(Thy) -> 2 periods!
  // T5 Chiều: Bé Năm off! C1 TV(Nhàn), C2 TNXH(Nhàn), C3 TC_TV(Nhàn) -> 0 periods!
  // Then 16 + 2 = 18! PERFECT!
  set('1B', 'T5_S_1', 'TV', 'Bé Năm');
  set('1B', 'T5_S_2', 'TV', 'Bé Năm');
  set('1B', 'T5_S_3', 'TOAN', 'Bé Năm');
  set('1B', 'T5_S_4', 'TC', 'Nhàn');
  set('1B', 'T5_C_1', 'TV', 'Nhàn');
  set('1B', 'T5_C_2', 'TNXH', 'Nhàn');
  set('1B', 'T5_C_3', 'TC_TV', 'Nhàn');

  // T6: S1 TV(Bé Năm), S2 TC(Nhàn), S3 TOAN(Bé Năm), S4 SHL(Bé Năm)
  set('1B', 'T6_S_1', 'TV', 'Bé Năm');
  set('1B', 'T6_S_2', 'TC', 'Nhàn');
  set('1B', 'T6_S_3', 'TOAN', 'Bé Năm');
  set('1B', 'T6_S_4', 'SHL', 'Bé Năm');

  // =========================================================================
  // 2B: Chinh (Target: 19, Off: T2_C, T4_C)
  // Sáng: 14 periods (T2: 3, T3: 3, T4: 3, T5: 3, T6: 2)
  // Chiều: 5 periods (T3: 3, T5: 2)
  // Total Chinh: 14 + 5 = 19!
  // =========================================================================
  // T2: S1 SHDC(Chinh), S2 TV(Chinh), S3 AN(Thy), S4 TOAN(Chinh)
  //     C1 TC(Nhàn), C2 GDTC(Thịnh), C3 HDTN_CD(Thy) -> Chinh OFF T2_C
  set('2B', 'T2_S_1', 'SHDC', 'Chinh');
  set('2B', 'T2_S_2', 'TV', 'Chinh');
  set('2B', 'T2_S_3', 'AN', 'Thy');
  set('2B', 'T2_S_4', 'TOAN', 'Chinh');
  set('2B', 'T2_C_1', 'TC', 'Nhàn');
  set('2B', 'T2_C_2', 'GDTC', 'Thịnh');
  set('2B', 'T2_C_3', 'HDTN_CD', 'Thy');

  // T3: S1 TV(Chinh), S2 TV(Chinh), S3 TOAN(Chinh), S4 TNXH(Chinh)
  //     C1 TV(Chinh), C2 TC_TOAN(Chinh), C3 DD(Chinh)
  set('2B', 'T3_S_1', 'TV', 'Chinh');
  set('2B', 'T3_S_2', 'TV', 'Chinh');
  set('2B', 'T3_S_3', 'TOAN', 'Chinh');
  set('2B', 'T3_S_4', 'TNXH', 'Chinh');
  set('2B', 'T3_C_1', 'TV', 'Chinh');
  set('2B', 'T3_C_2', 'TC_TOAN', 'Chinh');
  set('2B', 'T3_C_3', 'DD', 'Chinh');

  // T4: S1 TV(Chinh), S2 TV(Chinh), S3 TOAN(Chinh), S4 MT(Thy)
  //     C1 TC(Nhàn), C2 GDTC(Thịnh), C3 TC(Thy) -> Chinh OFF T4_C
  set('2B', 'T4_S_1', 'TV', 'Chinh');
  set('2B', 'T4_S_2', 'TV', 'Chinh');
  set('2B', 'T4_S_3', 'TOAN', 'Chinh');
  set('2B', 'T4_S_4', 'MT', 'Thy');
  set('2B', 'T4_C_1', 'TC', 'Nhàn');
  set('2B', 'T4_C_2', 'GDTC', 'Thịnh');
  set('2B', 'T4_C_3', 'TC', 'Thy');

  // T5: S1 TV(Chinh), S2 TV(Chinh), S3 TOAN(Chinh), S4 TC(Thy)
  //     C1 TV(Chinh), C2 TNXH(Chinh), C3 TC_TV(Thy) -> Chinh teaches C1 & C2!
  set('2B', 'T5_S_1', 'TV', 'Chinh');
  set('2B', 'T5_S_2', 'TV', 'Chinh');
  set('2B', 'T5_S_3', 'TOAN', 'Chinh');
  set('2B', 'T5_S_4', 'TC', 'Thy');
  set('2B', 'T5_C_1', 'TV', 'Chinh');
  set('2B', 'T5_C_2', 'TNXH', 'Chinh');
  set('2B', 'T5_C_3', 'TC_TV', 'Thy');

  // T6: S1 TV(Chinh), S2 BD_NT(Thy), S3 TOAN(Chinh), S4 SHL(Chinh)
  set('2B', 'T6_S_1', 'TV', 'Chinh');
  set('2B', 'T6_S_2', 'BD_NT', 'Thy');
  set('2B', 'T6_S_3', 'TOAN', 'Chinh');
  set('2B', 'T6_S_4', 'SHL', 'Chinh');

  // =========================================================================
  // 3B: Đạt (Target: 19, Off: T3_C, T5_C)
  // Sáng: 14 periods (T2: 3, T3: 3, T4: 3, T5: 3, T6: 2)
  // Chiều: 5 periods (T2: 2, T4: 3)
  // Total Đạt: 14 + 5 = 19!
  // =========================================================================
  // T2: S1 SHDC(Đạt), S2 TV(Đạt), S3 TOAN(Đạt), S4 TH(Phương)
  //     C1 TA(Nương), C2 TV(Đạt), C3 TC(Nhàn) -> Đạt teaches C2 only
  set('3B', 'T2_S_1', 'SHDC', 'Đạt');
  set('3B', 'T2_S_2', 'TV', 'Đạt');
  set('3B', 'T2_S_3', 'TOAN', 'Đạt');
  set('3B', 'T2_S_4', 'TH', 'Phương');
  set('3B', 'T2_C_1', 'TA', 'Nương');
  set('3B', 'T2_C_2', 'TV', 'Đạt');
  set('3B', 'T2_C_3', 'TC', 'Nhàn');

  // T3: S1 TV(Đạt), S2 TNXH(Đạt), S3 AN(Thy), S4 TOAN(Đạt)
  //     C1 TA(Nương), C2 HDTN_CD(Nhàn), C3 GDTC(Thịnh) -> Đạt OFF T3_C
  set('3B', 'T3_S_1', 'TV', 'Đạt');
  set('3B', 'T3_S_2', 'TNXH', 'Đạt');
  set('3B', 'T3_S_3', 'AN', 'Thy');
  set('3B', 'T3_S_4', 'TOAN', 'Đạt');
  set('3B', 'T3_C_1', 'TA', 'Nương');
  set('3B', 'T3_C_2', 'HDTN_CD', 'Nhàn');
  set('3B', 'T3_C_3', 'GDTC', 'Thịnh');

  // T4: S1 TV(Đạt), S2 TV(Đạt), S3 TOAN(Đạt), S4 TNXH(Đạt) (Pair 1-2!)
  //     C1 TV(Đạt), C2 TC_TV(Đạt), C3 TC_TOAN(Nhàn) -> Đạt teaches C1 & C2
  set('3B', 'T4_S_1', 'TV', 'Đạt');
  set('3B', 'T4_S_2', 'TV', 'Đạt');
  set('3B', 'T4_S_3', 'TOAN', 'Đạt');
  set('3B', 'T4_S_4', 'TNXH', 'Đạt');
  set('3B', 'T4_C_1', 'TV', 'Đạt');
  set('3B', 'T4_C_2', 'TC_TV', 'Đạt');
  set('3B', 'T4_C_3', 'TC_TOAN', 'Nhàn');

  // T5: S1 TV(Đạt), S2 TH(Phương), S3 TOAN(Đạt), S4 TC(Phương)
  //     C1 TA(Nương), C2 GDTC(Thịnh), C3 TC(Thy) -> Đạt OFF T5_C
  set('3B', 'T5_S_1', 'TV', 'Đạt');
  set('3B', 'T5_S_2', 'TH', 'Phương');
  set('3B', 'T5_S_3', 'TOAN', 'Đạt');
  set('3B', 'T5_S_4', 'TC', 'Phương');
  set('3B', 'T5_C_1', 'TA', 'Nương');
  set('3B', 'T5_C_2', 'GDTC', 'Thịnh');
  set('3B', 'T5_C_3', 'TC', 'Thy');

  // T6: S1 TV(Đạt), S2 DD(Đạt), S3 TOAN(Đạt), S4 SHL(Đạt)
  set('3B', 'T6_S_1', 'TV', 'Đạt');
  set('3B', 'T6_S_2', 'DD', 'Đạt');
  set('3B', 'T6_S_3', 'TOAN', 'Đạt');
  set('3B', 'T6_S_4', 'SHL', 'Đạt');

  // =========================================================================
  // 4B: Yến (Target: 19, Off: T3_C, T5_C)
  // Sáng: 14 periods (T2: 3, T3: 3, T4: 3, T5: 3, T6: 2)
  // Chiều: 5 periods (T2: 2, T4: 3)
  // Total Yến: 14 + 5 = 19!
  // =========================================================================
  // T2: S1 SHDC(Yến), S2 TV(Yến), S3 TOAN(Yến), S4 KH(Yến)
  //     C1 TV(Yến), C2 TA(Nương), C3 TC(Nhàn) -> Yến teaches C1 only
  set('4B', 'T2_S_1', 'SHDC', 'Yến');
  set('4B', 'T2_S_2', 'TV', 'Yến');
  set('4B', 'T2_S_3', 'TOAN', 'Yến');
  set('4B', 'T2_S_4', 'KH', 'Yến');
  set('4B', 'T2_C_1', 'TV', 'Yến');
  set('4B', 'T2_C_2', 'TA', 'Nương');
  set('4B', 'T2_C_3', 'TC', 'Nhàn');

  // T3: S1 TV(Yến), S2 TH(Phương), S3 TOAN(Yến), S4 MT(Thy)
  //     C1 GDTC(Thịnh), C2 TA(Nương), C3 HDTN_CD(Nhàn) -> Yến OFF T3_C
  set('4B', 'T3_S_1', 'TV', 'Yến');
  set('4B', 'T3_S_2', 'TH', 'Phương');
  set('4B', 'T3_S_3', 'TOAN', 'Yến');
  set('4B', 'T3_S_4', 'MT', 'Thy');
  set('4B', 'T3_C_1', 'GDTC', 'Thịnh');
  set('4B', 'T3_C_2', 'TA', 'Nương');
  set('4B', 'T3_C_3', 'HDTN_CD', 'Nhàn');

  // T4: S1 TV(Yến), S2 TV(Yến), S3 TOAN(Yến), S4 TH(Phương) (Pair 1-2!)
  //     C1 TV(Yến), C2 LS_DL(Yến), C3 TC_TOAN(Nhàn) -> Yến teaches C1 & C2
  set('4B', 'T4_S_1', 'TV', 'Yến');
  set('4B', 'T4_S_2', 'TV', 'Yến');
  set('4B', 'T4_S_3', 'TOAN', 'Yến');
  set('4B', 'T4_S_4', 'TH', 'Phương');
  set('4B', 'T4_C_1', 'TV', 'Yến');
  set('4B', 'T4_C_2', 'LS_DL', 'Yến');
  set('4B', 'T4_C_3', 'TC_TOAN', 'Nhàn');

  // T5: S1 TV(Yến), S2 KH(Yến), S3 AN(Thy), S4 TOAN(Yến)
  //     C1 TC(Nhàn), C2 TA(Nương), C3 GDTC(Thịnh) -> Yến OFF T5_C
  set('4B', 'T5_S_1', 'TV', 'Yến');
  set('4B', 'T5_S_2', 'KH', 'Yến');
  set('4B', 'T5_S_3', 'AN', 'Thy');
  set('4B', 'T5_S_4', 'TOAN', 'Yến');
  set('4B', 'T5_C_1', 'TC', 'Nhàn');
  set('4B', 'T5_C_2', 'TA', 'Nương');
  set('4B', 'T5_C_3', 'GDTC', 'Thịnh');

  // T6: S1 TV(Yến), S2 LS_DL(Yến), S3 TOAN(Yến), S4 SHL(Yến)
  set('4B', 'T6_S_1', 'TV', 'Yến');
  set('4B', 'T6_S_2', 'LS_DL', 'Yến');
  set('4B', 'T6_S_3', 'TOAN', 'Yến');
  set('4B', 'T6_S_4', 'SHL', 'Yến');

  // =========================================================================
  // 5B: Huế (Target: 19, Off: T3_C, T5_C)
  // Sáng: 14 periods (T2: 3, T3: 3, T4: 3, T5: 3, T6: 2)
  // Chiều: 5 periods (T2: 2, T4: 3)
  // Total Huế: 14 + 5 = 19!
  // =========================================================================
  // T2: S1 SHDC(Huế), S2 TV(Huế), S3 TOAN(Huế), S4 KH(Huế)
  //     C1 TV(Huế), C2 TC(Nhàn), C3 TA(Nương) -> Huế teaches C1 only
  set('5B', 'T2_S_1', 'SHDC', 'Huế');
  set('5B', 'T2_S_2', 'TV', 'Huế');
  set('5B', 'T2_S_3', 'TOAN', 'Huế');
  set('5B', 'T2_S_4', 'KH', 'Huế');
  set('5B', 'T2_C_1', 'TV', 'Huế');
  set('5B', 'T2_C_2', 'TC', 'Nhàn');
  set('5B', 'T2_C_3', 'TA', 'Nương');

  // T3: S1 TV(Huế), S2 TOAN(Huế), S3 TH(Phương), S4 KH(Huế)
  //     C1 HDTN_CD(Nhàn), C2 GDTC(Thịnh), C3 TA(Nương) -> Huế OFF T3_C
  set('5B', 'T3_S_1', 'TV', 'Huế');
  set('5B', 'T3_S_2', 'TOAN', 'Huế');
  set('5B', 'T3_S_3', 'TH', 'Phương');
  set('5B', 'T3_S_4', 'KH', 'Huế');
  set('5B', 'T3_C_1', 'HDTN_CD', 'Nhàn');
  set('5B', 'T3_C_2', 'GDTC', 'Thịnh');
  set('5B', 'T3_C_3', 'TA', 'Nương');

  // T4: S1 TV(Huế), S2 TV(Huế), S3 TOAN(Huế), S4 LS_DL(Huế) (Pair 1-2!)
  //     C1 TV(Huế), C2 LS_DL(Huế), C3 TC_TOAN(Nhàn) -> Huế teaches C1 & C2
  set('5B', 'T4_S_1', 'TV', 'Huế');
  set('5B', 'T4_S_2', 'TV', 'Huế');
  set('5B', 'T4_S_3', 'TOAN', 'Huế');
  set('5B', 'T4_S_4', 'LS_DL', 'Huế');
  set('5B', 'T4_C_1', 'TV', 'Huế');
  set('5B', 'T4_C_2', 'LS_DL', 'Huế');
  set('5B', 'T4_C_3', 'TC_TOAN', 'Nhàn');

  // T5: S1 TV(Huế), S2 TOAN(Huế), S3 TH(Phương), S4 AN(Thy)
  //     C1 GDTC(Thịnh), C2 TC(Thy), C3 TA(Nương) -> Huế OFF T5_C
  set('5B', 'T5_S_1', 'TV', 'Huế');
  set('5B', 'T5_S_2', 'TOAN', 'Huế');
  set('5B', 'T5_S_3', 'TH', 'Phương');
  set('5B', 'T5_S_4', 'AN', 'Thy');
  set('5B', 'T5_C_1', 'GDTC', 'Thịnh');
  set('5B', 'T5_C_2', 'TC', 'Thy');
  set('5B', 'T5_C_3', 'TA', 'Nương');

  // T6: S1 TV(Huế), S2 DD(Huế), S3 TOAN(Huế), S4 SHL(Huế)
  set('5B', 'T6_S_1', 'TV', 'Huế');
  set('5B', 'T6_S_2', 'DD', 'Huế');
  set('5B', 'T6_S_3', 'TOAN', 'Huế');
  set('5B', 'T6_S_4', 'SHL', 'Huế');

  return sched;
}

const sched = buildPerfectZeroSchedule();
const violations = auditSchedule(sched);
console.log('AUDIT VIOLATIONS COUNT:', violations.length);
for (const v of violations) {
  console.log(`[${v.code}] ${v.title} :: ${v.description}`);
}
