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
import { ConstraintConfig, ConstraintViolation, SchoolProfile } from '../types';
import { SlidersHorizontal, Settings } from 'lucide-react';

interface ConstraintAuditorProps {
  violations: ConstraintViolation[];
  onFocusViolation?: (violation: ConstraintViolation) => void;
  constraints?: ConstraintConfig;
  onOpenConstraintsManager?: () => void;
  schoolProfile?: SchoolProfile;
}

export const ConstraintAuditor: React.FC<ConstraintAuditorProps> = ({
  violations,
  onFocusViolation,
  constraints,
  onOpenConstraintsManager,
  schoolProfile,
}) => {
  const hardViolations = violations.filter(v => v.type === 'HARD');
  const softViolations = violations.filter(v => v.type === 'SOFT');
  const isPerfect = violations.length === 0;

  const constraintRules = [
    {
      id: 'MASTER_BLUEPRINT_SYNC',
      title: 'Đồng bộ 100% Phân bổ Chuẩn',
      desc: 'Toàn bộ các tiết học được phân bổ chính xác theo thời khóa biểu mẫu và ma trận phân công của trường.',
      icon: <Award className="w-4 h-4 text-blue-600" />,
      active: true,
      hasViolation: violations.some(v => v.code === 'MISSING_SLOTS'),
    },
    {
      id: 'PHT_QUAN_POLICY',
      title: 'PHT Quan dạy đúng 2 tiết Đạo đức',
      desc: 'Thầy Phan Ngọc Quan (Phó Hiệu trưởng) chỉ dạy 2 tiết Đạo đức khối 5 (5A và 5B).',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      active: constraints ? constraints.hard.quanMoralOnly : true,
      hasViolation: violations.some(v => v.code === 'QUAN_POLICY_VIOLATION' || v.code === 'QUAN_INVALID_ASSIGNMENT'),
    },
    {
      id: 'TEACHER_COLLISION',
      title: 'Không trùng giờ, trùng lớp',
      desc: 'Mỗi lớp tại 1 tiết chỉ có đúng 1 GV; 1 GV tại 1 thời điểm chỉ dạy tối đa 1 lớp (0 xung đột giáo viên).',
      icon: <Clock className="w-4 h-4 text-emerald-600" />,
      active: constraints ? constraints.hard.noTeacherCollision : true,
      hasViolation: violations.some(v => v.code === 'TEACHER_COLLISION'),
    },
    {
      id: 'NO_CLASS_COLLISION',
      title: 'Không trùng tiết của lớp',
      desc: 'Mỗi lớp tại một tiết thời khóa biểu chỉ học đúng 1 môn duy nhất.',
      icon: <ShieldCheck className="w-4 h-4 text-indigo-600" />,
      active: constraints ? constraints.hard.noClassCollision : true,
      hasViolation: violations.some(v => v.code === 'CLASS_COLLISION'),
    },
    {
      id: 'OFFICIAL_QUOTAS',
      title: 'Tuân thủ định mức tiết dạy',
      desc: 'Phân công đúng định mức tiết dạy của giáo viên theo bảng phân tiết.',
      icon: <ShieldCheck className="w-4 h-4 text-indigo-600" />,
      active: constraints ? constraints.soft.respectTeacherQuota : true,
      hasViolation: violations.some(v => v.code === 'QUOTA_EXCEEDED'),
    },
    {
      id: 'AFTERNOONS_OFF',
      title: 'Nghỉ 2 buổi chiều (Thứ 2 - Thứ 5)',
      desc: 'Học sinh tiểu học được bố trí nghỉ 2 buổi chiều trong tuần để đảm bảo thời lượng GDPT 2018.',
      icon: <Coffee className="w-4 h-4 text-amber-600" />,
      active: constraints ? constraints.soft.twoAfternoonsOff : true,
      hasViolation: violations.some(v => v.code === 'AFTERNOON_OFF_VIOLATION'),
    },
    {
      id: 'CAMPUS_SEGREGATION',
      title: 'Phân định điểm trường',
      desc: 'Học sinh học đúng điểm trường cơ sở chính hoặc phân hiệu, giảm di chuyển giáo viên trong buổi.',
      icon: <MapPin className="w-4 h-4 text-rose-600" />,
      active: constraints ? constraints.hard.campusSegregation : true,
      hasViolation: violations.some(v => v.code === 'CAMPUS_VIOLATION'),
    },
    {
      id: 'FRIDAY_AFTERNOON_OFF',
      title: 'Chiều Thứ 6 sinh hoạt chuyên môn',
      desc: 'Chiều Thứ 6 toàn trường nghỉ để tổ chức sinh hoạt chuyên môn, họp hội đồng sư phạm.',
      icon: <Coffee className="w-4 h-4 text-purple-600" />,
      active: constraints ? constraints.hard.fridayAfternoonOff : true,
      hasViolation: violations.some(v => v.code === 'FRIDAY_AFTERNOON_VIOLATION'),
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

        <div className="flex items-center gap-2 flex-wrap text-xs font-medium">
          {onOpenConstraintsManager && (
            <button
              onClick={onOpenConstraintsManager}
              className="flex items-center gap-1.5 text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors font-semibold"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Cấu hình Nguyên Tắc</span>
            </button>
          )}
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
