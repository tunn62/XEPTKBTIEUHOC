import sys

# Let's list the EXACT OCR text of Page 1 row by row:

ocr_rows = {
    # T2 Sáng
    ('T2', 'S', 1): ['HĐTN (CC)', 'HĐTN( Nhàn)', 'HĐTN (CC)', 'HĐTN (CC)', 'HĐTN (CC)', 'HĐTN (CC)', 'HĐTN (CC)', 'HĐTN (CC)', 'HĐTN (CC)', 'HĐTN (CC)'],
    ('T2', 'S', 2): ['TV', 'TV', 'TV', 'TV', 'TV', 'TV', 'TV', 'TV', 'TV', 'TV'],
    ('T2', 'S', 3): ['TV', 'TV', 'TV', 'TV', 'TV', 'TV', 'TV', 'TV', 'TV', 'TV'],
    ('T2', 'S', 4): ['T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T'],

    # T2 Chiều
    ('T2', 'C', 1): ['MT (Thy)', 'ĐĐ(Nhàn)', 'TA (Nương)', 'AN (Tâm)', 'ĐĐ (Quan)', 'TNXH(Phước)', 'TH (Phương)', 'ĐĐ', 'LS-ĐL', 'LS-ĐL'],
    ('T2', 'C', 2): ['TV', 'MT (Thy)', 'AN (Tâm)', 'GDTC(Thịnh)', 'TA (Nương)', 'TV', 'TNXH(Phước)', 'TH (Phương)', 'KH', 'KH'],
    ('T2', 'C', 3): ['TCTV', 'AN (Tâm)', 'MT (Thy)', 'TA (Nương)', 'GDTC(Thịnh)', 'TCTV', 'ĐĐ(Nhàn)', 'TNXH(Phước)', 'TH (Phương)', 'ĐĐ (Quan)'],

    # T3 Sáng
    ('T3', 'S', 1): ['TV', 'GDTC(Thịnh)', 'TV', 'TV', 'TV', 'TV', 'TV', 'AN (Tâm)', 'TV', 'TA (Nương)'],
    ('T3', 'S', 2): ['TV', 'TV', 'GDTC(Thịnh)', 'T', 'T', 'TV', 'TV', 'TV', 'T', 'AN (Tâm)'],
    ('T3', 'S', 3): ['GDTC(Thịnh)', 'TV', 'T', 'LS-ĐL', 'LS-ĐL', 'AN (Tâm)', 'MT (Thy)', 'T', 'TA (Nương)', 'TV'],
    ('T3', 'S', 4): ['TH (Phương)', 'T', 'ĐĐ', 'KH', 'KH', 'MT (Thy)', 'AN (Tâm)', 'TA (Nương)', 'CN (Nhàn)', 'T'],

    # T3 Chiều
    ('T3', 'C', 1): ['TNXH(Phước)', 'BDAN (Tâm)', 'TA (Nương)', 'TH (Phương)', 'TCTV', 'ĐĐ(Nhàn)', 'T', 'MT (Thy)', 'ĐĐ (Quan)', 'KH'],
    ('T3', 'C', 2): ['TCTV', 'TNXH(Phước)', 'BDAN (Tâm)', 'TA (Nương)', 'TH (Phương)', 'TCTV(Nhàn)', 'TCTV', 'GDTC(Thịnh)', 'KH', 'MT (Thy)'],
    ('T3', 'C', 3): ['AN (Tâm)', 'TH (Phương)', 'TNXH(Phước)', 'ĐĐ (Quan)', 'TA (Nương)', 'TV', 'TCT(Nhàn)', 'CN', 'MT (Thy)', 'GDTC(Thịnh)'],

    # T4 Sáng
    ('T4', 'S', 1): ['TV', 'TV', 'TA (Nương)', 'MT (Thy)', 'TV', 'TV', 'GDTC(Thịnh)', 'TV', 'TV', 'CN (Nhàn)'],
    ('T4', 'S', 2): ['TV', 'TV', 'HĐTN (Thy)', 'TA (Nương)', 'T', 'TV', 'TCT(Nhàn)', 'GDTC(Thịnh)', 'T', 'TV'],
    ('T4', 'S', 3): ['T', 'TNXH(Phước)', 'TV', 'TV', 'CN (Nhàn)', 'GDTC(Thịnh)', 'TV', 'BDAN (Tâm)', 'HĐTN (Thy)', 'T'],
    ('T4', 'S', 4): ['TNXH(Phước)', 'TCT(Nhàn)', 'T', 'T', 'TA (Nương)', 'HĐTN (Thy)', 'TV', 'T', 'AN (Tâm)', 'LS-ĐL'],

    # T4 Chiều
    ('T4', 'C', 1): ['TV', 'T', 'TNXH(Phước)', 'CN (Nhàn)', 'LS-ĐL', 'TH (Phương)', 'BDAN (Tâm)', 'HĐTN (Thy)', 'LS-ĐL', 'TA (Nương)'],
    ('T4', 'C', 2): ['TCT(Phước)', 'TCTV(Nhàn)', 'CN', 'LS-ĐL', 'KH', 'TV', 'HĐTN (Thy)', 'TA (Nương)', 'BDAN (Tâm)', 'TH (Phương)'],
    ('T4', 'C', 3): ['ĐĐ(Nhàn)', 'HĐTN (Thy)', 'TH (Phương)', 'KH', 'AN (Tâm)', 'TNXH(Phước)', 'GDTC(Thịnh)', 'TCTV', 'TA (Nương)', 'GDTC(Thịnh)'],

    # T5 Sáng
    ('T5', 'S', 1): ['GDTC(Thịnh)', 'TCTV(Nhàn)', 'TV', 'TV', 'TV', 'BDAN (Tâm)', 'TV', 'TNXH(Phước)', 'TV', 'TV'],
    ('T5', 'S', 2): ['HĐTN (Thy)', 'GDTC(Thịnh)', 'TV', 'TV', 'TV', 'T', 'TV', 'TV', 'TV', 'TV'],
    ('T5', 'S', 3): ['TV', 'TV', 'GDTC(Thịnh)', 'T', 'T', 'TCTV(Nhàn)', 'T', 'TV', 'T', 'T'],
    ('T5', 'S', 4): ['TV', 'TV', 'T', 'TA (Nương)', 'TCT(Nhàn)', 'TNXH(Phước)', 'T', 'TA (Nương)', 'HĐTN (Thy)', '???'],

    # T5 Chiều
    ('T5', 'C', 1): ['BDAN (Tâm)', 'TCT(Nhàn)', 'TCT', 'TA (Nương)', 'BDAN (Tâm)', 'TV', 'TCTV', 'GDTC(Thịnh)', 'TA (Nương)', '???'],
    ('T5', 'C', 2): ['TCT(Nhàn)', 'T', 'TCTV', 'BDAN (Tâm)', 'MT (Thy)', 'TCT(Nhàn)', 'TCTV', 'TA (Nương)', 'GDTC(Thịnh)', 'TA (Nương)'],
    ('T5', 'C', 3): ['TCT(Phước)', 'TCTV(Nhàn)', 'GDTC(Thịnh)', 'HĐTN (Thy)', 'GDTC(Thịnh)', 'GDTC(Thịnh)', 'TCT(Nhàn)', 'TCT', 'TA (Nương)', 'BDAN (Tâm)'],

    # T6 Sáng
    ('T6', 'S', 1): ['TV', 'TV', 'TV', 'TV', 'HĐTN (Thy)', 'TV', 'T', 'TA (Nương)', 'TV', 'TV'],
    ('T6', 'S', 2): ['TV', 'TV', 'T', 'T', 'TV', 'TV', 'TV', 'T', 'T', 'T'],
    ('T6', 'S', 3): ['T', 'T', 'TCTV', 'TCTV', 'T', 'T', 'TV', 'TV', 'TCTV', 'TCTV'],
    ('T6', 'S', 4): ['HĐTN (SHL)', 'HĐTN (SHL)', 'HĐTN (SHL)', 'HĐTN (SHL)', 'HĐTN (SHL)', 'HĐTN (SHL)', 'HĐTN (SHL)', 'HĐTN (SHL)', 'HĐTN (SHL)', 'HĐTN (SHL)']
}

print(f"Total rows in OCR: {len(ocr_rows)}")
