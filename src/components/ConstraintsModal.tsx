import React, { useState } from 'react';
import { ConstraintConfig } from '../types';
import { DEFAULT_CONSTRAINTS } from '../data/schoolPresets';
import {
  SlidersHorizontal,
  X,
  ShieldCheck,
  Sparkles,
  Check,
  RotateCcw,
  AlertTriangle,
  Info,
  Clock,
  Sun,
  BookOpen,
  Coffee,
  School,
  Monitor,
  HeartHandshake,
} from 'lucide-react';

interface ConstraintsModalProps {
  isOpen: boolean;
  onClose: () => void;
  constraints: ConstraintConfig;
  onSaveConstraints: (newConstraints: ConstraintConfig) => void;
  onResetStandard: () => void;
}

export const ConstraintsModal: React.FC<ConstraintsModalProps> = ({
  isOpen,
  onClose,
  constraints: initialConstraints,
  onSaveConstraints,
  onResetStandard,
}) => {
  const [activeTab, setActiveTab] = useState<'hard' | 'soft'>('hard');
  const [localConstraints, setLocalConstraints] = useState<ConstraintConfig>(
    JSON.parse(JSON.stringify(initialConstraints))
  );

  // Synchronize when opening
  React.useEffect(() => {
    setLocalConstraints(JSON.parse(JSON.stringify(initialConstraints)));
  }, [initialConstraints, isOpen]);

  if (!isOpen) return null;

  const hard = localConstraints.hard;
  const soft = localConstraints.soft;

  const updateHard = (key: keyof typeof hard, value: any) => {
    setLocalConstraints(prev => ({
      ...prev,
      hard: {
        ...prev.hard,
        [key]: value,
      },
    }));
  };

  const updateSoft = (key: keyof typeof soft, value: any) => {
    setLocalConstraints(prev => ({
      ...prev,
      soft: {
        ...prev.soft,
        [key]: value,
      },
    }));
  };

  const handleApply = () => {
    onSaveConstraints(localConstraints);
    onClose();
  };

  const handleReset = () => {
    setLocalConstraints(JSON.parse(JSON.stringify(DEFAULT_CONSTRAINTS)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div
        id="constraints-modal-content"
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-md">
              <SlidersHorizontal className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Cấu Hình Nguyên Tắc Cứng & Mềm (CSP Rules)</h2>
              <p className="text-xs text-blue-100 font-normal">
                Tùy biến các quy tắc bắt buộc và nguyên tắc sư phạm tối ưu hóa thời khóa biểu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('hard')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'hard'
                ? 'bg-white text-rose-700 border-rose-600 shadow-2xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            <span>Nguyên Tắc Cứng (Hard Constraints)</span>
            <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold">
              {Object.values(hard).filter(v => v === true).length} Bật
            </span>
          </button>

          <button
            onClick={() => setActiveTab('soft')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'soft'
                ? 'bg-white text-blue-700 border-blue-600 shadow-2xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Nguyên Tắc Mềm & Sư Phạm (Soft Constraints)</span>
            <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold">
              {Object.values(soft).filter(v => v === true).length} Bật
            </span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'hard' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80 text-rose-900 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Nguyên tắc cứng (Hard Constraints):</span> Các điều kiện tiên quyết
                  bắt buộc thuật toán CSP phải thỏa mãn 100%. Nếu vi phạm, thời khóa biểu sẽ không thể triển khai được
                  hoặc gây xung đột giáo viên và phòng học.
                </div>
              </div>

              {/* Rule 1: No teacher collision */}
              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">1. Không trùng giờ giáo viên (0 Teacher Collision)</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded-md">Bắt buộc</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Tuyệt đối không xếp một giáo viên dạy 2 lớp khác nhau tại cùng một tiết học.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hard.noTeacherCollision}
                      onChange={e => updateHard('noTeacherCollision', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>
              </div>

              {/* Rule 2: Fixed Monday Flag Salute */}
              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">2. Chào cờ (SHDC) cố định Sáng Thứ Hai Tiết 1</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded-md">Bắt buộc</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Toàn trường đồng loạt tham gia Sinh hoạt Dưới cờ vào Tiết 1 Thứ Hai do Giáo viên Chủ nhiệm (GVCN) phụ trách.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hard.fixedMondayFlagSalute}
                      onChange={e => updateHard('fixedMondayFlagSalute', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>
              </div>

              {/* Rule 3: Fixed Friday Class Activity */}
              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">3. Sinh hoạt Lớp (SHL) cố định Sáng Thứ Sáu Tiết 4</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded-md">Bắt buộc</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Tổng kết tuần học và định hướng tuần tiếp theo, do GVCN của từng lớp thực hiện vào tiết cuối sáng Thứ Sáu.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hard.fixedFridayClassActivity}
                      onChange={e => updateHard('fixedFridayClassActivity', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>
              </div>

              {/* Rule 4: Full 32 periods quota */}
              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">4. Đảm bảo đúng 100% định mức 32 tiết/tuần/lớp</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded-md">Quy chuẩn</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Không để trống tiết học nào trong 32 tiết học chính khóa (Sáng 4 tiết x 5 ngày = 20 tiết, Chiều 3 tiết x 4 ngày = 12 tiết).
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hard.strictQuotaFulfilled}
                      onChange={e => updateHard('strictQuotaFulfilled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>
              </div>

              {/* Rule 5: Friday Afternoon Off */}
              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">5. Nghỉ Chiều Thứ Sáu sinh hoạt chuyên môn toàn trường</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-md">Quy định</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Khóa 3 tiết chiều Thứ Sáu để nhà trường tổ chức họp Hội đồng Sư phạm và sinh hoạt chuyên môn theo tổ khối.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hard.fridayAfternoonOff}
                      onChange={e => updateHard('fridayAfternoonOff', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>
              </div>

              {/* Rule 6: Limit BGH Quota */}
              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">6. Giới hạn định mức tiết dạy Ban Giám Hiệu (BGH)</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-800 rounded-md">Chính sách</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Phó Hiệu trưởng (Thầy Quan) chỉ dạy tối đa đúng 2 tiết Đạo đức Khối 5 theo quy định quản lý.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hard.limitBghQuota}
                      onChange={e => updateHard('limitBghQuota', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>
                {hard.limitBghQuota && (
                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600">Tên cán bộ BGH:</label>
                      <input
                        type="text"
                        value={hard.bghTeacherName || 'Quan'}
                        onChange={e => updateHard('bghTeacherName', e.target.value)}
                        className="mt-1 w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600">Số tiết tối đa:</label>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={hard.bghMaxPeriods ?? 2}
                        onChange={e => updateHard('bghMaxPeriods', parseInt(e.target.value) || 2)}
                        className="mt-1 w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600">Mã môn phụ trách:</label>
                      <input
                        type="text"
                        value={hard.bghSubjectCode || 'DD'}
                        onChange={e => updateHard('bghSubjectCode', e.target.value)}
                        className="mt-1 w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Rule 7: Max Computer Lab */}
              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">7. Giới hạn số phòng máy Tin học đồng thời</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-md">Cơ sở vật chất</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Số lớp được xếp học Tin học tại cùng một thời điểm không được vượt quá số phòng thực hành máy tính của trường.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600">Số phòng:</span>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={hard.maxComputerRoomSimultaneous}
                      onChange={e => updateHard('maxComputerRoomSimultaneous', parseInt(e.target.value) || 1)}
                      className="w-16 text-center text-xs font-bold px-2 py-1.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'soft' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 text-blue-900 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Nguyên tắc mềm & sư phạm (Soft Constraints):</span> Các tiêu chí tối
                  ưu hóa chất lượng giờ học, tâm sinh lý lứa tuổi học sinh tiểu học và sức khỏe nghề nghiệp của giáo viên.
                  Thuật toán CSP sẽ gán trọng số ưu tiên tối đa cho các tiêu chí này.
                </div>
              </div>

              {/* Soft 1: Morning Core Subjects */}
              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">1. Ưu tiên Toán & Tiếng Việt vào các tiết buổi sáng</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-md">Sư phạm vàng</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Ưu tiên xếp môn Toán và Tiếng Việt vào Tiết 1, 2, 3 buổi sáng khi não bộ học sinh tỉnh táo và tiếp thu tốt nhất.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={soft.prioritizeMorningCoreSubjects}
                      onChange={e => updateSoft('prioritizeMorningCoreSubjects', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Soft 2: Avoid Noon PE */}
              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">2. Tránh xếp Thể dục (GDTC) vào tiết trưa nắng nóng</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md">Sức khỏe học đường</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Tránh xếp môn Giáo dục thể chất vào Tiết 4 buổi sáng (10h trưa) hoặc Tiết 3 buổi chiều khi thời tiết nắng gắt ngoài sân trường.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={soft.avoidNoonPE}
                      onChange={e => updateSoft('avoidNoonPE', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Soft 3: Avoid Monday Period 1 PE */}
              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">3. Tránh xếp Thể dục ngay sau giờ Chào cờ đầu tuần</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-800 rounded-md">Tâm lý học đường</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Sau khi đứng chào cờ dưới sân trường, học sinh cần ổn định trong lớp với các tiết học văn hóa nhẹ nhàng thay vì vận động mạnh.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={soft.avoidMondayPeriod1PE}
                      onChange={e => updateSoft('avoidMondayPeriod1PE', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Soft 4: Spread Subjects Evenly */}
              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">4. Rải đều các môn học trong tuần (Tránh dồn ép)</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-md">Cân đối</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Phân bổ đều các môn 2 tiết/tuần (Tin học, Thể dục, Tiếng Anh) sang các ngày cách nhật, tránh dồn nhiều tiết vào một ngày.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={soft.spreadSubjectsEvenly}
                      onChange={e => updateSoft('spreadSubjectsEvenly', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Soft 5: Minimize Teacher Gaps */}
              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">5. Giảm thiểu tiết trống (lủng tiết) của giáo viên</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-md">Tiện ích giáo viên</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Xếp các tiết dạy của mỗi giáo viên liền mạch trong buổi học, tránh tình trạng dạy tiết 1 rồi nghỉ tiết 2 sau đó lại dạy tiết 3.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={soft.minimizeTeacherGaps}
                      onChange={e => updateSoft('minimizeTeacherGaps', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Soft 6: Max Periods Per Session */}
              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">6. Giới hạn số tiết tối đa trong 1 buổi của giáo viên</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-violet-100 text-violet-800 rounded-md">Bảo vệ sức khỏe</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Khuyến nghị giáo viên không dạy quá 4 tiết trong một buổi để giữ gìn giọng nói và thể lực.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600">Tối đa:</span>
                    <input
                      type="number"
                      min="3"
                      max="5"
                      value={soft.maxPeriodsPerSessionPerTeacher}
                      onChange={e => updateSoft('maxPeriodsPerSessionPerTeacher', parseInt(e.target.value) || 4)}
                      className="w-16 text-center text-xs font-bold px-2 py-1.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                    />
                    <span className="text-xs text-slate-500">tiết/buổi</span>
                  </div>
                </div>
              </div>

              {/* Soft 7: Double Periods For Reading */}
              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">7. Ưu tiên tiết đôi (liền kề) cho phân môn Tập đọc & Mỹ thuật</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-100 text-teal-800 rounded-md">Chuyên môn</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Cho phép ghép cặp 2 tiết Tiếng Việt liền nhau (như sáng Thứ 4) để thực hành bài đọc dài hoặc bài thực hành Mỹ thuật trọn vẹn.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={soft.allowDoublePeriodsForReading}
                      onChange={e => updateSoft('allowDoublePeriodsForReading', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Soft 8: GVCN Afternoon Off Allowance */}
              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">8. GVCN được nghỉ ít nhất 1 - 2 buổi chiều trong tuần</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-pink-100 text-pink-800 rounded-md">Quyền lợi GVCN</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Sắp xếp để các Giáo viên Chủ nhiệm có từ 1 đến 2 buổi chiều không có tiết dạy (Thứ 2 đến Thứ 5) để chấm bài và chuẩn bị giáo án.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={soft.gvcnAfternoonOffAllowance}
                      onChange={e => updateSoft('gvcnAfternoonOffAllowance', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi Phục Chuẩn Mặc Định</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              id="btn-save-constraints"
              onClick={handleApply}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md active:scale-98 flex items-center justify-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Lưu & Áp Dụng Nguyên Tắc Mới</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
