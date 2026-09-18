import React, { useState } from 'react';
import { ALL_CLASSES, ALL_TEACHERS, SPECIALIST_TEACHERS, TIME_SLOTS } from '../data/initialData';
import { isDiem1 } from '../solver/cspSolver';
import { ScheduledLesson, ScheduleMatrix, SchoolProfile } from '../types';
import { UserCheck, MapPin, Clock, ArrowRightLeft, ShieldCheck } from 'lucide-react';

interface TeacherScheduleViewProps {
  schedule: ScheduleMatrix;
  onSelectSlot: (classId: string, slotId: string, lesson?: ScheduledLesson) => void;
  schoolProfile?: SchoolProfile;
}

export const TeacherScheduleView: React.FC<TeacherScheduleViewProps> = ({
  schedule,
  onSelectSlot,
  schoolProfile,
}) => {
  const teachers = schoolProfile?.teachers || ALL_TEACHERS;
  const classes = schoolProfile?.classes || ALL_CLASSES;

  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || 'Nương');
  const [roleFilter, setRoleFilter] = useState<'all' | 'SPECIALIST' | 'GVCN'>('all');

  const selectedTeacher = teachers.find(t => t.id === selectedTeacherId || t.name === selectedTeacherId) || teachers[0];
  const isSpecialist = selectedTeacher.role === 'SPECIALIST';

  const filteredTeachers = teachers.filter(t => {
    if (roleFilter === 'all') return true;
    return t.role === roleFilter;
  });

  const days = [2, 3, 4, 5, 6];
  const dayNames: Record<number, string> = {
    2: 'Thứ Hai',
    3: 'Thứ Ba',
    4: 'Thứ Tư',
    5: 'Thứ Năm',
    6: 'Thứ Sáu',
  };

  // Find all lessons taught by this teacher
  const teacherLessons: Array<{ slotId: string; classId: string; lesson: ScheduledLesson }> = [];
  let totalPeriods = 0;
  let diem1Periods = 0;
  let diem2Periods = 0;

  for (const c of classes) {
    for (const slot of TIME_SLOTS) {
      const lesson = schedule[c.id]?.[slot.id];
      if (lesson && lesson.teacherName === selectedTeacher.name) {
        teacherLessons.push({ slotId: slot.id, classId: c.id, lesson });
        totalPeriods++;
        if (isDiem1(c.id)) diem1Periods++;
        else diem2Periods++;
      }
    }
  }

  return (
    <div id="teacher-schedule-view" className="space-y-4">
      {/* Teacher selector and role filter */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-blue-600" /> Chọn Giáo Viên:
            </span>
            <div className="inline-flex p-0.5 rounded-lg bg-slate-100 text-xs font-semibold">
              <button
                onClick={() => setRoleFilter('SPECIALIST')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  roleFilter === 'SPECIALIST' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                GV Bộ Môn ({SPECIALIST_TEACHERS.length})
              </button>
              <button
                onClick={() => setRoleFilter('GVCN')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  roleFilter === 'GVCN' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                GV Chủ Nhiệm (10)
              </button>
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  roleFilter === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Tất cả (18)
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-2">
          {filteredTeachers.map((t) => {
            const isSelected = t.id === selectedTeacherId;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTeacherId(t.id)}
                className={`p-2 rounded-lg text-xs font-bold transition-all text-center border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs scale-105'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="truncate">{t.name}</div>
                <div className={`text-[10px] font-normal truncate mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                  {t.role === 'GVCN' ? `Lớp ${t.assignedClass}` : t.subjects.join(', ')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Teacher Profile & Workload Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">
              Giáo viên: {selectedTeacher.name}
            </h2>
            <span
              className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                isSpecialist ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
              }`}
            >
              {isSpecialist ? 'Giáo viên Bộ Môn' : `GVCN Lớp ${selectedTeacher.assignedClass}`}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-1">
            <span>Chuyên trách môn: <strong>{selectedTeacher.subjects.join(', ')}</strong></span>
            <span>Tổng số tiết: <strong className="text-blue-700">{totalPeriods} tiết/tuần</strong></span>
            {isSpecialist && (
              <>
                <span className="text-blue-600 font-semibold">Điểm 1 (Khối A): {diem1Periods} tiết</span>
                <span className="text-rose-600 font-semibold">Điểm 2 (Khối B): {diem2Periods} tiết</span>
              </>
            )}
          </div>
        </div>

        {isSpecialist && (
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 text-xs text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Ràng buộc di chuyển giữa 2 điểm trường: <strong>Đạt 100% (Có giãn cách ≥ 1 tiết)</strong></span>
          </div>
        )}
      </div>

      {/* Teacher Weekly Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {days.map((d) => {
          const morningSlots = TIME_SLOTS.filter(s => s.day === d && s.session === 'S');
          const afternoonSlots = TIME_SLOTS.filter(s => s.day === d && s.session === 'C');

          return (
            <div
              key={d}
              className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col"
            >
              <div className="bg-slate-800 text-white p-2 text-center">
                <div className="font-bold text-sm">{dayNames[d]}</div>
              </div>

              <div className="p-2 space-y-3 flex-1 flex flex-col justify-between">
                {/* Morning */}
                <div>
                  <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Sáng (Tiết 1..4)
                  </div>
                  <div className="space-y-1.5">
                    {morningSlots.map((slot) => {
                      const lessonItem = teacherLessons.find(tl => tl.slotId === slot.id);
                      const isD1 = lessonItem ? isDiem1(lessonItem.classId) : false;

                      return (
                        <div
                          key={slot.id}
                          onClick={() => lessonItem && onSelectSlot(lessonItem.classId, slot.id, lessonItem.lesson)}
                          className={`p-2 rounded-lg border transition-all ${
                            lessonItem
                              ? isD1
                                ? 'bg-blue-50/80 border-blue-200 hover:bg-blue-100/80 cursor-pointer'
                                : 'bg-rose-50/80 border-rose-200 hover:bg-rose-100/80 cursor-pointer'
                              : 'bg-slate-50 border-slate-100 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-500">Tiết {slot.period}</span>
                            <span className="text-[10px] text-slate-400">{slot.timeLabel}</span>
                          </div>
                          {lessonItem ? (
                            <>
                              <div className="font-extrabold text-slate-900 text-xs mt-0.5">
                                {lessonItem.lesson.subjectName}
                              </div>
                              <div className="flex items-center justify-between text-[11px] mt-0.5">
                                <span className={`font-bold ${isD1 ? 'text-blue-700' : 'text-rose-700'}`}>
                                  Lớp {lessonItem.classId}
                                </span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isD1 ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'}`}>
                                  {isD1 ? 'Điểm 1' : 'Điểm 2'}
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="text-[11px] text-slate-400 italic py-1 text-center">
                              Trống tiết
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Afternoon */}
                <div>
                  <div className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Chiều (Tiết 1..3)
                  </div>
                  {d === 6 ? (
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center text-emerald-800 font-bold text-xs">
                      Nghỉ Chiều Thứ 6
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {afternoonSlots.map((slot) => {
                        const lessonItem = teacherLessons.find(tl => tl.slotId === slot.id);
                        const isD1 = lessonItem ? isDiem1(lessonItem.classId) : false;

                        return (
                          <div
                            key={slot.id}
                            onClick={() => lessonItem && onSelectSlot(lessonItem.classId, slot.id, lessonItem.lesson)}
                            className={`p-2 rounded-lg border transition-all ${
                              lessonItem
                                ? isD1
                                  ? 'bg-blue-50/80 border-blue-200 hover:bg-blue-100/80 cursor-pointer'
                                  : 'bg-rose-50/80 border-rose-200 hover:bg-rose-100/80 cursor-pointer'
                                : 'bg-slate-50 border-slate-100 opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-slate-500">Tiết {slot.period}</span>
                              <span className="text-[10px] text-slate-400">{slot.timeLabel}</span>
                            </div>
                            {lessonItem ? (
                              <>
                                <div className="font-extrabold text-slate-900 text-xs mt-0.5">
                                  {lessonItem.lesson.subjectName}
                                </div>
                                <div className="flex items-center justify-between text-[11px] mt-0.5">
                                  <span className={`font-bold ${isD1 ? 'text-blue-700' : 'text-rose-700'}`}>
                                    Lớp {lessonItem.classId}
                                  </span>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isD1 ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'}`}>
                                    {isD1 ? 'Điểm 1' : 'Điểm 2'}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div className="text-[11px] text-slate-400 italic py-1 text-center">
                                Trống tiết
                              </div>
                            )}
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
