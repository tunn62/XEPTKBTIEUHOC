import ExcelJS from 'exceljs';
import { ALL_CLASSES, SCHOOL_INFO, TIME_SLOTS } from '../data/initialData';
import { ScheduleMatrix, SchoolProfile } from '../types';

export async function exportScheduleToExcel(
  schedule: ScheduleMatrix,
  filename = 'TKB_TieuHoc_A4.xlsx',
  schoolProfile?: SchoolProfile
) {
  const wb = new ExcelJS.Workbook();
  const schoolName = schoolProfile?.name || SCHOOL_INFO.name;
  const schoolBranch = schoolProfile?.branch || SCHOOL_INFO.branch;
  const academicYear = schoolProfile?.academicYear || SCHOOL_INFO.academicYear;
  const classes = schoolProfile?.classes || ALL_CLASSES;

  wb.creator = `Hệ thống TKB - ${schoolName}`;
  wb.lastModifiedBy = 'Chuyên gia GD & Kỹ sư Tối ưu hóa CSP';
  wb.created = new Date();

  // Color mapping from the user's Python openpyxl specification:
  // TA: FEF08A (Vàng nhạt)
  // TH: BAE6FD (Xanh dương nhạt)
  // ART: FBCFE8 (Hồng/tím nhạt)
  // PE: BBF7D0 (Xanh lá nhạt)
  // TC: FED7AA (Cam nhạt)
  // OFF: 15803D (Xanh lá đậm)
  const getSubjectColor = (code: string, category: string): { bg: string; fg: string } => {
    switch (category) {
      case 'TA':
        return { bg: 'FEF08A', fg: '854D0E' };
      case 'TH':
        return { bg: 'BAE6FD', fg: '0369A1' };
      case 'ART':
        return { bg: 'FBCFE8', fg: '9D174D' };
      case 'PE':
        return { bg: 'BBF7D0', fg: '166534' };
      case 'TC':
        return { bg: 'FED7AA', fg: '9A3412' };
      case 'OFF':
        return { bg: '15803D', fg: 'FFFFFF' };
      default:
        if (code === 'TOAN') return { bg: 'EEF2FF', fg: '312E81' };
        if (code === 'TV') return { bg: 'FEF2F2', fg: '991B1B' };
        if (code === 'TNXH' || code === 'KH') return { bg: 'CCFBF1', fg: '115E59' };
        if (code === 'LS_DL') return { bg: 'F3E8FF', fg: '6B21A8' };
        if (code === 'DD') return { bg: 'FEF9C3', fg: '854D0E' };
        if (code === 'SHDC' || code === 'SHL') return { bg: 'E2E8F0', fg: '1E293B' };
        return { bg: 'F8FAFC', fg: '0F172A' };
    }
  };

  // Sheet 1: TKB Toàn Trường (A4 Landscape)
  const ws = wb.addWorksheet('TKB Toàn Trường', {
    pageSetup: {
      paperSize: 9, // A4
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
  });

  const lastColLetter = String.fromCharCode(65 + 3 + classes.length - 1);

  // Row 1: School Header
  ws.mergeCells(`A1:${lastColLetter}1`);
  const title1 = ws.getCell('A1');
  title1.value = `${schoolName} - ${schoolBranch}`;
  title1.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF1E3A8A' } };
  title1.alignment = { horizontal: 'center', vertical: 'middle' };

  // Row 2: Subtitle
  ws.mergeCells(`A2:${lastColLetter}2`);
  const title2 = ws.getCell('A2');
  title2.value = `THỜI KHÓA BIỂU NĂM HỌC ${academicYear}`;
  title2.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFB91C1C' } };
  title2.alignment = { horizontal: 'center', vertical: 'middle' };

  // Row 3: Meta info
  ws.mergeCells(`A3:${lastColLetter}3`);
  const meta = ws.getCell('A3');
  meta.value = `Áp dụng chương trình GDPT 2018 | Khung thời gian: 32 tiết/tuần | Giải pháp: Google OR-Tools CP-SAT`;
  meta.font = { name: 'Arial', size: 9, italic: true, color: { argb: 'FF64748B' } };
  meta.alignment = { horizontal: 'center', vertical: 'middle' };

  // Header Row 4: Column headers
  ws.getCell('A4').value = 'THỜI GIAN';
  ws.getCell('B4').value = 'BUỔI';
  ws.getCell('C4').value = 'TIẾT';

  // Header Row 5: Class columns
  const headerRow = ws.getRow(5);
  headerRow.values = [
    'Thứ',
    'Buổi',
    'Tiết',
    ...classes.map(c => `${c.name || c.id} (${c.gvcn || 'GVCN'})`),
  ];

  headerRow.eachCell((cell, colNumber) => {
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: colNumber <= 3 ? 'FF334155' : 'FF1E40AF' },
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
      right: { style: 'thin' },
    };
  });

  // Populate rows for each time slot (32 slots)
  let currentRowIndex = 6;
  const days = [2, 3, 4, 5, 6];

  for (const d of days) {
    const daySlots = TIME_SLOTS.filter(s => s.day === d);
    const dayStartRow = currentRowIndex;

    for (const slot of daySlots) {
      const row = ws.getRow(currentRowIndex);
      const rowValues: any[] = [
        slot.dayName,
        slot.sessionName,
        `Tiết ${slot.period}`,
      ];

      for (const c of classes) {
        const lesson = schedule[c.id]?.[slot.id];
        if (lesson) {
          rowValues.push(`${lesson.subjectName}\n(${lesson.teacherName})`);
        } else {
          rowValues.push('-');
        }
      }

      row.values = rowValues;
      row.height = 28;

      // Apply styling to data cells
      row.eachCell((cell, colNumber) => {
        cell.font = { name: 'Arial', size: 8 };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        };

        if (colNumber > 3) {
          const classIdx = colNumber - 4;
          const classObj = classes[classIdx];
          const lesson = schedule[classObj?.id]?.[slot.id];
          if (lesson) {
            const colors = getSubjectColor(lesson.subjectCode, lesson.category);
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF' + colors.bg },
            };
            cell.font = {
              name: 'Arial',
              size: 8,
              bold: lesson.category === 'MAIN' || lesson.category === 'TA',
              color: { argb: 'FF' + colors.fg },
            };
          }
        }
      });

      currentRowIndex++;
    }

    // Merge day name column for that day
    const dayEndRow = currentRowIndex - 1;
    if (dayEndRow > dayStartRow) {
      try {
        ws.mergeCells(`A${dayStartRow}:A${dayEndRow}`);
        const dayCell = ws.getCell(`A${dayStartRow}`);
        dayCell.alignment = { horizontal: 'center', vertical: 'middle' };
        dayCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF1E293B' } };
        dayCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
      } catch (e) {
        // ignore
      }
    }
  }

  // Row for Friday afternoon (Nghỉ)
  const friOffRow = ws.getRow(currentRowIndex);
  friOffRow.values = ['Thứ Sáu', 'Chiều', 'Tiết 1..3', 'NGHỈ TOÀN TRƯỜNG THEO QUY ĐỊNH CHUYÊN MÔN'];
  ws.mergeCells(`D${currentRowIndex}:M${currentRowIndex}`);
  friOffRow.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
  friOffRow.getCell(4).font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF15803D' } };
  friOffRow.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
  currentRowIndex += 2;

  // Legend section matching openpyxl specs:
  const legendTitle = ws.getRow(currentRowIndex);
  legendTitle.getCell(1).value = 'BẢNG MÀU QUY CHUẨN THỜI KHÓA BIỂU:';
  legendTitle.getCell(1).font = { name: 'Arial', size: 9, bold: true };
  currentRowIndex++;

  const legends = [
    { label: 'Tiếng Anh (Nương)', bg: 'FEF08A', fg: '854D0E' },
    { label: 'Tin học & CN (Phương)', bg: 'BAE6FD', fg: '0369A1' },
    { label: 'Mỹ thuật / Âm nhạc (Thy, Tâm)', bg: 'FBCFE8', fg: '9D174D' },
    { label: 'Thể dục / GDTC (Thịnh)', bg: 'BBF7D0', fg: '166534' },
    { label: 'Tăng cường / Kỹ năng (Nhàn, Phước, Quan)', bg: 'FED7AA', fg: '9A3412' },
    { label: 'Môn GVCN (Toán, Tiếng Việt, TNXH/KH)', bg: 'EEF2FF', fg: '312E81' },
  ];

  for (let i = 0; i < legends.length; i++) {
    const leg = legends[i];
    const cell = ws.getRow(currentRowIndex).getCell(i * 2 + 1);
    ws.mergeCells(currentRowIndex, i * 2 + 1, currentRowIndex, i * 2 + 2);
    cell.value = leg.label;
    cell.font = { name: 'Arial', size: 8, bold: true, color: { argb: 'FF' + leg.fg } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + leg.bg } };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  }

  // Adjust column widths
  ws.getColumn(1).width = 11;
  ws.getColumn(2).width = 8;
  ws.getColumn(3).width = 9;
  for (let c = 4; c <= 13; c++) {
    ws.getColumn(c).width = 14;
  }

  // Generate buffer and trigger browser download
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}
