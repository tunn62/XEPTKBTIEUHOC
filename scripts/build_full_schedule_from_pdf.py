import json
from collections import defaultdict

# 10 classes
CLASSES = ['1A', '2A', '3A', '4A', '5A', '1B', '2B', '3B', '4B', '5B']
GVCN = {
    '1A': 'Chi', '2A': 'Trang', '3A': 'Dương', '4A': 'Hằng', '5A': 'Tuấn',
    '1B': 'Bé Năm', '2B': 'Chinh', '3B': 'Đạt', '4B': 'Yến', '5B': 'Huế'
}

# Schedule matrix: sched[slot_id][class_id] = (subject, teacher)
sched = {}

def set_slot(slot_id, entries):
    # entries is a dict {class_id: (subject, teacher)}
    sched[slot_id] = entries

# Let's fill every slot according to Page 1 of the PDF, with user instruction:
# "Quan dạy Đạo đức Chỉ có 2 tiết" -> 5A (T2_C_1) and 5B (T2_C_3). 
# For 4A and 4B, ĐĐ is taught by GVCN (Hằng, Yến).

# ===== THỨ 2 (MONDAY) =====
# Sáng
set_slot('T2_S_1', {
    '1A': ('SHDC', 'Chi'),
    '2A': ('HDTN_CD', 'Nhàn'), # HĐTN(Nhàn)
    '3A': ('SHDC', 'Dương'),
    '4A': ('SHDC', 'Hằng'),
    '5A': ('SHDC', 'Tuấn'),
    '1B': ('SHDC', 'Bé Năm'),
    '2B': ('SHDC', 'Chinh'),
    '3B': ('SHDC', 'Đạt'),
    '4B': ('SHDC', 'Yến'),
    '5B': ('SHDC', 'Huế'),
})
set_slot('T2_S_2', {c: ('TV', GVCN[c]) for c in CLASSES})
set_slot('T2_S_3', {c: ('TV', GVCN[c]) for c in CLASSES})
set_slot('T2_S_4', {c: ('TOAN', GVCN[c]) for c in CLASSES})

# Chiều
set_slot('T2_C_1', {
    '1A': ('MT', 'Thy'),
    '2A': ('DD', 'Nhàn'),
    '3A': ('TA', 'Nương'),
    '4A': ('AN', 'Tâm'),
    '5A': ('DD', 'Quan'),       # <-- Quan tiết 1
    '1B': ('TNXH', 'Phước'),
    '2B': ('TH', 'Phương'),
    '3B': ('DD', 'Đạt'),
    '4B': ('LS_DL', 'Yến'),
    '5B': ('LS_DL', 'Huế'),
})
set_slot('T2_C_2', {
    '1A': ('TV', 'Chi'),
    '2A': ('MT', 'Thy'),
    '3A': ('AN', 'Tâm'),
    '4A': ('GDTC', 'Thịnh'),
    '5A': ('TA', 'Nương'),
    '1B': ('TV', 'Bé Năm'),
    '2B': ('TNXH', 'Phước'),
    '3B': ('TH', 'Phương'),
    '4B': ('KH', 'Yến'),
    '5B': ('KH', 'Huế'),
})
set_slot('T2_C_3', {
    '1A': ('TC_TV', 'Chi'),
    '2A': ('AN', 'Tâm'),
    '3A': ('MT', 'Thy'),
    '4A': ('TA', 'Nương'),
    '5A': ('GDTC', 'Thịnh'),
    '1B': ('TC_TV', 'Bé Năm'),
    '2B': ('DD', 'Nhàn'),
    '3B': ('TNXH', 'Phước'),
    '4B': ('TH', 'Phương'),
    '5B': ('DD', 'Quan'),       # <-- Quan tiết 2
})

# ===== THỨ 3 (TUESDAY) =====
# Sáng
set_slot('T3_S_1', {
    '1A': ('TV', 'Chi'),
    '2A': ('GDTC', 'Thịnh'),
    '3A': ('TV', 'Dương'),
    '4A': ('TV', 'Hằng'),
    '5A': ('TV', 'Tuấn'),
    '1B': ('TV', 'Bé Năm'),
    '2B': ('TV', 'Chinh'),
    '3B': ('AN', 'Tâm'),
    '4B': ('TV', 'Yến'),
    '5B': ('TA', 'Nương'),
})
set_slot('T3_S_2', {
    '1A': ('TV', 'Chi'),
    '2A': ('TV', 'Trang'),
    '3A': ('GDTC', 'Thịnh'),
    '4A': ('TOAN', 'Hằng'),
    '5A': ('TOAN', 'Tuấn'),
    '1B': ('TV', 'Bé Năm'),
    '2B': ('TV', 'Chinh'),
    '3B': ('TV', 'Đạt'),
    '4B': ('TOAN', 'Yến'),
    '5B': ('AN', 'Tâm'),
})
set_slot('T3_S_3', {
    '1A': ('GDTC', 'Thịnh'),
    '2A': ('TV', 'Trang'),
    '3A': ('TOAN', 'Dương'),
    '4A': ('LS_DL', 'Hằng'),
    '5A': ('LS_DL', 'Tuấn'),
    '1B': ('AN', 'Tâm'),
    '2B': ('MT', 'Thy'),
    '3B': ('TOAN', 'Đạt'),
    '4B': ('TA', 'Nương'),
    '5B': ('TV', 'Huế'),
})
set_slot('T3_S_4', {
    '1A': ('TH', 'Phương'),
    '2A': ('TOAN', 'Trang'),
    '3A': ('DD', 'Dương'),
    '4A': ('KH', 'Hằng'),
    '5A': ('KH', 'Tuấn'),
    '1B': ('MT', 'Thy'),
    '2B': ('AN', 'Tâm'),
    '3B': ('TA', 'Nương'),
    '4B': ('TH', 'Nhàn'),      # CN/TH(Nhàn)
    '5B': ('TOAN', 'Huế'),
})

# Chiều
set_slot('T3_C_1', {
    '1A': ('TNXH', 'Phước'),
    '2A': ('BD_AN', 'Tâm'),
    '3A': ('TA', 'Nương'),
    '4A': ('TH', 'Phương'),
    '5A': ('TC_TV', 'Tuấn'),
    '1B': ('DD', 'Nhàn'),
    '2B': ('TOAN', 'Chinh'),
    '3B': ('MT', 'Thy'),
    '4B': ('DD', 'Yến'),       # GVCN Yến dạy ĐĐ (Quan chỉ dạy 2 tiết)
    '5B': ('KH', 'Huế'),
})
set_slot('T3_C_2', {
    '1A': ('TC_TV', 'Chi'),
    '2A': ('TNXH', 'Phước'),
    '3A': ('BD_AN', 'Tâm'),
    '4A': ('TA', 'Nương'),
    '5A': ('TH', 'Phương'),
    '1B': ('TC_TV', 'Nhàn'),
    '2B': ('TC_TV', 'Chinh'),
    '3B': ('GDTC', 'Thịnh'),
    '4B': ('KH', 'Yến'),
    '5B': ('MT', 'Thy'),
})
set_slot('T3_C_3', {
    '1A': ('AN', 'Tâm'),
    '2A': ('TH', 'Phương'),
    '3A': ('TNXH', 'Phước'),
    '4A': ('DD', 'Hằng'),      # GVCN Hằng dạy ĐĐ (Quan chỉ dạy 2 tiết)
    '5A': ('TA', 'Nương'),
    '1B': ('TV', 'Bé Năm'),
    '2B': ('TC_TOAN', 'Nhàn'),
    '3B': ('TH', 'Đạt'),       # CN(Đạt)
    '4B': ('MT', 'Thy'),
    '5B': ('GDTC', 'Thịnh'),
})

# ===== THỨ 4 (WEDNESDAY) =====
# Sáng
set_slot('T4_S_1', {
    '1A': ('TV', 'Chi'),
    '2A': ('TV', 'Trang'),
    '3A': ('TA', 'Nương'),
    '4A': ('MT', 'Thy'),
    '5A': ('TV', 'Tuấn'),
    '1B': ('TV', 'Bé Năm'),
    '2B': ('GDTC', 'Thịnh'),
    '3B': ('TV', 'Đạt'),
    '4B': ('TV', 'Yến'),
    '5B': ('TH', 'Nhàn'),      # CN(Nhàn)
})
set_slot('T4_S_2', {
    '1A': ('TV', 'Chi'),
    '2A': ('TV', 'Trang'),
    '3A': ('HDTN_CD', 'Thy'),
    '4A': ('TA', 'Nương'),
    '5A': ('TOAN', 'Tuấn'),
    '1B': ('TV', 'Bé Năm'),
    '2B': ('TC_TOAN', 'Nhàn'),
    '3B': ('GDTC', 'Thịnh'),
    '4B': ('TOAN', 'Yến'),
    '5B': ('TV', 'Huế'),
})
set_slot('T4_S_3', {
    '1A': ('TOAN', 'Chi'),
    '2A': ('TNXH', 'Phước'),
    '3A': ('TV', 'Dương'),
    '4A': ('TV', 'Hằng'),
    '5A': ('TH', 'Nhàn'),      # CN(Nhàn)
    '1B': ('GDTC', 'Thịnh'),
    '2B': ('TV', 'Chinh'),
    '3B': ('BD_AN', 'Tâm'),
    '4B': ('HDTN_CD', 'Thy'),
    '5B': ('TOAN', 'Huế'),
})
set_slot('T4_S_4', {
    '1A': ('TNXH', 'Phước'),
    '2A': ('TC_TOAN', 'Nhàn'),
    '3A': ('TOAN', 'Dương'),
    '4A': ('TOAN', 'Hằng'),
    '5A': ('TA', 'Nương'),
    '1B': ('HDTN_CD', 'Thy'),
    '2B': ('TV', 'Chinh'),
    '3B': ('TOAN', 'Đạt'),
    '4B': ('AN', 'Tâm'),
    '5B': ('LS_DL', 'Huế'),
})

# Chiều
set_slot('T4_C_1', {
    '1A': ('TV', 'Chi'),
    '2A': ('TOAN', 'Trang'),
    '3A': ('TNXH', 'Phước'),
    '4A': ('TH', 'Nhàn'),      # CN(Nhàn)
    '5A': ('LS_DL', 'Tuấn'),
    '1B': ('TH', 'Phương'),
    '2B': ('BD_AN', 'Tâm'),
    '3B': ('HDTN_CD', 'Thy'),
    '4B': ('LS_DL', 'Yến'),
    '5B': ('TA', 'Nương'),
})
set_slot('T4_C_2', {
    '1A': ('TC_TOAN', 'Phước'),
    '2A': ('TC_TV', 'Nhàn'),
    '3A': ('TH', 'Dương'),     # CN(Dương)
    '4A': ('LS_DL', 'Hằng'),
    '5A': ('KH', 'Tuấn'),
    '1B': ('TV', 'Bé Năm'),
    '2B': ('HDTN_CD', 'Thy'),
    '3B': ('TA', 'Nương'),
    '4B': ('BD_AN', 'Tâm'),
    '5B': ('TH', 'Phương'),
})
set_slot('T4_C_3', {
    '1A': ('DD', 'Nhàn'),
    '2A': ('HDTN_CD', 'Thy'),
    '3A': ('TH', 'Phương'),
    '4A': ('KH', 'Hằng'),
    '5A': ('AN', 'Tâm'),
    '1B': ('TNXH', 'Phước'),
    '2B': ('GDTC', 'Thịnh'),
    '3B': ('TC_TV', 'Đạt'),
    '4B': ('TA', 'Nương'),
    '5B': ('TC_TOAN', 'Huế'),  # Fixed from Thịnh conflict
})

# ===== THỨ 5 (THURSDAY) =====
# Sáng
set_slot('T5_S_1', {
    '1A': ('GDTC', 'Thịnh'),
    '2A': ('TC_TV', 'Nhàn'),
    '3A': ('TV', 'Dương'),
    '4A': ('TV', 'Hằng'),
    '5A': ('TV', 'Tuấn'),
    '1B': ('BD_AN', 'Tâm'),
    '2B': ('TV', 'Chinh'),
    '3B': ('TNXH', 'Phước'),
    '4B': ('TV', 'Yến'),
    '5B': ('TV', 'Huế'),
})
set_slot('T5_S_2', {
    '1A': ('HDTN_CD', 'Thy'),
    '2A': ('GDTC', 'Thịnh'),
    '3A': ('TV', 'Dương'),
    '4A': ('TV', 'Hằng'),
    '5A': ('TV', 'Tuấn'),
    '1B': ('TOAN', 'Bé Năm'),
    '2B': ('TV', 'Chinh'),
    '3B': ('TV', 'Đạt'),
    '4B': ('TV', 'Yến'),
    '5B': ('TV', 'Huế'),
})
set_slot('T5_S_3', {
    '1A': ('TV', 'Chi'),
    '2A': ('TV', 'Trang'),
    '3A': ('GDTC', 'Thịnh'),
    '4A': ('TOAN', 'Hằng'),
    '5A': ('TOAN', 'Tuấn'),
    '1B': ('TC_TV', 'Nhàn'),
    '2B': ('TOAN', 'Chinh'),
    '3B': ('TV', 'Đạt'),
    '4B': ('TOAN', 'Yến'),
    '5B': ('TOAN', 'Huế'),
})
set_slot('T5_S_4', {
    '1A': ('TV', 'Chi'),
    '2A': ('TV', 'Trang'),
    '3A': ('TOAN', 'Dương'),
    '4A': ('TA', 'Nương'),
    '5A': ('TC_TOAN', 'Nhàn'),
    '1B': ('TNXH', 'Phước'),
    '2B': ('TOAN', 'Chinh'),
    '3B': ('TA', 'Nương'),     # Will verify
    '4B': ('HDTN_CD', 'Thy'),
    '5B': ('TH', 'Huế'),       # CN(Huế)
})

# Chiều
set_slot('T5_C_1', {
    '1A': ('BD_AN', 'Tâm'),
    '2A': ('TC_TOAN', 'Nhàn'),
    '3A': ('TC_TOAN', 'Dương'),
    '4A': ('TA', 'Nương'),
    '5A': ('TC_TV', 'Tuấn'),
    '1B': ('TV', 'Bé Năm'),
    '2B': ('TC_TV', 'Chinh'),
    '3B': ('GDTC', 'Thịnh'),
    '4B': ('TA', 'Nương'),     # Will verify
    '5B': ('TC_TOAN', 'Huế'),
})
set_slot('T5_C_2', {
    '1A': ('TC_TOAN', 'Nhàn'),
    '2A': ('TOAN', 'Trang'),
    '3A': ('TC_TV', 'Dương'),
    '4A': ('BD_AN', 'Tâm'),
    '5A': ('MT', 'Thy'),
    '1B': ('TC_TOAN', 'Nhàn'), # Will verify
    '2B': ('TC_TV', 'Chinh'),
    '3B': ('TA', 'Nương'),
    '4B': ('GDTC', 'Thịnh'),
    '5B': ('TA', 'Nương'),     # Will verify
})
set_slot('T5_C_3', {
    '1A': ('TC_TOAN', 'Phước'),
    '2A': ('TC_TV', 'Nhàn'),
    '3A': ('GDTC', 'Thịnh'),
    '4A': ('HDTN_CD', 'Thy'),
    '5A': ('GDTC', 'Thịnh'),   # Will verify
    '1B': ('GDTC', 'Thịnh'),   # Will verify
    '2B': ('TC_TOAN', 'Nhàn'),
    '3B': ('TC_TOAN', 'Đạt'),
    '4B': ('TA', 'Nương'),
    '5B': ('BD_AN', 'Tâm'),
})

# ===== THỨ 6 (FRIDAY) =====
# Sáng
set_slot('T6_S_1', {
    '1A': ('TV', 'Chi'),
    '2A': ('TV', 'Trang'),
    '3A': ('TV', 'Dương'),
    '4A': ('TV', 'Hằng'),
    '5A': ('HDTN_CD', 'Thy'),
    '1B': ('TV', 'Bé Năm'),
    '2B': ('TOAN', 'Chinh'),
    '3B': ('TA', 'Nương'),
    '4B': ('TV', 'Yến'),
    '5B': ('TV', 'Huế'),
})
set_slot('T6_S_2', {
    '1A': ('TV', 'Chi'),
    '2A': ('TV', 'Trang'),
    '3A': ('TOAN', 'Dương'),
    '4A': ('TOAN', 'Hằng'),
    '5A': ('TV', 'Tuấn'),
    '1B': ('TV', 'Bé Năm'),
    '2B': ('TV', 'Chinh'),
    '3B': ('TV', 'Đạt'),
    '4B': ('TOAN', 'Yến'),
    '5B': ('TOAN', 'Huế'),
})
set_slot('T6_S_3', {
    '1A': ('TOAN', 'Chi'),
    '2A': ('TOAN', 'Trang'),
    '3A': ('TC_TV', 'Dương'),
    '4A': ('TC_TV', 'Hằng'),
    '5A': ('TOAN', 'Tuấn'),
    '1B': ('TOAN', 'Bé Năm'),
    '2B': ('TV', 'Chinh'),
    '3B': ('TV', 'Đạt'),
    '4B': ('TC_TV', 'Yến'),
    '5B': ('TC_TV', 'Huế'),
})
set_slot('T6_S_4', {c: ('SHL', GVCN[c]) for c in CLASSES})

print(f"Total slots defined: {len(sched)}")
