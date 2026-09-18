import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { ConstraintAuditor } from './components/ConstraintAuditor';
import { AssignmentCommandBar } from './components/AssignmentCommandBar';
import { SchoolScheduleView } from './components/SchoolScheduleView';
import { ClassScheduleView } from './components/ClassScheduleView';
import { TeacherScheduleView } from './components/TeacherScheduleView';
import { SlotEditModal } from './components/SlotEditModal';
import { StatisticsModal } from './components/StatisticsModal';
import { SchoolManagerModal } from './components/SchoolManagerModal';
import { ConstraintsModal } from './components/ConstraintsModal';
import { auditSchedule, solveOptimalSchedule } from './solver/cspSolver';
import { exportScheduleToExcel } from './utils/excelExport';
import { ConstraintConfig, ScheduledLesson, ScheduleMatrix, SchoolProfile } from './types';
import { DEFAULT_CONSTRAINTS, PRESET_TAN_THANH } from './data/schoolPresets';
import { SCHOOL_INFO } from './data/initialData';
import { CheckCircle2, AlertCircle, Sparkles, Download, Info, RotateCcw, Award, Coffee, SlidersHorizontal, Users } from 'lucide-react';

export default function App() {
  // Active school profile (Tan Thanh by default, can switch to Chu Van An, Le Hong Phong, or custom)
  const [currentSchool, setCurrentSchool] = useState<SchoolProfile>(() => PRESET_TAN_THANH);

  // Active hard and soft constraints configuration
  const [constraints, setConstraints] = useState<ConstraintConfig>(() => DEFAULT_CONSTRAINTS);

  // Initialize schedule with CP-SAT solver for current profile and constraints
  const [schedule, setSchedule] = useState<ScheduleMatrix>(() =>
    solveOptimalSchedule({ schoolProfile: PRESET_TAN_THANH, constraints: DEFAULT_CONSTRAINTS })
  );

  const [currentView, setCurrentView] = useState<'school' | 'class' | 'teacher' | 'auditor'>('school');
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [showSchoolManagerModal, setShowSchoolManagerModal] = useState<boolean>(false);
  const [showConstraintsModal, setShowConstraintsModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Selected slot for modal editing / swapping
  const [selectedSlot, setSelectedSlot] = useState<{
    classId: string;
    slotId: string;
    lesson?: ScheduledLesson;
  } | null>(null);

  // Dynamic audit of constraints for current schedule
  const violations = useMemo(
    () => auditSchedule(schedule, { schoolProfile: currentSchool, constraints }),
    [schedule, currentSchool, constraints]
  );

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Run CP-SAT solver with current profile and constraints
  const handleSolveAgain = () => {
    setIsSolving(true);
    showToast(`Đang chạy bộ giải CP-SAT xếp TKB cho ${currentSchool.name}...`, 'info');

    setTimeout(() => {
      const newSchedule = solveOptimalSchedule({
        schoolProfile: currentSchool,
        constraints,
      });
      setSchedule(newSchedule);
      setIsSolving(false);
      showToast(
        `Đã tự động xếp TKB cho ${currentSchool.name}! Tuân thủ các nguyên tắc cứng & mềm.`,
        'success'
      );
    }, 500);
  };

  // When changing school, update profile and re-solve automatically
  const handleSaveSchool = (newProfile: SchoolProfile) => {
    setCurrentSchool(newProfile);
    setIsSolving(true);
    showToast(`Đang đồng bộ danh sách GV và phân tiết của trường ${newProfile.name}...`, 'info');

    setTimeout(() => {
      const newSchedule = solveOptimalSchedule({
        schoolProfile: newProfile,
        constraints,
      });
      setSchedule(newSchedule);
      setIsSolving(false);
      showToast(
        `Đã chuyển sang ${newProfile.name} (${newProfile.classes.length} lớp, ${newProfile.teachers.length} GV) và xếp TKB mới thành công!`,
        'success'
      );
    }, 400);
  };

  // When changing hard / soft constraints
  const handleSaveConstraints = (newConstraints: ConstraintConfig) => {
    setConstraints(newConstraints);
    setIsSolving(true);
    showToast('Đang áp dụng cấu hình nguyên tắc cứng/mềm và tối ưu hóa lại TKB...', 'info');

    setTimeout(() => {
      const newSchedule = solveOptimalSchedule({
        schoolProfile: currentSchool,
        constraints: newConstraints,
      });
      setSchedule(newSchedule);
      setIsSolving(false);
      showToast('Đã lưu cấu hình nguyên tắc mới và đồng bộ lại thời khóa biểu!', 'success');
    }, 400);
  };

  // Export to Excel matching openpyxl format
  const handleExportExcel = async () => {
    try {
      showToast('Đang khởi tạo file Excel khổ A4 theo quy chuẩn OpenPyXL...', 'info');
      await exportScheduleToExcel(
        schedule,
        `TKB_${currentSchool.id || 'Truong'}_A4_${currentSchool.academicYear.replace(/\s+/g, '')}.xlsx`,
        currentSchool
      );
      showToast('Đã xuất file Excel thành công!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Có lỗi xảy ra khi xuất file Excel', 'error');
    }
  };

  // Handle command applied from AssignmentCommandBar
  const handleApplyCommand = (newSchedule: ScheduleMatrix, description: string) => {
    setSchedule(newSchedule);
    showToast(description, 'success');
  };

  // Update a single lesson
  const handleSaveLesson = (classId: string, slotId: string, updatedLesson: ScheduledLesson) => {
    setSchedule(prev => {
      const copy: ScheduleMatrix = JSON.parse(JSON.stringify(prev));
      copy[classId][slotId] = updatedLesson;
      return copy;
    });
    showToast(`Đã cập nhật tiết học của lớp ${classId}`);
  };

  // Swap two lessons
  const handleSwapSlots = (classId: string, slotId1: string, slotId2: string) => {
    setSchedule(prev => {
      const copy: ScheduleMatrix = JSON.parse(JSON.stringify(prev));
      const l1 = copy[classId]?.[slotId1];
      const l2 = copy[classId]?.[slotId2];

      if (l1 && l2) {
        copy[classId][slotId1] = { ...l2, slotId: slotId1 };
        copy[classId][slotId2] = { ...l1, slotId: slotId2 };
      }
      return copy;
    });
    showToast(`Đã hoán đổi vị trí 2 tiết học của lớp ${classId}`);
  };

  // Reset to optimal default
  const handleResetToDefault = () => {
    const fresh = solveOptimalSchedule({ schoolProfile: currentSchool, constraints });
    setSchedule(fresh);
    showToast('Đã xếp lại thời khóa biểu chuẩn theo cấu hình hiện tại.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Navigation & Header */}
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        onSolveAgain={handleSolveAgain}
        onExportExcel={handleExportExcel}
        onOpenStats={() => setShowStatsModal(true)}
        onOpenSchoolManager={() => setShowSchoolManagerModal(true)}
        onOpenConstraintsManager={() => setShowConstraintsModal(true)}
        isSolving={isSolving}
        violationsCount={violations.length}
        schoolProfile={currentSchool}
      />

      {/* Main App Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex-1 space-y-4">
        {/* Quick Auditor Banner */}
        <ConstraintAuditor
          violations={violations}
          onFocusViolation={() => setCurrentView('auditor')}
          constraints={constraints}
          onOpenConstraintsManager={() => setShowConstraintsModal(true)}
          schoolProfile={currentSchool}
        />

        {/* Thanh Lệnh Thay Đổi GV & Số Tiết Phân Công */}
        <AssignmentCommandBar
          schedule={schedule}
          onApplyCommand={handleApplyCommand}
          onResetStandard={handleResetToDefault}
          currentSchool={currentSchool}
          onOpenSchoolManager={() => setShowSchoolManagerModal(true)}
          onOpenConstraintsManager={() => setShowConstraintsModal(true)}
        />

        {/* View Switcher Output */}
        {currentView === 'school' && (
          <SchoolScheduleView
            schedule={schedule}
            onSelectSlot={(classId, slotId, lesson) => setSelectedSlot({ classId, slotId, lesson })}
            schoolProfile={currentSchool}
          />
        )}

        {currentView === 'class' && (
          <ClassScheduleView
            schedule={schedule}
            onSelectSlot={(classId, slotId, lesson) => setSelectedSlot({ classId, slotId, lesson })}
            schoolProfile={currentSchool}
          />
        )}

        {currentView === 'teacher' && (
          <TeacherScheduleView
            schedule={schedule}
            onSelectSlot={(classId, slotId, lesson) => setSelectedSlot({ classId, slotId, lesson })}
            schoolProfile={currentSchool}
          />
        )}

        {currentView === 'auditor' && (
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Chi Tiết Thuật Toán & Giám Sát Ràng Buộc CSP (CP-SAT Solver)
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Đang giám sát thời khóa biểu cho: <strong>{currentSchool.name}</strong> ({currentSchool.classes.length} lớp, {currentSchool.teachers.length} GV).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowConstraintsModal(true)}
                  className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Cấu Hình Nguyên Tắc Cứng & Mềm</span>
                </button>
                <button
                  onClick={() => setShowSchoolManagerModal(true)}
                  className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Quản Lý GV & Phân Tiết</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Các Ràng Buộc Cứng (Hard Constraints) đang kích hoạt:
                </h4>
                <ul className="space-y-1.5 text-slate-700 pl-4 list-disc">
                  {constraints.hard.noTeacherCollision && <li><strong>Không trùng giáo viên:</strong> 1 GV không dạy 2 nơi cùng lúc.</li>}
                  {constraints.hard.noClassCollision && <li><strong>Không trùng lớp:</strong> Mỗi lớp tại 1 thời điểm chỉ học 1 môn.</li>}
                  {constraints.hard.quanMoralOnly && <li><strong>Chính sách PHT Quan:</strong> Dạy đúng 2 tiết Đạo đức khối 5.</li>}
                  {constraints.hard.campusSegregation && <li><strong>Phân định điểm trường:</strong> Học sinh học đúng cơ sở (Điểm 1 / Điểm 2).</li>}
                  {constraints.hard.fridayAfternoonOff && <li><strong>Chiều Thứ 6 nghỉ:</strong> Toàn trường nghỉ sinh hoạt chuyên môn.</li>}
                  {constraints.hard.flagSaluteSlot1Monday && <li><strong>Chào cờ:</strong> Tiết 1 sáng Thứ Hai do GVCN phụ trách.</li>}
                  {constraints.hard.classMeetingSlot4Friday && <li><strong>Sinh hoạt lớp:</strong> Tiết 4 sáng Thứ Sáu do GVCN phụ trách.</li>}
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Các Ràng Buộc Mềm & Tối Ưu Sư Phạm (Soft Constraints):
                </h4>
                <ul className="space-y-1.5 text-slate-700 pl-4 list-disc">
                  {constraints.soft.twoAfternoonsOff && <li><strong>Nghỉ 2 buổi chiều:</strong> Học sinh nghỉ 2 buổi chiều trong tuần (T2 - T5).</li>}
                  {constraints.soft.respectTeacherQuota && <li><strong>Tuân thủ định mức:</strong> Phân bổ số tiết sát với quota của từng giáo viên.</li>}
                  {constraints.soft.morningMathAndVietnamese && <li><strong>Toán / Tiếng Việt buổi sáng:</strong> Ưu tiên môn tư duy đầu ngày.</li>}
                  {constraints.soft.noConsecutiveEnglish && <li><strong>Tiếng Anh không liền 2 tiết:</strong> Giãn cách tiếp thu ngoại ngữ.</li>}
                  {constraints.soft.minimizeTeacherTravelBetweenCampuses && <li><strong>Hạn chế di chuyển:</strong> GV bộ môn dạy gom theo điểm trường.</li>}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50/60 rounded-xl border border-blue-200">
              <div className="text-xs text-blue-900 font-medium">
                Bạn có thể thiết lập lại thời khóa biểu về trạng thái ban đầu bất kỳ lúc nào:
              </div>
              <button
                onClick={handleResetToDefault}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Khôi phục TKB Chuẩn
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>{currentSchool.name} - {currentSchool.branch}</strong> • Năm học {currentSchool.academicYear}
          </div>
          <div className="text-[11px] text-slate-400">
            {currentSchool.classes.length} Lớp học • {currentSchool.teachers.length} Giáo viên • Bộ giải CSP OR-Tools
          </div>
        </div>
      </footer>

      {/* Slot Edit Modal */}
      {selectedSlot && (
        <SlotEditModal
          classId={selectedSlot.classId}
          slotId={selectedSlot.slotId}
          lesson={selectedSlot.lesson}
          schedule={schedule}
          onSaveLesson={handleSaveLesson}
          onSwapSlots={handleSwapSlots}
          onClose={() => setSelectedSlot(null)}
        />
      )}

      {/* Statistics Modal */}
      {showStatsModal && (
        <StatisticsModal
          schedule={schedule}
          onClose={() => setShowStatsModal(false)}
          schoolProfile={currentSchool}
        />
      )}

      {/* School & Teachers & Assignment Command Manager Modal */}
      <SchoolManagerModal
        isOpen={showSchoolManagerModal}
        onClose={() => setShowSchoolManagerModal(false)}
        currentSchool={currentSchool}
        onSaveSchool={handleSaveSchool}
      />

      {/* Hard & Soft Constraints Modal */}
      <ConstraintsModal
        isOpen={showConstraintsModal}
        onClose={() => setShowConstraintsModal(false)}
        constraints={constraints}
        onSaveConstraints={handleSaveConstraints}
      />

      {/* Toast notifications */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200 ${
            toastMessage.type === 'error'
              ? 'bg-rose-900 text-white border-rose-800'
              : toastMessage.type === 'info'
              ? 'bg-blue-900 text-white border-blue-800'
              : 'bg-slate-900 text-white border-slate-800'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          ) : toastMessage.type === 'info' ? (
            <Info className="w-4 h-4 text-blue-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
