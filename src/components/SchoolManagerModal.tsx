import React, { useState } from 'react';
import { SchoolClass, SchoolProfile, SubjectAssignment, Teacher } from '../types';
import { ALL_PRESETS, PRESET_TAN_THANH } from '../data/schoolPresets';
import { SUBJECTS } from '../data/initialData';
import {
  School,
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  Sparkles,
  Users,
  BookOpen,
  Calendar,
  Layers,
  Upload,
  Download,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface SchoolManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSchool: SchoolProfile;
  onSaveSchool: (newProfile: SchoolProfile) => void;
}

export const SchoolManagerModal: React.FC<SchoolManagerModalProps> = ({
  isOpen,
  onClose,
  currentSchool: initialProfile,
  onSaveSchool,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'teachers' | 'assignments' | 'io'>('teachers');
  const [profile, setProfile] = useState<SchoolProfile>(() => JSON.parse(JSON.stringify(initialProfile)));
  const [selectedClassId, setSelectedClassId] = useState<string>(initialProfile.classes[0]?.id || '1A');

  // Teacher edit state
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [newTeacherName, setNewTeacherName] = useState<string>('');
  const [newTeacherRole, setNewTeacherRole] = useState<'GVCN' | 'SPECIALIST'>('SPECIALIST');
  const [newTeacherQuota, setNewTeacherQuota] = useState<number>(19);
  const [newTeacherSubjects, setNewTeacherSubjects] = useState<string>('TA');

  // JSON import error/success
  const [jsonText, setJsonText] = useState<string>('');
  const [jsonStatus, setJsonStatus] = useState<string | null>(null);

  // Synchronize when opening
  React.useEffect(() => {
    setProfile(JSON.parse(JSON.stringify(initialProfile)));
    if (initialProfile.classes[0]) {
      setSelectedClassId(initialProfile.classes[0].id);
    }
  }, [initialProfile, isOpen]);

  if (!isOpen) return null;

  // Handle Preset Switching
  const handleSelectPreset = (presetKey: string) => {
    const preset = ALL_PRESETS[presetKey];
    if (preset) {
      setProfile(JSON.parse(JSON.stringify(preset)));
      if (preset.classes[0]) {
        setSelectedClassId(preset.classes[0].id);
      }
    }
  };

  // Update teacher field
  const handleUpdateTeacher = (id: string, field: keyof Teacher, value: any) => {
    setProfile(prev => ({
      ...prev,
      teachers: prev.teachers.map(t => (t.id === id ? { ...t, [field]: value } : t)),
    }));
  };

  // Add new teacher
  const handleAddTeacher = () => {
    if (!newTeacherName.trim()) return;
    const newId = `T_${Date.now()}`;
    const subjs = newTeacherSubjects.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
    const newTeacher: Teacher = {
      id: newId,
      name: newTeacherName.trim(),
      role: newTeacherRole,
      roleTitle: newTeacherRole === 'GVCN' ? 'Giáo viên Chủ nhiệm' : 'Giáo viên Bộ môn',
      quota: newTeacherQuota,
      subjects: subjs.length > 0 ? subjs : ['TV', 'TOAN'],
      color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
    };

    setProfile(prev => ({
      ...prev,
      teachers: [...prev.teachers, newTeacher],
    }));

    setNewTeacherName('');
  };

  // Delete teacher
  const handleDeleteTeacher = (id: string) => {
    setProfile(prev => ({
      ...prev,
      teachers: prev.teachers.filter(t => t.id !== id),
    }));
  };

  // Update Assignment
  const handleUpdateAssignment = (
    classId: string,
    subjectCode: string,
    field: 'periodsPerWeek' | 'teacherName',
    value: any
  ) => {
    setProfile(prev => {
      const copy = { ...prev };
      const idx = copy.assignments.findIndex(a => a.classId === classId && a.subjectCode === subjectCode);
      if (idx >= 0) {
        copy.assignments[idx] = {
          ...copy.assignments[idx],
          [field]: value,
        };
      }
      return copy;
    });
  };

  // Add Assignment for selected class
  const handleAddAssignmentToClass = (subjectCode: string) => {
    const existing = profile.assignments.find(a => a.classId === selectedClassId && a.subjectCode === subjectCode);
    if (existing) return;

    const subj = SUBJECTS[subjectCode as keyof typeof SUBJECTS];
    const defaultTeacher = subj?.defaultTeacher || profile.classes.find(c => c.id === selectedClassId)?.gvcn || profile.teachers[0]?.name || '';

    const newAssignment: SubjectAssignment = {
      classId: selectedClassId,
      subjectCode,
      subjectName: subj?.name || subjectCode,
      teacherName: defaultTeacher,
      periodsPerWeek: 1,
    };

    setProfile(prev => ({
      ...prev,
      assignments: [...prev.assignments, newAssignment],
    }));
  };

  // Remove Assignment
  const handleRemoveAssignment = (classId: string, subjectCode: string) => {
    setProfile(prev => ({
      ...prev,
      assignments: prev.assignments.filter(a => !(a.classId === classId && a.subjectCode === subjectCode)),
    }));
  };

  // Calculate total periods for selected class
  const classAssignments = profile.assignments.filter(a => a.classId === selectedClassId);
  const totalClassPeriods = classAssignments.reduce((acc, cur) => acc + cur.periodsPerWeek, 0);

  // Save and Sync
  const handleApplyAndSync = () => {
    onSaveSchool(profile);
    onClose();
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `TKB_School_Config_${profile.id || 'custom'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJSON = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.classes || !parsed.teachers || !parsed.assignments) {
        setJsonStatus('Lỗi: File JSON thiếu trường classes, teachers hoặc assignments.');
        return;
      }
      setProfile(parsed);
      setJsonStatus('Nhập dữ liệu thành công!');
    } catch (err) {
      setJsonStatus('Lỗi: Định dạng JSON không hợp lệ.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div
        id="school-manager-modal"
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-800 via-indigo-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-md">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Thanh Lệnh Quản Lý Trường Học, Giáo Viên & Phân Tiết</h2>
              <p className="text-xs text-blue-100 font-normal">
                Thay đổi danh sách giáo viên, định mức và phân công tiết học của trường khác; TKB tự động đồng bộ theo các nguyên tắc
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

        {/* Preset Selector Banner */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <span>Chọn trường mẫu có sẵn:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSelectPreset('tan_thanh')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                profile.id === 'tan_thanh'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              TH Tân Thạnh (10 lớp - Hiện tại)
            </button>
            <button
              onClick={() => handleSelectPreset('chu_van_an')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                profile.id === 'chu_van_an'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              TH Chu Văn An (8 lớp chuẩn)
            </button>
            <button
              onClick={() => handleSelectPreset('le_hong_phong')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                profile.id === 'le_hong_phong'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              TH Lê Hồng Phong (12 lớp)
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'teachers'
                ? 'bg-white text-blue-700 border-blue-600 shadow-2xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-blue-600" />
            <span>Danh Sách Giáo Viên ({profile.teachers.length} GV)</span>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'assignments'
                ? 'bg-white text-indigo-700 border-indigo-600 shadow-2xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Phân Tiết & Phân Công Giảng Dạy ({profile.classes.length} Lớp)</span>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'info'
                ? 'bg-white text-emerald-700 border-emerald-600 shadow-2xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <School className="w-4 h-4 text-emerald-600" />
            <span>Thông Tin Trường & Khối Lớp</span>
          </button>

          <button
            onClick={() => setActiveTab('io')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'io'
                ? 'bg-white text-amber-700 border-amber-600 shadow-2xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Download className="w-4 h-4 text-amber-600" />
            <span>Nhập / Xuất JSON</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: TEACHERS */}
          {activeTab === 'teachers' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Quản Lý Danh Sách Giáo Viên Của Trường</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Thêm giáo viên mới, chỉnh sửa định mức tiết dạy (quota), phân công chức vụ hoặc giáo viên bộ môn.
                  </p>
                </div>
                <div className="text-xs font-semibold text-slate-600">
                  Tổng giáo viên: <span className="font-bold text-blue-700">{profile.teachers.length}</span> | Tổng định mức: <span className="font-bold text-indigo-700">{profile.teachers.reduce((s, t) => s + t.quota, 0)} tiết</span>
                </div>
              </div>

              {/* Add Teacher Bar */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Plus className="w-4 h-4 text-blue-600" /> Thêm GV mới:
                </span>
                <input
                  type="text"
                  placeholder="Họ và tên giáo viên..."
                  value={newTeacherName}
                  onChange={e => setNewTeacherName(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-blue-500 flex-1 min-w-[140px]"
                />
                <select
                  value={newTeacherRole}
                  onChange={e => setNewTeacherRole(e.target.value as any)}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                >
                  <option value="SPECIALIST">GV Bộ môn / Chuyên môn</option>
                  <option value="GVCN">Giáo viên Chủ nhiệm</option>
                </select>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-500">Định mức:</span>
                  <input
                    type="number"
                    min="2"
                    max="26"
                    value={newTeacherQuota}
                    onChange={e => setNewTeacherQuota(parseInt(e.target.value) || 19)}
                    className="w-14 text-center text-xs px-2 py-1.5 rounded-lg border border-slate-300"
                  />
                  <span className="text-xs text-slate-500">tiết</span>
                </div>
                <input
                  type="text"
                  placeholder="Môn dạy (VD: TA, TH, GDTC)"
                  value={newTeacherSubjects}
                  onChange={e => setNewTeacherSubjects(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 w-36"
                />
                <button
                  onClick={handleAddTeacher}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm
                </button>
              </div>

              {/* Teachers Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="max-h-[360px] overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 border-b border-slate-200 z-10">
                      <tr>
                        <th className="py-2.5 px-3">Tên Giáo Viên</th>
                        <th className="py-2.5 px-3">Vai Trò / Chức Danh</th>
                        <th className="py-2.5 px-3">Lớp Chủ Nhiệm</th>
                        <th className="py-2.5 px-3 text-center">Định Mức (Tiết)</th>
                        <th className="py-2.5 px-3">Môn Phụ Trách</th>
                        <th className="py-2.5 px-3 text-center">Hành Động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {profile.teachers.map((t, idx) => (
                        <tr key={t.id || idx} className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-2 px-3 font-semibold text-slate-900 flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full inline-block shrink-0"
                              style={{ backgroundColor: t.color || '#3B82F6' }}
                            />
                            <input
                              type="text"
                              value={t.name}
                              onChange={e => handleUpdateTeacher(t.id, 'name', e.target.value)}
                              className="px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-blue-500 text-xs font-semibold"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={t.role}
                              onChange={e => handleUpdateTeacher(t.id, 'role', e.target.value)}
                              className="px-2 py-1 rounded border border-slate-200 text-xs bg-white"
                            >
                              <option value="GVCN">Giáo viên Chủ nhiệm</option>
                              <option value="SPECIALIST">GV Bộ môn</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={t.assignedClass || ''}
                              placeholder="Trống"
                              onChange={e => handleUpdateTeacher(t.id, 'assignedClass', e.target.value)}
                              className="w-20 px-2 py-1 rounded border border-slate-200 text-xs text-center"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <input
                              type="number"
                              min="1"
                              max="30"
                              value={t.quota}
                              onChange={e => handleUpdateTeacher(t.id, 'quota', parseInt(e.target.value) || 19)}
                              className="w-16 px-2 py-1 rounded border border-slate-200 text-xs font-bold text-center text-blue-700"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <span className="text-[11px] text-slate-600">{t.subjects?.join(', ') || 'Văn hóa'}</span>
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                              onClick={() => handleDeleteTeacher(t.id)}
                              className="p-1 rounded hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors"
                              title="Xóa giáo viên"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ASSIGNMENTS (PHÂN TIẾT & PHÂN CÔNG) */}
          {activeTab === 'assignments' && (
            <div className="space-y-4">
              {/* Class Selector Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs font-bold text-slate-600 shrink-0">Chọn Lớp:</span>
                {profile.classes.map(c => {
                  const isSelected = c.id === selectedClassId;
                  const cAssignments = profile.assignments.filter(a => a.classId === c.id);
                  const pCount = cAssignments.reduce((acc, cur) => acc + cur.periodsPerWeek, 0);
                  const isFull = pCount === 32;

                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedClassId(c.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs scale-102'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      <span>{c.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                          isSelected
                            ? isFull
                              ? 'bg-emerald-500 text-white'
                              : 'bg-amber-400 text-slate-900'
                            : isFull
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {pCount}/32T
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Assignment Table for Selected Class */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      Bảng Phân Công Tiết Dạy - {profile.classes.find(c => c.id === selectedClassId)?.name}
                    </h4>
                    <span className="text-xs text-slate-500">
                      (GVCN: <strong className="text-slate-800">{profile.classes.find(c => c.id === selectedClassId)?.gvcn}</strong>)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600">Tổng số tiết:</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                        totalClassPeriods === 32
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {totalClassPeriods} / 32 Tiết
                    </span>
                  </div>
                </div>

                {/* Assignments List */}
                <div className="max-h-[320px] overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Môn Học</th>
                        <th className="py-2 px-3 text-center">Số Tiết / Tuần</th>
                        <th className="py-2 px-3">Giáo Viên Phụ Trách</th>
                        <th className="py-2 px-3 text-center">Xóa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {classAssignments.map(a => {
                        const subj = SUBJECTS[a.subjectCode as keyof typeof SUBJECTS];
                        return (
                          <tr key={a.subjectCode} className="hover:bg-slate-50 transition-colors">
                            <td className="py-2 px-3">
                              <span className="font-semibold text-slate-900">{subj?.name || a.subjectCode}</span>
                              <span className="text-[10px] text-slate-500 ml-1.5">({a.subjectCode})</span>
                            </td>
                            <td className="py-2 px-3 text-center">
                              <div className="inline-flex items-center gap-1">
                                <input
                                  type="number"
                                  min="1"
                                  max="12"
                                  value={a.periodsPerWeek}
                                  onChange={e =>
                                    handleUpdateAssignment(
                                      selectedClassId,
                                      a.subjectCode,
                                      'periodsPerWeek',
                                      parseInt(e.target.value) || 1
                                    )
                                  }
                                  className="w-14 px-2 py-1 rounded border border-slate-300 text-center font-bold text-slate-800"
                                />
                                <span className="text-[11px] text-slate-500">tiết</span>
                              </div>
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={a.teacherName}
                                onChange={e =>
                                  handleUpdateAssignment(
                                    selectedClassId,
                                    a.subjectCode,
                                    'teacherName',
                                    e.target.value
                                  )
                                }
                                className="w-full max-w-[200px] px-2 py-1 rounded border border-slate-300 text-xs font-medium text-slate-800 bg-white"
                              >
                                {profile.teachers.map(t => (
                                  <option key={t.name} value={t.name}>
                                    {t.name} {t.role === 'GVCN' ? `(GVCN ${t.assignedClass || ''})` : `(${t.subjects?.join(',')})`}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-2 px-3 text-center">
                              {/* Keep anchors locked */}
                              {['SHDC', 'SHL'].includes(a.subjectCode) ? (
                                <span className="text-[10px] text-slate-400 font-semibold">Cố định</span>
                              ) : (
                                <button
                                  onClick={() => handleRemoveAssignment(selectedClassId, a.subjectCode)}
                                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                                  title="Xóa phân môn này"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Quick Add Subject */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-500">Thêm nhanh môn:</span>
                  {Object.entries(SUBJECTS)
                    .filter(([code]) => code !== 'OFF' && !classAssignments.some(a => a.subjectCode === code))
                    .slice(0, 8)
                    .map(([code, subj]) => (
                      <button
                        key={code}
                        onClick={() => handleAddAssignmentToClass(code)}
                        className="px-2 py-1 rounded-md bg-slate-100 hover:bg-blue-100 hover:text-blue-800 text-[11px] font-medium text-slate-700 transition-colors"
                      >
                        + {subj.name}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCHOOL & CLASS INFO */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-4">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Thông Tin Chung Về Nhà Trường
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Tên trường học:</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                      className="mt-1 w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-blue-500 font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Phân hiệu / Điểm trường:</label>
                    <input
                      type="text"
                      value={profile.branch}
                      onChange={e => setProfile(p => ({ ...p, branch: e.target.value }))}
                      className="mt-1 w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-blue-500 font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Năm học:</label>
                    <input
                      type="text"
                      value={profile.academicYear}
                      onChange={e => setProfile(p => ({ ...p, academicYear: e.target.value }))}
                      className="mt-1 w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-blue-500 font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Classes List */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">Danh Sách Lớp Học ({profile.classes.length} Lớp)</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {profile.classes.map(c => (
                    <div key={c.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">{c.name}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                          Khối {c.grade}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 flex items-center justify-between">
                        <span>GVCN:</span>
                        <span className="font-semibold text-slate-800">{c.gvcn}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: IMPORT / EXPORT */}
          {activeTab === 'io' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Xuất Cấu Hình Nhà Trường</h4>
                <p className="text-xs text-slate-500">
                  Tải file cấu hình JSON chứa đầy đủ danh sách giáo viên, khối lớp và ma trận phân công tiết học để lưu trữ hoặc tái sử dụng.
                </p>
                <button
                  onClick={handleExportJSON}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-2 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Về File Cấu Hình (.json)</span>
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Nhập Cấu Hình Từ File JSON</h4>
                <textarea
                  rows={6}
                  placeholder="Dán nội dung file JSON vào đây..."
                  value={jsonText}
                  onChange={e => setJsonText(e.target.value)}
                  className="w-full text-xs font-mono p-3 rounded-lg border border-slate-300 focus:outline-blue-500"
                />
                {jsonStatus && (
                  <p className={`text-xs font-semibold ${jsonStatus.includes('Lỗi') ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {jsonStatus}
                  </p>
                )}
                <button
                  onClick={handleImportJSON}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs"
                >
                  <Upload className="w-4 h-4" />
                  <span>Áp Dụng Dữ Liệu JSON</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Sync & Solve Action */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => handleSelectPreset('tan_thanh')}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi Phục Trường Tân Thạnh Mặc Định</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
            >
              Đóng
            </button>
            <button
              id="btn-sync-school-schedule"
              onClick={handleApplyAndSync}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md active:scale-98 flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Đồng Bộ & Xếp Thời Khóa Biểu Mới</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
