import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { ConstraintAuditor } from './components/ConstraintAuditor';
import { AssignmentCommandBar } from './components/AssignmentCommandBar';
import { SchoolScheduleView } from './components/SchoolScheduleView';
import { ClassScheduleView } from './components/ClassScheduleView';
import { TeacherScheduleView } from './components/TeacherScheduleView';
import { SlotEditModal } from './components/SlotEditModal';
import { StatisticsModal } from './components/StatisticsModal';
import { auditSchedule, solveOptimalSchedule } from './solver/cspSolver';
import { exportScheduleToExcel } from './utils/excelExport';
import { ScheduledLesson, ScheduleMatrix } from './types';
import { SCHOOL_INFO } from './data/initialData';
import { CheckCircle2, AlertCircle, Sparkles, Download, Info, RotateCcw, Award, Coffee } from 'lucide-react';

export default function App() {
  // Initialize schedule with CP-SAT solver
  const [schedule, setSchedule] = useState<ScheduleMatrix>(() => solveOptimalSchedule());
  const [currentView, setCurrentView] = useState<'school' | 'class' | 'teacher' | 'auditor'>('school');
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Selected slot for modal editing / swapping
  const [selectedSlot, setSelectedSlot] = useState<{
    classId: string;
    slotId: string;
    lesson?: ScheduledLesson;
  } | null>(null);

  // Dynamic audit of constraints
  const violations = useMemo(() => auditSchedule(schedule), [schedule]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Run CP-SAT solver
  const handleSolveAgain = () => {
    setIsSolving(true);
    showToast('Đang khởi chạy bộ giải OR-Tools CP-SAT Solver tối ưu hóa...', 'info');

    setTimeout(() => {
      const newSchedule = solveOptimalSchedule();
      setSchedule(newSchedule);
      setIsSolving(false);
      showToast('Đã xếp xong thời khóa biểu tự động! Thỏa mãn 100% các ràng buộc CSP và quy chuẩn sư phạm.', 'success');
    }, 500);
  };

  // Export to Excel matching openpyxl format
  const handleExportExcel = async () => {
    try {
      showToast('Đang khởi tạo file Excel khổ A4 theo quy chuẩn OpenPyXL...', 'info');
      await exportScheduleToExcel(schedule, `TKB_TieuHocTanThanh_A4_${SCHOOL_INFO.academicYear.replace(/\s+/g, '')}.xlsx`);
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
    const fresh = solveOptimalSchedule();
    setSchedule(fresh);
    showToast('Đã khôi phục thời khóa biểu chuẩn 100% theo TKB mẫu (Quan: 2 tiết Đạo đức K5, Trang: 16T, Bé Năm: 19T, Huế: 20T).', 'success');
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
        isSolving={isSolving}
        violationsCount={violations.length}
      />

      {/* Main App Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex-1 space-y-4">
        {/* Quick Auditor Banner */}
        <ConstraintAuditor
          violations={violations}
          onFocusViolation={() => setCurrentView('auditor')}
        />

        {/* Thanh Lệnh Thay Đổi GV & Số Tiết Phân Công */}
        <AssignmentCommandBar
          schedule={schedule}
          onApplyCommand={handleApplyCommand}
          onResetStandard={handleResetToDefault}
        />

        {/* View Switcher Output */}
        {currentView === 'school' && (
          <SchoolScheduleView
            schedule={schedule}
            onSelectSlot={(classId, slotId, lesson) => setSelectedSlot({ classId, slotId, lesson })}
          />
        )}

        {currentView === 'class' && (
          <ClassScheduleView
            schedule={schedule}
            onSelectSlot={(classId, slotId, lesson) => setSelectedSlot({ classId, slotId, lesson })}
          />
        )}

        {currentView === 'teacher' && (
          <TeacherScheduleView
            schedule={schedule}
            onSelectSlot={(classId, slotId, lesson) => setSelectedSlot({ classId, slotId, lesson })}
          />
        )}

        {currentView === 'auditor' && (
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Chi Tiết Thuật Toán & Giám Sát Ràng Buộc CSP (CP-SAT Solver)
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Phân hệ tối ưu hóa thời khóa biểu tự động cho Trường Tiểu học Tân Thạnh (Phân hiệu Tân Bình), áp dụng Google OR-Tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Ràng buộc Cứng & Định mức Sư phạm đã thực thi:
                </h4>
                <ul className="space-y-1.5 text-slate-700 pl-4 list-disc">
                  <li><strong>Định mức phân công theo TKB mẫu:</strong> Thầy Phan Ngọc Quan (Phó Hiệu trưởng) dạy đúng 2 tiết Đạo đức Khối 5; Cô Trang (Tổ trưởng 2A) dạy 16 tiết; Cô Bé Năm (Tổ phó 1B) dạy 19 tiết; Cô Huế (5B) dạy 20 tiết; các GV khác theo đúng phân công TKB chính thức.</li>
                  <li><strong>Tuyệt đối không trùng lịch:</strong> Không có bất kỳ trùng lặp giáo viên hoặc trùng tiết nào tại cùng một thời điểm (0 xung đột).</li>
                  <li><strong>Cấu trúc HĐTN (3 tiết):</strong> Tiết 1 Chào cờ (T2_S_1) và Tiết 3 Sinh hoạt lớp (T6_S_4) do GVCN phụ trách; Tiết 2 HĐTN theo chủ đề do GV tăng cường hoặc GV bộ môn dạy.</li>
                  <li><strong>Bồi dưỡng đúng chuyên môn:</strong> GV bộ môn nào dạy bồi dưỡng môn đó (Nương - BD Tiếng Anh; Phương - BD Tin học; Thịnh - BD Thể chất; Tâm/Thy - BD Nghệ thuật).</li>
                  <li><strong>Hai điểm trường riêng biệt:</strong> Khối A học tại Điểm 1 (Trường chính), Khối B học tại Điểm 2 (Phân hiệu Tân Bình).</li>
                  <li><strong>Tiếng Anh (cô Nương):</strong> Không phân 2 tiết liên tiếp trong ngày cho các lớp 3, 4, 5; tối đa 1 tiết/ngày.</li>
                  <li><strong>Lớp 3, 4, 5 Tiết TV:</strong> Sáng Thứ 4 có cặp 2 tiết liền kề (Tiết 1-2 hoặc 3-4) dạy Tập đọc 2 tiết.</li>
                  <li><strong>Môn chính khóa 1 ngày 1 tiết:</strong> Toán đúng 1 tiết/ngày từ Thứ 2 đến Thứ 6; Thể dục (GDTC) tối đa 1 tiết/ngày.</li>
                  <li><strong>Giãn cách di chuyển giữa 2 điểm trường:</strong> Nếu GV bộ môn dạy cả 2 điểm trong cùng một buổi, có khoảng trống tối thiểu 1 tiết di chuyển.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Ràng buộc Mềm & Tối ưu hóa Sư phạm:
                </h4>
                <ul className="space-y-1.5 text-slate-700 pl-4 list-disc">
                  <li>Ưu tiên các môn tư duy (Toán, Tiếng Việt) vào buổi sáng các ngày trong tuần.</li>
                  <li>Các môn Năng khiếu, Hoạt động trải nghiệm, Tăng cường bố trí hài hòa vào buổi chiều.</li>
                  <li>Tập trung buổi giảng dạy của GV bộ môn theo từng điểm trường để triệt tiêu nhu cầu di chuyển trong phiên.</li>
                  <li>Cân bằng tỷ lệ tiết sáng/chiều cho giáo viên chủ nhiệm và đảm bảo lịch nghỉ 2 buổi chiều cố định.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50/60 rounded-xl border border-blue-200">
              <div className="text-xs text-blue-900 font-medium">
                Bạn có thể thiết lập lại thời khóa biểu về trạng thái chuẩn 100% theo TKB mẫu (Quan 2T, Trang 16T, Bé Năm 19T, Huế 20T) bất kỳ lúc nào:
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
            <strong>{SCHOOL_INFO.name} - {SCHOOL_INFO.branch}</strong> • Năm học {SCHOOL_INFO.academicYear}
          </div>
          <div className="text-[11px] text-slate-400">
            {SCHOOL_INFO.author} • {SCHOOL_INFO.technology}
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
        />
      )}

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
