import React, { useState } from 'react';
import { ALL_CLASSES, SCHOOL_INFO, TIME_SLOTS } from '../data/initialData';
import { ScheduledLesson, ScheduleMatrix, SchoolProfile } from '../types';
import { Printer, GraduationCap, MapPin, User, BookOpen, Clock } from 'lucide-react';

interface ClassScheduleViewProps {
  schedule: ScheduleMatrix;
  onSelectSlot: (classId: string, slotId: string, lesson?: ScheduledLesson) => void;
  schoolProfile?: SchoolProfile;
}

export const ClassScheduleView: React.FC<ClassScheduleViewProps> = ({
  schedule,
  onSelectSlot,
  schoolProfile,
}) => {
  const classes = schoolProfile?.classes || ALL_CLASSES;
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '1A');

  const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const isDiem1 = selectedClass.campus === 'diem1' || selectedClass.id.endsWith('A');

  const days = [2, 3, 4, 5, 6];
  const dayNames: Record<number, string> = {
    2: 'Thứ Hai',
    3: 'Thứ Ba',
    4: 'Thứ Tư',
    5: 'Thứ Năm',
    6: 'Thứ Sáu',
  };

  // Count subjects for this class
  const subjectCounts: Record<string, number> = {};
  for (const slot of TIME_SLOTS) {
    const lesson = schedule[selectedClass.id]?.[slot.id];
    if (lesson) {
      subjectCounts[lesson.subjectName] = (subjectCounts[lesson.subjectName] || 0) + 1;
    }
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="class-schedule-view" className="space-y-4">
      {/* Class selector buttons */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2 pb-2 border-b border-slate-100">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-blue-600" /> Chọn Lớp Học Cần Xem / In:
          </div>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" /> In Thời Khóa Biểu Lớp {selectedClass.name}
          </button>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
          {classes.map((c) => {
            const isSelected = c.id === selectedClassId;
            const isD1 = c.campus === 'diem1';
            return (
              <button
                key={c.id}
                onClick={() => setSelectedClassId(c.id)}
                className={`py-2 px-1 rounded-lg text-xs font-bold transition-all text-center border ${
                  isSelected
                    ? isD1
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs scale-105'
                      : 'bg-rose-600 text-white border-rose-600 shadow-xs scale-105'
                    : isD1
                    ? 'bg-blue-50/50 hover:bg-blue-100/60 text-blue-900 border-blue-200'
                    : 'bg-rose-50/50 hover:bg-rose-100/60 text-rose-900 border-rose-200'
                }`}
              >
                <div>{c.name}</div>
                <div className={`text-[10px] font-normal truncate mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                  {c.gvcn}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Class Details Banner */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Thời Khóa Biểu: {selectedClass.name}
            </h2>
            <span
              className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                isDiem1 ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {isDiem1 ? 'Điểm Trường Chính' : 'Phân Hiệu Tân Bình'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600 mt-1">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" /> Giáo viên chủ nhiệm: <strong>{selectedClass.gvcn}</strong>
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" /> Khung giờ: <strong>32 tiết/tuần (GDPT 2018)</strong>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {SCHOOL_INFO.name}
            </span>
          </div>
        </div>

        {/* Quick subject counter pill */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-500 font-semibold mr-1">Môn nổi bật:</span>
          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-semibold">
            Toán: {subjectCounts['Toán'] || 5} tiết
          </span>
          <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">
            T.Việt: {subjectCounts['Tiếng Việt'] || subjectCounts['Tiếng Việt (Tập đọc)'] ? '7-10' : '7'} tiết
          </span>
          <span className="px-2 py-0.5 rounded bg-yellow-50 text-yellow-800 border border-yellow-200 text-xs font-semibold">
            T.Anh: {subjectCounts['Tiếng Anh'] || (selectedClass.grade >= 3 ? 4 : 2)} tiết
          </span>
        </div>
      </div>

      {/* Class Timetable Weekly Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {days.map((d) => {
          const morningSlots = TIME_SLOTS.filter(s => s.day === d && s.session === 'S');
          const afternoonSlots = TIME_SLOTS.filter(s => s.day === d && s.session === 'C');

          return (
            <div
              key={d}
              className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col"
            >
              {/* Day Header */}
              <div className="bg-slate-800 text-white p-2.5 text-center">
                <div className="font-bold text-sm tracking-wide">{dayNames[d]}</div>
                <div className="text-[10px] text-slate-300 font-medium">
                  {d === 6 ? '4 tiết sáng / Chiều nghỉ' : '4 tiết sáng / 3 tiết chiều'}
                </div>
              </div>

              <div className="p-2 space-y-3 flex-1 flex flex-col justify-between">
                {/* Morning Session */}
                <div>
                  <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Buổi Sáng (Tiết 1 - 4)
                  </div>
                  <div className="space-y-1.5">
                    {morningSlots.map((slot) => {
                      const lesson = schedule[selectedClass.id]?.[slot.id];
                      return (
                        <div
                          key={slot.id}
                          onClick={() => onSelectSlot(selectedClass.id, slot.id, lesson)}
                          className="p-2 rounded-lg border border-slate-200/80 bg-slate-50 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-500">Tiết {slot.period}</span>
                            <span className="text-[10px] text-slate-400">{slot.timeLabel}</span>
                          </div>
                          <div className="font-extrabold text-slate-900 text-xs mt-0.5">
                            {lesson?.subjectName || '-'}
                          </div>
                          <div className="text-[11px] text-slate-600 mt-0.5 flex items-center justify-between">
                            <span>GV: {lesson?.teacherName || '-'}</span>
                            {lesson?.notes && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded">
                                {lesson.notes}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Afternoon Session */}
                <div>
                  <div className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Buổi Chiều
                  </div>
                  {d === 6 ? (
                    <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-center text-emerald-800 font-bold text-xs">
                      Nghỉ Chiều Thứ 6
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {afternoonSlots.map((slot) => {
                        const lesson = schedule[selectedClass.id]?.[slot.id];
                        return (
                          <div
                            key={slot.id}
                            onClick={() => onSelectSlot(selectedClass.id, slot.id, lesson)}
                            className="p-2 rounded-lg border border-slate-200/80 bg-slate-50 hover:bg-white hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer"
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-slate-500">Tiết {slot.period}</span>
                              <span className="text-[10px] text-slate-400">{slot.timeLabel}</span>
                            </div>
                            <div className="font-extrabold text-slate-900 text-xs mt-0.5">
                              {lesson?.subjectName || '-'}
                            </div>
                            <div className="text-[11px] text-slate-600 mt-0.5 flex items-center justify-between">
                              <span>GV: {lesson?.teacherName || '-'}</span>
                              {lesson?.notes && (
                                <span className="text-[10px] px-1.5 py-0.2 bg-indigo-50 text-indigo-700 rounded">
                                  {lesson.notes}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
