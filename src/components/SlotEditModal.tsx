import React, { useState } from 'react';
import { ALL_CLASSES, ALL_TEACHERS, SUBJECTS, TIME_SLOTS } from '../data/initialData';
import { auditSchedule } from '../solver/cspSolver';
import { ScheduledLesson, ScheduleMatrix } from '../types';
import { X, ArrowLeftRight, Check, AlertTriangle, Lock } from 'lucide-react';

interface SlotEditModalProps {
  classId: string;
  slotId: string;
  lesson?: ScheduledLesson;
  schedule: ScheduleMatrix;
  onSaveLesson: (classId: string, slotId: string, updatedLesson: ScheduledLesson) => void;
  onSwapSlots: (classId: string, slotId1: string, slotId2: string) => void;
  onClose: () => void;
}

export const SlotEditModal: React.FC<SlotEditModalProps> = ({
  classId,
  slotId,
  lesson,
  schedule,
  onSaveLesson,
  onSwapSlots,
  onClose,
}) => {
  const currentSlot = TIME_SLOTS.find(s => s.id === slotId);
  const currentClass = ALL_CLASSES.find(c => c.id === classId);

  const [mode, setMode] = useState<'edit' | 'swap'>('edit');
  const [selectedSubject, setSelectedSubject] = useState<string>(lesson?.subjectCode || 'TOAN');
  const [selectedTeacher, setSelectedTeacher] = useState<string>(lesson?.teacherName || currentClass?.gvcn || 'Chi');
  const [targetSwapSlotId, setTargetSwapSlotId] = useState<string>(
    TIME_SLOTS.find(s => s.id !== slotId && s.session === currentSlot?.session)?.id || TIME_SLOTS[0].id
  );

  const isLocked = lesson?.isLocked || slotId === 'T2_S_1' || slotId === 'T6_S_4';

  // Preview potential conflicts if swapping
  const simulateSwapConflict = () => {
    // Clone schedule and swap
    const cloned: ScheduleMatrix = JSON.parse(JSON.stringify(schedule));
    const l1 = cloned[classId]?.[slotId];
    const l2 = cloned[classId]?.[targetSwapSlotId];

    if (l1 && l2) {
      cloned[classId][slotId] = { ...l2, slotId };
      cloned[classId][targetSwapSlotId] = { ...l1, slotId: targetSwapSlotId };
    }

    const testViolations = auditSchedule(cloned);
    return testViolations;
  };

  const swapConflicts = mode === 'swap' ? simulateSwapConflict() : [];

  const handleSave = () => {
    if (isLocked) return;

    if (mode === 'swap') {
      onSwapSlots(classId, slotId, targetSwapSlotId);
      onClose();
      return;
    }

    const subj = SUBJECTS[selectedSubject] || SUBJECTS.TOAN;
    const updated: ScheduledLesson = {
      classId,
      slotId,
      subjectCode: selectedSubject,
      subjectName: subj.name,
      teacherName: selectedTeacher,
      category: subj.category,
      notes: lesson?.notes,
    };
    onSaveLesson(classId, slotId, updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Điều Chỉnh Tiết Học: Lớp {currentClass?.name}
              {isLocked && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  <Lock className="w-3 h-3" /> Cố định quy chuẩn
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentSlot?.dayName} | {currentSlot?.sessionName} | Tiết {currentSlot?.period} ({currentSlot?.timeLabel})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Mode Switcher */}
          {!isLocked && (
            <div className="flex rounded-lg bg-slate-100 p-1 font-semibold">
              <button
                onClick={() => setMode('edit')}
                className={`flex-1 py-1.5 rounded-md transition-all ${
                  mode === 'edit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Chỉnh sửa Môn & Giáo Viên
              </button>
              <button
                onClick={() => setMode('swap')}
                className={`flex-1 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'swap' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" /> Hoán đổi vị trí tiết
              </button>
            </div>
          )}

          {isLocked ? (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <Lock className="w-4 h-4" /> Tiết học theo quy chuẩn GDPT bắt buộc:
              </div>
              <p className="text-xs leading-relaxed">
                {slotId === 'T2_S_1'
                  ? 'Sáng Thứ 2 Tiết 1 là Lễ Chào Cờ / Sinh hoạt dưới cờ toàn trường do Ban giám hiệu và GVCN chủ trì.'
                  : slotId === 'T6_S_4'
                  ? 'Sáng Thứ 6 Tiết 4 là Tiết Sinh hoạt lớp cuối tuần do GVCN phụ trách tổng kết thi đua.'
                  : 'Tiết học này đang được khóa để bảo toàn tính toàn vẹn của thời khóa biểu.'}
              </p>
            </div>
          ) : mode === 'edit' ? (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Môn Học:</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    const subCode = e.target.value;
                    setSelectedSubject(subCode);
                    const defTeacher = SUBJECTS[subCode]?.defaultTeacher;
                    if (defTeacher) setSelectedTeacher(defTeacher);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {Object.values(SUBJECTS).filter(s => s.code !== 'OFF').map(s => (
                    <option key={s.code} value={s.code}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Giáo Viên Phụ Trách:</label>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <optgroup label="Giáo viên chủ nhiệm lớp">
                    <option value={currentClass?.gvcn}>{currentClass?.gvcn} (GVCN {currentClass?.name})</option>
                  </optgroup>
                  <optgroup label="Giáo viên bộ môn">
                    {ALL_TEACHERS.filter(t => t.role === 'SPECIALIST').map(t => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.subjects.join(', ')})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chọn Tiết Cần Hoán Đổi:</label>
                <select
                  value={targetSwapSlotId}
                  onChange={(e) => setTargetSwapSlotId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {TIME_SLOTS.filter(s => s.id !== slotId && s.id !== 'T2_S_1' && s.id !== 'T6_S_4').map(s => {
                    const otherLesson = schedule[classId]?.[s.id];
                    return (
                      <option key={s.id} value={s.id}>
                        {s.dayName} {s.sessionName} Tiết {s.period} ({otherLesson?.subjectName || 'Trống'} - {otherLesson?.teacherName || ''})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Conflict warning preview */}
              {swapConflicts.length > 0 ? (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
                  <div className="font-bold flex items-center gap-1.5 text-xs mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-600" /> Phát hiện {swapConflicts.length} xung đột tiềm ẩn nếu đổi:
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    {swapConflicts.slice(0, 3).map((v) => (
                      <li key={v.id}>{v.description}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px] font-semibold">
                    An toàn! Không gây trùng lịch giáo viên hoặc vi phạm khoảng cách 2 điểm trường.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors text-xs"
          >
            Hủy Bỏ
          </button>
          {!isLocked && (
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs transition-all text-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Xác Nhận Lưu
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
