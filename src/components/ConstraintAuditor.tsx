import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ArrowRightLeft,
  Clock,
  BookOpen,
  MapPin,
  Calendar,
  Coffee,
  Sparkles,
  Award,
} from 'lucide-react';
import { ConstraintViolation } from '../types';

interface ConstraintAuditorProps {
  violations: ConstraintViolation[];
  onFocusViolation?: (violation: ConstraintViolation) => void;
}

export const ConstraintAuditor: React.FC<ConstraintAuditorProps> = ({ violations, onFocusViolation }) => {
  const hardViolations = violations.filter(v => v.type === 'HARD');
  const softViolations = violations.filter(v => v.type === 'SOFT');
  const isPerfect = violations.length === 0;

  const constraintRules = [
    {
      id: 'MASTER_BLUEPRINT_SYNC',
      title: 'Đồng bộ 100% TKB Mẫu mới tải lên',
      desc: 'Toàn bộ 320 tiết học được phân bổ chính xác theo thời khóa biểu mẫu chính thức (Tuần 1: 07-11/9/2026).',
      icon: <Award className="w-4 h-4 text-blue-600" />,
      hasViolation: violations.some(v => v.code === 'MISSING_SLOTS'),
    },
    {
      id: 'PHT_QUAN_POLICY',
      title: 'PHT Quan dạy đúng 2 tiết Đạo đức Khối 5',
      desc: 'Thầy Phan Ngọc Quan (Phó Hiệu trưởng) chỉ dạy 2 tiết Đạo đức tại 5A (T2_C_1) và 5B (T2_C_3).',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      hasViolation: violations.some(v => v.code === 'QUAN_POLICY_VIOLATION' || v.code === 'QUAN_INVALID_ASSIGNMENT'),
    },
    {
      id: 'TEACHER_COLLISION',
      title: 'Không trùng giờ, trùng lớp',
      desc: 'Mỗi lớp tại 1 tiết chỉ có đúng 1 GV; 1 GV tại 1 thời điểm chỉ dạy tối đa 1 lớp (0 xung đột).',
      icon: <Clock className="w-4 h-4 text-emerald-600" />,
      hasViolation: violations.some(v => v.code === 'TEACHER_COLLISION'),
    },
    {
      id: 'OFFICIAL_QUOTAS',
      title: 'Định mức phân công chuyên môn',
      desc: 'Phân công đúng số tiết của giáo viên: Trang (16T), Bé Năm (19T), Huế (20T), các GV khác theo đúng TKB mẫu.',
      icon: <ShieldCheck className="w-4 h-4 text-indigo-600" />,
      hasViolation: false,
    },
    {
      id: 'CAMPUS_SEGREGATION',
      title: 'Hai Điểm trường (Điểm 1 & Điểm 2)',
      desc: 'Khối A học tại Điểm 1 (Trường chính), Khối B học tại Điểm 2 (Phân hiệu Tân Bình).',
      icon: <MapPin className="w-4 h-4 text-rose-600" />,
      hasViolation: false,
    },
    {
      id: 'FRIDAY_AFTERNOON_OFF',
      title: 'Thứ 6 Chiều nghỉ toàn trường',
      desc: 'Chiều Thứ 6 toàn trường nghỉ theo quy định sinh hoạt chuyên môn của Tiểu học Tân Thạnh.',
      icon: <Coffee className="w-4 h-4 text-amber-600" />,
      hasViolation: false,
    },
  ];

  return (
    <div id="constraint-auditor-panel" className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isPerfect ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {isPerfect ? <ShieldCheck className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-base">Bộ Giám Sát Ràng Buộc CSP & Quy Chuẩn Sư Phạm</h3>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${isPerfect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {isPerfect ? '100% HỢP LỆ (0 Xung đột)' : `${violations.length} VI PHẠM`}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kiểm định tự động: Định mức GVCN (Trang 17T, Bé Năm 18T, GVCN khác 19T) • 2 chiều nghỉ • HĐTN 3 tiết • Không trùng tiết
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-100">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ràng buộc cứng: <strong>{hardViolations.length === 0 ? 'Thỏa mãn 100%' : `${hardViolations.length} Lỗi`}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100">
            <span>Ràng buộc mềm: <strong>{softViolations.length === 0 ? 'Tối ưu' : `${softViolations.length} Lưu ý`}</strong></span>
          </div>
        </div>
      </div>

      {/* Grid of 8 pedagogical constraints */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {constraintRules.map((rule) => {
          const statusOk = !rule.hasViolation;
          return (
            <div
              key={rule.id}
              className={`p-3 rounded-lg border transition-all ${
                statusOk
                  ? 'bg-slate-50/70 border-slate-200/70 hover:bg-slate-50'
                  : 'bg-rose-50/50 border-rose-200 hover:bg-rose-50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1 rounded-md bg-white border border-slate-200/60 shadow-2xs shrink-0">
                    {rule.icon}
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 truncate">{rule.title}</h4>
                </div>
                {statusOk ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                    <CheckCircle2 className="w-3 h-3" /> Đạt
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded shrink-0">
                    <AlertCircle className="w-3 h-3" /> Lỗi
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                {rule.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Detailed violations list if any */}
      {violations.length > 0 && (
        <div className="mt-4 p-3 bg-rose-50/80 rounded-lg border border-rose-200 text-xs">
          <div className="font-bold text-rose-800 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Danh sách vi phạm cần điều chỉnh:
          </div>
          <ul className="space-y-1 text-rose-700 pl-4 list-disc">
            {violations.map((v) => (
              <li key={v.id} className="cursor-pointer hover:underline" onClick={() => onFocusViolation?.(v)}>
                <span className="font-semibold">[{v.title}]</span> {v.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
