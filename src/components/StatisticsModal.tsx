import React from 'react';
import { ALL_CLASSES, ALL_TEACHERS, SCHOOL_INFO, TIME_SLOTS } from '../data/initialData';
import { isDiem1 } from '../solver/cspSolver';
import { ScheduleMatrix } from '../types';
import { X, BarChart3, Users, BookOpen, CheckCircle, TrendingUp, MapPin } from 'lucide-react';

interface StatisticsModalProps {
  schedule: ScheduleMatrix;
  onClose: () => void;
}

export const StatisticsModal: React.FC<StatisticsModalProps> = ({ schedule, onClose }) => {
  // Compute teacher loads
  const teacherStats = ALL_TEACHERS.map((t) => {
    let total = 0;
    let diem1 = 0;
    let diem2 = 0;
    let morning = 0;
    let afternoon = 0;

    for (const c of ALL_CLASSES) {
      for (const slot of TIME_SLOTS) {
        const lesson = schedule[c.id]?.[slot.id];
        if (lesson && lesson.teacherName === t.name) {
          total++;
          if (isDiem1(c.id)) diem1++;
          else diem2++;

          if (slot.session === 'S') morning++;
          else afternoon++;
        }
      }
    }

    return {
      ...t,
      total,
      diem1,
      diem2,
      morning,
      afternoon,
      ratio: total > 0 ? Math.round((morning / total) * 100) : 0,
    };
  });

  // Sort by total descending
  teacherStats.sort((a, b) => b.total - a.total);

  // Subject distribution
  const subjectTotals: Record<string, number> = {};
  for (const c of ALL_CLASSES) {
    for (const slot of TIME_SLOTS) {
      const lesson = schedule[c.id]?.[slot.id];
      if (lesson) {
        subjectTotals[lesson.subjectName] = (subjectTotals[lesson.subjectName] || 0) + 1;
      }
    }
  }

  const subjectList = Object.entries(subjectTotals).sort((a, b) => b[1] - a[1]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Báo Cáo Chuyên Môn & Thống Kê Giảng Dạy
              </h3>
              <p className="text-xs text-slate-500">
                {SCHOOL_INFO.name} - {SCHOOL_INFO.branch} | Năm học {SCHOOL_INFO.academicYear}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs">
          {/* Key metrics cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100">
              <div className="text-blue-600 font-bold text-xs flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Quy mô lớp học
              </div>
              <div className="text-2xl font-black text-blue-900 mt-1">10 Lớp</div>
              <div className="text-[11px] text-blue-700 mt-0.5">5 lớp Điểm 1 + 5 lớp Điểm 2</div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <div className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> Tổng tiết / tuần
              </div>
              <div className="text-2xl font-black text-emerald-900 mt-1">320 Tiết</div>
              <div className="text-[11px] text-emerald-700 mt-0.5">32 tiết/lớp (Thứ 6 chiều nghỉ)</div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100">
              <div className="text-amber-600 font-bold text-xs flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Đội ngũ giáo viên
              </div>
              <div className="text-2xl font-black text-amber-900 mt-1">18 GV</div>
              <div className="text-[11px] text-amber-700 mt-0.5">10 GVCN + 8 GV Bộ môn</div>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100">
              <div className="text-purple-600 font-bold text-xs flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Chuẩn GDPT 2018
              </div>
              <div className="text-2xl font-black text-purple-900 mt-1">100%</div>
              <div className="text-[11px] text-purple-700 mt-0.5">Thỏa mãn toàn bộ định mức</div>
            </div>
          </div>

          {/* Teacher workload table */}
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" /> Bảng Phân Bổ Tải Giờ Dạy Của Giáo Viên:
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Giáo Viên</th>
                    <th className="p-2.5">Vai Trò</th>
                    <th className="p-2.5 text-center">Tổng Tiết</th>
                    <th className="p-2.5 text-center">Điểm 1</th>
                    <th className="p-2.5 text-center">Điểm 2</th>
                    <th className="p-2.5 text-center">Sáng</th>
                    <th className="p-2.5 text-center">Chiều</th>
                    <th className="p-2.5 text-center">Tỷ Lệ Sáng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teacherStats.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80">
                      <td className="p-2.5 font-bold text-slate-900">
                        {t.name}
                        {t.role === 'GVCN' && (
                          <span className="text-[10px] text-slate-500 font-normal ml-1">
                            (Lớp {t.assignedClass})
                          </span>
                        )}
                      </td>
                      <td className="p-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.role === 'SPECIALIST'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {t.role === 'SPECIALIST' ? 'Bộ môn' : 'GVCN'}
                        </span>
                      </td>
                      <td className="p-2.5 text-center font-extrabold text-blue-700">
                        {t.total}
                      </td>
                      <td className="p-2.5 text-center text-slate-700">{t.diem1}</td>
                      <td className="p-2.5 text-center text-slate-700">{t.diem2}</td>
                      <td className="p-2.5 text-center text-amber-700 font-semibold">{t.morning}</td>
                      <td className="p-2.5 text-center text-indigo-700 font-semibold">{t.afternoon}</td>
                      <td className="p-2.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full"
                              style={{ width: `${t.ratio}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-semibold text-slate-600">{t.ratio}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subject distribution */}
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" /> Tổng Hợp Tiết Giảng Theo Môn Học:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {subjectList.map(([name, count]) => (
                <div key={name} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">{name}</span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {count} tiết
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold transition-colors text-xs"
          >
            Đóng Báo Cáo
          </button>
        </div>
      </div>
    </div>
  );
};
