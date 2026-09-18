import React, { useState } from 'react';
import { ALL_CLASSES, CLASSES_DIEM1, CLASSES_DIEM2, SUBJECTS, TIME_SLOTS } from '../data/initialData';
import { ScheduledLesson, ScheduleMatrix } from '../types';
import { Filter, Eye, Sparkles, Building2, School } from 'lucide-react';

interface SchoolScheduleViewProps {
  schedule: ScheduleMatrix;
  onSelectSlot: (classId: string, slotId: string, lesson?: ScheduledLesson) => void;
  highlightedTeacher?: string | null;
}

export const SchoolScheduleView: React.FC<SchoolScheduleViewProps> = ({
  schedule,
  onSelectSlot,
  highlightedTeacher,
}) => {
  const [campusFilter, setCampusFilter] = useState<'all' | 'diem1' | 'diem2'>('all');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  const visibleClasses =
    campusFilter === 'diem1'
      ? CLASSES_DIEM1
      : campusFilter === 'diem2'
      ? CLASSES_DIEM2
      : ALL_CLASSES;

  const days = [2, 3, 4, 5, 6];

  // Helper for cell styles matching openpyxl specifications:
  // TA: FEF08A (Vàng nhạt), TH: BAE6FD (Xanh dương nhạt), ART: FBCFE8 (Hồng), PE: BBF7D0 (Xanh lá), TC: FED7AA (Cam), OFF: 15803D (Xanh đậm)
  const getCellClasses = (lesson?: ScheduledLesson) => {
    if (!lesson) return 'bg-slate-50 text-slate-400 border-slate-200';

    const isMatchTeacher = highlightedTeacher && lesson.teacherName === highlightedTeacher;
    const isMatchSubject = selectedSubjectFilter !== 'all' && lesson.subjectCode === selectedSubjectFilter;

    let baseBg = 'bg-slate-50 text-slate-800 border-slate-200';

    switch (lesson.category) {
      case 'TA':
        baseBg = 'bg-[#FEF08A]/80 hover:bg-[#FEF08A] text-yellow-900 border-yellow-300';
        break;
      case 'TH':
        baseBg = 'bg-[#BAE6FD]/80 hover:bg-[#BAE6FD] text-sky-900 border-sky-300';
        break;
      case 'ART':
        baseBg = 'bg-[#FBCFE8]/80 hover:bg-[#FBCFE8] text-pink-900 border-pink-300';
        break;
      case 'PE':
        baseBg = 'bg-[#BBF7D0]/80 hover:bg-[#BBF7D0] text-emerald-900 border-emerald-300';
        break;
      case 'TC':
        baseBg = 'bg-[#FED7AA]/80 hover:bg-[#FED7AA] text-amber-950 border-orange-300';
        break;
      case 'ACTIVITY':
        baseBg = 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300';
        break;
      case 'MAIN':
      default:
        if (lesson.subjectCode === 'TOAN') {
          baseBg = 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-200';
        } else if (lesson.subjectCode === 'TV') {
          baseBg = 'bg-rose-50 hover:bg-rose-100 text-rose-900 border-rose-200';
        } else if (lesson.subjectCode === 'TNXH' || lesson.subjectCode === 'KH') {
          baseBg = 'bg-teal-50 hover:bg-teal-100 text-teal-900 border-teal-200';
        } else if (lesson.subjectCode === 'LS_DL') {
          baseBg = 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200';
        } else if (lesson.subjectCode === 'DD') {
          baseBg = 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200';
        } else {
          baseBg = 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200';
        }
        break;
    }

    if (highlightedTeacher || selectedSubjectFilter !== 'all') {
      if (isMatchTeacher || isMatchSubject) {
        return `${baseBg} ring-2 ring-blue-600 font-bold scale-[1.02] shadow-sm z-10`;
      } else {
        return `${baseBg} opacity-35`;
      }
    }

    return baseBg;
  };

  return (
    <div id="school-schedule-view" className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Controls and filters */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Điểm trường:
          </span>
          <div className="inline-flex p-0.5 rounded-lg bg-slate-200/70 text-xs font-semibold">
            <button
              id="filter-all-campuses"
              onClick={() => setCampusFilter('all')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                campusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <School className="w-3.5 h-3.5 text-blue-600" /> Cả 2 Điểm (10 Lớp)
            </button>
            <button
              id="filter-diem1"
              onClick={() => setCampusFilter('diem1')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                campusFilter === 'diem1'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" /> Điểm Chính (1A - 5A)
            </button>
            <button
              id="filter-diem2"
              onClick={() => setCampusFilter('diem2')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                campusFilter === 'diem2'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-rose-600" /> Phân Hiệu Tân Bình (1B - 5B)
            </button>
          </div>
        </div>

        {/* Legend color indicators */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium">
          <span className="text-slate-500 font-semibold mr-1">Quy chuẩn màu:</span>
          <span className="px-2 py-0.5 rounded bg-[#FEF08A] text-yellow-900 border border-yellow-300">T.Anh (Nương)</span>
          <span className="px-2 py-0.5 rounded bg-[#BAE6FD] text-sky-900 border border-sky-300">Tin học (Phương)</span>
          <span className="px-2 py-0.5 rounded bg-[#BBF7D0] text-emerald-900 border border-emerald-300">Thể dục (Thịnh)</span>
          <span className="px-2 py-0.5 rounded bg-[#FBCFE8] text-pink-900 border border-pink-300">Mỹ thuật / Âm nhạc</span>
          <span className="px-2 py-0.5 rounded bg-[#FED7AA] text-orange-950 border border-orange-300">Tăng cường (TC)</span>
          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-900 border border-indigo-200">Toán</span>
          <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-900 border border-rose-200">Tiếng Việt</span>
        </div>
      </div>

      {/* Main Table Matrix */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1100px]">
          <thead>
            {/* Campus Header row */}
            <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider">
              <th colSpan={3} className="p-2.5 bg-slate-100 text-slate-700 text-center border-r border-slate-200">
                KHUNG THỜI GIAN (32 TIẾT)
              </th>
              {campusFilter !== 'diem2' && (
                <th
                  colSpan={campusFilter === 'diem1' ? 5 : 5}
                  className="p-2.5 bg-blue-50 text-blue-900 text-center border-r border-slate-200"
                >
                  ĐIỂM TRƯỜNG CHÍNH (ĐIỂM 1 - CÁC LỚP KHỐI A)
                </th>
              )}
              {campusFilter !== 'diem1' && (
                <th
                  colSpan={campusFilter === 'diem2' ? 5 : 5}
                  className="p-2.5 bg-rose-50 text-rose-900 text-center"
                >
                  PHÂN HIỆU TÂN BÌNH (ĐIỂM 2 - CÁC LỚP KHỐI B)
                </th>
              )}
            </tr>

            {/* Sub-header: Class names and GVCN */}
            <tr className="border-b border-slate-200 text-xs bg-slate-50 font-semibold text-slate-700">
              <th className="p-2.5 text-center w-16 border-r border-slate-200">Thứ</th>
              <th className="p-2.5 text-center w-14 border-r border-slate-200">Buổi</th>
              <th className="p-2.5 text-center w-16 border-r border-slate-200">Tiết</th>
              {visibleClasses.map((c) => {
                const isD1 = c.campus === 'diem1';
                return (
                  <th
                    key={c.id}
                    className={`p-2 text-center border-r border-slate-200 last:border-r-0 min-w-[95px] ${
                      isD1 ? 'bg-blue-50/40' : 'bg-rose-50/40'
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-sm">{c.name}</div>
                    <div className="text-[10px] text-slate-500 font-normal">GVCN: {c.gvcn}</div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 text-xs">
            {days.map((d) => {
              const daySlots = TIME_SLOTS.filter(s => s.day === d);
              const dayName = daySlots[0]?.dayName;

              return daySlots.map((slot, sIdx) => {
                const isFirstOfDay = sIdx === 0;
                const isFirstOfAfternoon = slot.session === 'C' && slot.period === 1;
                const isMorning = slot.session === 'S';

                return (
                  <tr
                    key={slot.id}
                    className={`transition-colors ${
                      isFirstOfAfternoon ? 'border-t-2 border-slate-300' : ''
                    } hover:bg-slate-50/80`}
                  >
                    {/* Day cell (merged visually via rowSpan on first slot of the day) */}
                    {isFirstOfDay && (
                      <td
                        rowSpan={daySlots.length}
                        className="p-2 text-center font-bold text-slate-800 bg-slate-50 border-r border-slate-200 align-middle text-xs"
                      >
                        <div className="py-2">{dayName}</div>
                      </td>
                    )}

                    {/* Session indicator */}
                    <td
                      className={`p-1.5 text-center font-medium border-r border-slate-200 text-[11px] ${
                        isMorning ? 'text-amber-700 bg-amber-50/30' : 'text-indigo-700 bg-indigo-50/30'
                      }`}
                    >
                      {slot.sessionName}
                    </td>

                    {/* Period number */}
                    <td className="p-1.5 text-center font-bold text-slate-700 border-r border-slate-200 text-[11px]">
                      Tiết {slot.period}
                    </td>

                    {/* Class Cells */}
                    {visibleClasses.map((c) => {
                      const lesson = schedule[c.id]?.[slot.id];
                      const cellClass = getCellClasses(lesson);

                      return (
                        <td
                          key={`${c.id}_${slot.id}`}
                          onClick={() => onSelectSlot(c.id, slot.id, lesson)}
                          className="p-1 border-r border-slate-200 last:border-r-0 align-middle"
                        >
                          {lesson ? (
                            <div
                              className={`p-1.5 rounded border transition-all cursor-pointer select-none text-center ${cellClass}`}
                              title={`${c.name} - ${slot.dayName} ${slot.sessionName} Tiết ${slot.period}: ${lesson.subjectName} (${lesson.teacherName})`}
                            >
                              <div className="font-bold truncate text-[11px] leading-tight">
                                {lesson.subjectName}
                              </div>
                              <div className="text-[10px] opacity-85 mt-0.5 truncate flex items-center justify-center gap-1">
                                <span>{lesson.teacherName}</span>
                                {lesson.notes && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" title={lesson.notes} />
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="h-9 rounded border border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-[10px]">
                              -
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            )}

            {/* Friday Afternoon Official OFF row */}
            <tr className="border-t-2 border-slate-300 bg-emerald-50/40">
              <td className="p-2 text-center font-bold text-slate-800 bg-slate-50 border-r border-slate-200">
                Thứ Sáu
              </td>
              <td className="p-1.5 text-center font-semibold text-emerald-800 bg-emerald-100/50 border-r border-slate-200 text-[11px]">
                Chiều
              </td>
              <td className="p-1.5 text-center font-bold text-slate-700 border-r border-slate-200 text-[11px]">
                Tiết 1..3
              </td>
              <td
                colSpan={visibleClasses.length}
                className="p-2.5 text-center text-emerald-800 font-bold text-xs tracking-wide bg-[#DCFCE7]/70"
              >
                NGHỈ TOÀN TRƯỜNG THEO QUY ĐỊNH CHUYÊN MÔN TIỂU HỌC TÂN THẠNH
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
