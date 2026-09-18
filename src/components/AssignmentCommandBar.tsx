import React, { useState } from 'react';
import {
  ALL_CLASSES,
  ALL_TEACHERS,
  GVCN_MAP,
  SPECIALIST_TEACHERS,
  SUBJECTS,
  TIME_SLOTS,
} from '../data/initialData';
import { ScheduleMatrix } from '../types';
import { AssignmentCommand, executeAssignmentCommand } from '../solver/cspSolver';
import {
  SlidersHorizontal,
  RefreshCw,
  UserCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRightLeft,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  BookOpen,
} from 'lucide-react';

interface AssignmentCommandBarProps {
  schedule: ScheduleMatrix;
  onApplyCommand: (newSchedule: ScheduleMatrix, description: string) => void;
  onResetStandard: () => void;
}

export function AssignmentCommandBar({
  schedule,
  onApplyCommand,
  onResetStandard,
}: AssignmentCommandBarProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [selectedClass, setSelectedClass] = useState<string>('1A');
  const [selectedSubject, setSelectedSubject] = useState<string>('TC_TOAN');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('Chi');
  const [targetPeriods, setTargetPeriods] = useState<number>(2);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // All teachers list
  const allTeachers = ALL_TEACHERS;

  // Selected teacher info & target quota
  const selectedTeacherInfo = React.useMemo(() => {
    return ALL_TEACHERS.find(t => t.name === selectedTeacher);
  }, [selectedTeacher]);

  const targetQuota = selectedTeacherInfo?.targetPeriods ?? 19;

  // Calculate current workload of selected teacher
  const currentWorkload = React.useMemo(() => {
    let count = 0;
    let inClassCount = 0;
    for (const c of ALL_CLASSES) {
      for (const s of TIME_SLOTS) {
        const l = schedule[c.id]?.[s.id];
        if (l?.teacherName === selectedTeacher) {
          count++;
          if (c.id === selectedClass) {
            inClassCount++;
          }
        }
      }
    }
    return { total: count, inClass: inClassCount };
  }, [schedule, selectedTeacher, selectedClass]);

  // Handle when class changes, automatically set default GVCN
  const handleClassChange = (newClass: string) => {
    setSelectedClass(newClass);
    const gvcn = GVCN_MAP[newClass];
    if (gvcn) {
      setSelectedTeacher(gvcn);
    }
  };

  // Execute assignment adjustment
  const handleExecute = () => {
    const cmd: AssignmentCommand = {
      classId: selectedClass,
      toTeacher: selectedTeacher,
      subjectCode: selectedSubject,
      targetPeriodsCount: selectedSlotId ? undefined : targetPeriods,
      slotIds: selectedSlotId ? [selectedSlotId] : undefined,
      notes: notes.trim() || undefined,
    };

    const updatedSchedule = executeAssignmentCommand(schedule, cmd);
    const subjName = SUBJECTS[selectedSubject as keyof typeof SUBJECTS]?.name || selectedSubject;
    const targetDesc = selectedSlotId
      ? `tiết ${selectedSlotId}`
      : `${targetPeriods} tiết`;

    onApplyCommand(
      updatedSchedule,
      `Đã phân công ${selectedTeacher} dạy môn ${subjName} (${targetDesc}) tại lớp ${selectedClass}`
    );
  };

  // Quick preset: standard 19 periods & 2 afternoons off
  const handleQuickStandardize = () => {
    onResetStandard();
  };

  // Quick preset: ensure HDTN period 2 is assigned to reinforcement teacher
  const handleAssignHdtnPeriod2 = () => {
    let newSched = JSON.parse(JSON.stringify(schedule));
    const targetReinforcement = selectedClass.endsWith('A') ? 'Phước' : 'Tâm';

    // Find midweek HDTN slot
    for (const slot of TIME_SLOTS) {
      if (slot.id !== 'T2_S_1' && slot.id !== 'T6_S_4') {
        const lesson = newSched[selectedClass]?.[slot.id];
        if (lesson?.subjectCode === 'HDTN' || lesson?.subjectCode === 'HDTN_CD') {
          newSched[selectedClass][slot.id] = {
            ...lesson,
            subjectCode: 'HDTN_CD',
            subjectName: 'HĐTN (Theo chủ đề)',
            teacherName: targetReinforcement,
            notes: 'HĐTN Tiết 2 - GV tăng cường/kiêm nhiệm',
          };
          break;
        }
      }
    }
    onApplyCommand(
      newSched,
      `Đã chuyển Tiết 2 HĐTN lớp ${selectedClass} cho GV ${targetReinforcement} phụ trách theo đúng quy chuẩn.`
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-200">
      {/* Header bar */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Thanh Lệnh Điều Chỉnh Giáo Viên & Số Tiết Phân Công
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Chuẩn GDPT 2026-2027
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Thay đổi linh hoạt giáo viên, môn học, phân bổ số tiết theo nhu cầu nhà trường và kiểm tra ràng buộc tức thì.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleQuickStandardize}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Khôi phục toàn trường về chuẩn 19 tiết GVCN & 2 buổi chiều nghỉ"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cân đối chuẩn 19 tiết</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="p-4 sm:p-5 bg-slate-50/50 border-t border-slate-100 space-y-4">
          {/* Policy Pillars Reminder Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                17-19
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-800 truncate">Định mức GVCN theo chức vụ</div>
                <div className="text-[11px] text-slate-500 truncate">Trang (TT) 17T • Bé Năm (TP) 18T • Khác 19T</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                2P
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-800 truncate">Nghỉ 2 buổi chiều</div>
                <div className="text-[11px] text-slate-500 truncate">Từ Thứ 2 đến Thứ 5</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                3T
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-800 truncate">HĐTN 3 tiết/tuần</div>
                <div className="text-[11px] text-slate-500 truncate">Tiết 2 do GV tăng cường dạy</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                BD
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-800 truncate">Bồi dưỡng đúng môn</div>
                <div className="text-[11px] text-slate-500 truncate">GV bộ môn phụ trách</div>
              </div>
            </div>
          </div>

          {/* Form Command Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-1">
            {/* Class Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Lớp học
              </label>
              <select
                value={selectedClass}
                onChange={e => handleClassChange(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              >
                {ALL_CLASSES.map(c => (
                  <option key={c.id} value={c.id}>
                    Lớp {c.id} ({c.id.endsWith('A') ? 'Điểm 1' : 'Điểm 2'} - GVCN: {GVCN_MAP[c.id]})
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Selector */}
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Môn học cần điều chỉnh
              </label>
              <select
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              >
                <optgroup label="Tăng cường & Bồi dưỡng">
                  <option value="TC_TOAN">TC_TOAN - Tăng cường Toán (GVCN)</option>
                  <option value="TC_TV">TC_TV - Tăng cường Tiếng Việt (GVCN)</option>
                  <option value="HDTN_CD">HDTN_CD - HĐTN Chủ đề (GV Tăng cường/Bộ môn)</option>
                  <option value="BD_TA">BD_TA - Bồi dưỡng Tiếng Anh (Nương)</option>
                  <option value="BD_TH">BD_TH - Bồi dưỡng Tin học (Phương)</option>
                  <option value="BD_TD">BD_TD - Bồi dưỡng TDTT / Thể chất (Thịnh)</option>
                  <option value="BD_NT">BD_NT - Bồi dưỡng Nghệ thuật (Tâm/Thy)</option>
                  <option value="TC">TC - Kỹ năng sống / Tăng cường</option>
                </optgroup>
                <optgroup label="Môn chính khóa">
                  <option value="TOAN">TOAN - Toán học (1 tiết/ngày)</option>
                  <option value="TV">TV - Tiếng Việt</option>
                  <option value="TA">TA - Tiếng Anh (Nương)</option>
                  <option value="GDTC">GDTC - Giáo dục thể chất (Thịnh)</option>
                  <option value="TH">TH - Tin học (Phương)</option>
                  <option value="AN">AN - Âm nhạc</option>
                  <option value="MT">MT - Mỹ thuật</option>
                  <option value="TNXH">TNXH - Tự nhiên và Xã hội</option>
                  <option value="KH">KH - Khoa học</option>
                  <option value="LS_DL">LS_DL - Lịch sử và Địa lý</option>
                  <option value="DD">DD - Đạo đức</option>
                </optgroup>
              </select>
            </div>

            {/* Teacher Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Giáo viên phân công
              </label>
              <select
                value={selectedTeacher}
                onChange={e => setSelectedTeacher(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              >
                <optgroup label="GV Chủ nhiệm & Cán sự">
                  {ALL_TEACHERS.filter(t => t.role === 'GVCN').map(t => (
                    <option key={t.id} value={t.name}>
                      Cô/Thầy {t.name} ({t.roleTitle || t.assignedClass} • {t.targetPeriods || 19}T)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="GV Bộ môn & Tăng cường">
                  {ALL_TEACHERS.filter(t => t.role !== 'GVCN').map(t => (
                    <option key={t.id} value={t.name}>
                      Cô/Thầy {t.name} ({t.subjects.join(', ')})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Periods Count or Slot Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Số tiết hoặc Tiết cụ thể
              </label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="19"
                  value={targetPeriods}
                  onChange={e => setTargetPeriods(parseInt(e.target.value) || 1)}
                  disabled={Boolean(selectedSlotId)}
                  className="w-16 bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center shadow-2xs disabled:bg-slate-100"
                  title="Số tiết phân công cho môn này"
                />
                <select
                  value={selectedSlotId}
                  onChange={e => setSelectedSlotId(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs truncate"
                >
                  <option value="">(Tất cả / Theo định mức)</option>
                  <optgroup label="Thứ 2">
                    <option value="T2_S_2">Thứ 2 Sáng - Tiết 2</option>
                    <option value="T2_S_3">Thứ 2 Sáng - Tiết 3</option>
                    <option value="T2_S_4">Thứ 2 Sáng - Tiết 4</option>
                    <option value="T2_C_1">Thứ 2 Chiều - Tiết 1</option>
                    <option value="T2_C_2">Thứ 2 Chiều - Tiết 2</option>
                    <option value="T2_C_3">Thứ 2 Chiều - Tiết 3</option>
                  </optgroup>
                  <optgroup label="Thứ 3">
                    <option value="T3_S_1">Thứ 3 Sáng - Tiết 1</option>
                    <option value="T3_S_2">Thứ 3 Sáng - Tiết 2</option>
                    <option value="T3_S_3">Thứ 3 Sáng - Tiết 3</option>
                    <option value="T3_S_4">Thứ 3 Sáng - Tiết 4</option>
                    <option value="T3_C_1">Thứ 3 Chiều - Tiết 1</option>
                    <option value="T3_C_2">Thứ 3 Chiều - Tiết 2</option>
                    <option value="T3_C_3">Thứ 3 Chiều - Tiết 3</option>
                  </optgroup>
                  <optgroup label="Thứ 4">
                    <option value="T4_S_1">Thứ 4 Sáng - Tiết 1</option>
                    <option value="T4_S_2">Thứ 4 Sáng - Tiết 2</option>
                    <option value="T4_S_3">Thứ 4 Sáng - Tiết 3</option>
                    <option value="T4_S_4">Thứ 4 Sáng - Tiết 4</option>
                    <option value="T4_C_1">Thứ 4 Chiều - Tiết 1</option>
                    <option value="T4_C_2">Thứ 4 Chiều - Tiết 2</option>
                    <option value="T4_C_3">Thứ 4 Chiều - Tiết 3</option>
                  </optgroup>
                  <optgroup label="Thứ 5">
                    <option value="T5_S_1">Thứ 5 Sáng - Tiết 1</option>
                    <option value="T5_S_2">Thứ 5 Sáng - Tiết 2</option>
                    <option value="T5_S_3">Thứ 5 Sáng - Tiết 3</option>
                    <option value="T5_S_4">Thứ 5 Sáng - Tiết 4</option>
                    <option value="T5_C_1">Thứ 5 Chiều - Tiết 1</option>
                    <option value="T5_C_2">Thứ 5 Chiều - Tiết 2</option>
                    <option value="T5_C_3">Thứ 5 Chiều - Tiết 3</option>
                  </optgroup>
                  <optgroup label="Thứ 6">
                    <option value="T6_S_1">Thứ 6 Sáng - Tiết 1</option>
                    <option value="T6_S_2">Thứ 6 Sáng - Tiết 2</option>
                    <option value="T6_S_3">Thứ 6 Sáng - Tiết 3</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleExecute}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Thực hiện lệnh</span>
              </button>
            </div>
          </div>

          {/* Quick Helper Actions & Teacher Workload Status */}
          <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 text-slate-600">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Số tiết hiện tại của <strong>{selectedTeacher}</strong> ({selectedTeacherInfo?.roleTitle || (selectedTeacherInfo?.role === 'GVCN' ? 'GVCN' : 'Bộ môn')}):</span>
                <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                  selectedTeacherInfo?.role === 'GVCN' && currentWorkload.total === targetQuota
                    ? 'bg-emerald-100 text-emerald-800'
                    : selectedTeacherInfo?.role === 'GVCN'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {currentWorkload.total} tiết/tuần
                  {selectedTeacherInfo?.role === 'GVCN' && ` (Định mức: ${targetQuota}T)`}
                </span>
                <span className="text-[11px] text-slate-500">
                  (trong lớp {selectedClass}: {currentWorkload.inClass} tiết)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAssignHdtnPeriod2}
                className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-[11px] transition-colors cursor-pointer"
              >
                Gán Tiết 2 HĐTN lớp {selectedClass} cho GV Tăng cường
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
