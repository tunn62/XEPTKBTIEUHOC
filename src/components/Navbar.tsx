import React from 'react';
import { SCHOOL_INFO } from '../data/initialData';
import { SchoolProfile } from '../types';
import {
  Calendar,
  Sparkles,
  FileSpreadsheet,
  BarChart3,
  Printer,
  RotateCcw,
  School,
  GraduationCap,
  Users,
  ShieldCheck,
  SlidersHorizontal,
  Settings,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'school' | 'class' | 'teacher' | 'auditor';
  onSelectView: (view: 'school' | 'class' | 'teacher' | 'auditor') => void;
  onSolveAgain: () => void;
  onExportExcel: () => void;
  onOpenStats: () => void;
  onOpenSchoolManager?: () => void;
  onOpenConstraintsManager?: () => void;
  isSolving: boolean;
  violationsCount: number;
  schoolProfile?: SchoolProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  onSolveAgain,
  onExportExcel,
  onOpenStats,
  onOpenSchoolManager,
  onOpenConstraintsManager,
  isSolving,
  violationsCount,
  schoolProfile,
}) => {
  const currentSchoolName = schoolProfile?.name || SCHOOL_INFO.name;
  const currentBranch = schoolProfile?.branch || SCHOOL_INFO.branch;
  const currentYear = schoolProfile?.academicYear || SCHOOL_INFO.academicYear;
  const classesCount = schoolProfile?.classes?.length || 10;

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with school title and main actions */}
        <div className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100">
          {/* School Name & Academic Year */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                  {currentSchoolName}
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-rose-100 text-rose-800">
                  {currentBranch}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  Năm học {currentYear}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium flex items-center gap-1.5">
                <span>{classesCount} Lớp học • Phân tiết GDPT 2018</span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {violationsCount === 0 ? 'CSP Solver: 0 Vi phạm' : `${violationsCount} Cần xem xét`}
                </span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center flex-wrap gap-2">
            {/* School & Teachers Command Button */}
            <button
              id="btn-open-school-manager"
              onClick={onOpenSchoolManager}
              className="px-3 py-2 rounded-lg border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
              title="Đổi trường học khác, thay đổi danh sách giáo viên và phân tiết giảng dạy"
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Đổi Trường & Phân Công GV</span>
            </button>

            {/* Hard & Soft Constraints Button */}
            <button
              id="btn-open-constraints-manager"
              onClick={onOpenConstraintsManager}
              className="px-3 py-2 rounded-lg border border-purple-200 bg-purple-50/80 hover:bg-purple-100 text-purple-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
              title="Cấu hình các nguyên tắc cứng (bắt buộc) và nguyên tắc mềm (sư phạm)"
            >
              <SlidersHorizontal className="w-4 h-4 text-purple-600" />
              <span>Nguyên Tắc Cứng & Mềm</span>
            </button>

            <button
              id="btn-csp-solve"
              onClick={onSolveAgain}
              disabled={isSolving}
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
              title="Khởi chạy bộ giải Constraint Satisfaction Problem (OR-Tools CP-SAT)"
            >
              <Sparkles className={`w-4 h-4 ${isSolving ? 'animate-spin' : ''}`} />
              <span>{isSolving ? 'Đang giải CSP...' : 'Tự Động Xếp (CP-SAT)'}</span>
            </button>

            <button
              id="btn-export-excel"
              onClick={onExportExcel}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
              title="Xuất file Excel .xlsx chuẩn khổ in A4 ngang với màu sắc theo quy chuẩn OpenPyXL"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xuất Excel (.xlsx)</span>
            </button>

            <button
              id="btn-stats"
              onClick={onOpenStats}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-slate-600" />
              <span>Thống Kê</span>
            </button>

            <button
              id="btn-print"
              onClick={() => window.print()}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="In bản thời khóa biểu trực tiếp"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">In TKB</span>
            </button>
          </div>
        </div>

        {/* View mode navigation tabs */}
        <div className="flex items-center justify-between py-2 overflow-x-auto">
          <nav className="flex items-center gap-1">
            <button
              id="nav-tab-school"
              onClick={() => onSelectView('school')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'school'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Toàn Trường ({classesCount} Lớp)</span>
            </button>

            <button
              id="nav-tab-class"
              onClick={() => onSelectView('class')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'class'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Xem Theo Từng Lớp</span>
            </button>

            <button
              id="nav-tab-teacher"
              onClick={() => onSelectView('teacher')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'teacher'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Xem Theo Giáo Viên</span>
            </button>

            <button
              id="nav-tab-auditor"
              onClick={() => onSelectView('auditor')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'auditor'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Giám Sát 6 Ràng Buộc CSP</span>
              {violationsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center">
                  {violationsCount}
                </span>
              )}
            </button>
          </nav>

          <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <span>32 tiết/tuần</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">Thứ 6 chiều nghỉ</span>
          </div>
        </div>
      </div>
    </header>
  );
};
