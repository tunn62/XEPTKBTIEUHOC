# Transcribing Page 1 of the PDF directly:
# Columns: 1A, 2A, 3A, 4A, 5A, 1B, 2B, 3B, 4B, 5B

raw_p1 = {
    # THỨ 2 - SÁNG
    'T2_S_1': ['HĐTN (CC)', 'HĐTN( Nhàn)', 'HĐTN (CC)', 'HĐTN (CC)', 'HĐTN (CC)', 'HĐTN (CC)', 'HĐTN (CC)', 'HĐTN (CC)', 'HĐTN (CC)', 'HĐTN (CC)'],
    'T2_S_2': ['TV', 'TV', 'TV', 'TV', 'TV', 'TV', 'TV', 'TV', 'TV', 'TV'],
    'T2_S_3': ['TV', 'TV', 'TV', 'TV', 'TV', 'TV', 'TV', 'TV', 'TV', 'TV'],
    'T2_S_4': ['T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T'],

    # THỨ 2 - CHIỀU
    'T2_C_1': ['MT (Thy)', 'ĐĐ(Nhàn)', 'TA (Nương)', 'AN (Tâm)', 'ĐĐ (Quan)', 'TNXH(Phước)', 'TH (Phương)', 'ĐĐ', 'LS-ĐL', 'LS-ĐL'],
    'T2_C_2': ['TV', 'MT (Thy)', 'AN (Tâm)', 'GDTC(Thịnh)', 'TA (Nương)', 'TV', 'TNXH(Phước)', 'TH (Phương)', 'KH', 'KH'],
    'T2_C_3': ['TCTV', 'AN (Tâm)', 'MT (Thy)', 'TA (Nương)', 'GDTC(Thịnh)', 'TCTV', 'ĐĐ(Nhàn)', 'TNXH(Phước)', 'TH (Phương)', 'ĐĐ (Quan)'],

    # THỨ 3 - SÁNG
    'T3_S_1': ['TV', 'GDTC(Thịnh)', 'TV', 'TV', 'TV', 'TV', 'TV', 'AN (Tâm)', 'TV', 'TA (Nương)'],
    'T3_S_2': ['TV', 'TV', 'GDTC(Thịnh)', 'T', 'T', 'TV', 'TV', 'TV', 'T', 'AN (Tâm)'],
    'T3_S_3': ['GDTC(Thịnh)', 'TV', 'T', 'LS-ĐL', 'LS-ĐL', 'AN (Tâm)', 'MT (Thy)', 'T', 'TA (Nương)', 'TV'],
    'T3_S_4': ['TH (Phương)', 'T', 'ĐĐ', 'KH', 'KH', 'MT (Thy)', 'AN (Tâm)', 'TA (Nương)', 'CN (Nhàn)', 'T'],

    # THỨ 3 - CHIỀU
    # Note: 4B has ĐĐ, 4A has ĐĐ. In original PDF it wrote 'ĐĐ (Quan)', but user explicitly said:
    # "Quan là HP chỉ dạy 2 tiết đạo đức khối 5", "Quan dạy Đạo đức Chỉ có 2 tiết"!
    # So 4B ĐĐ is Yến (GVCN), 4A ĐĐ is Hằng (GVCN)!
    'T3_C_1': ['TNXH(Phước)', 'BDAN (Tâm)', 'TA (Nương)', 'TH (Phương)', 'TCTV', 'ĐĐ(Nhàn)', 'T', 'MT (Thy)', 'ĐĐ', 'KH'],
    'T3_C_2': ['TCTV', 'TNXH(Phước)', 'BDAN (Tâm)', 'TA (Nương)', 'TH (Phương)', 'TCTV(Nhàn)', 'TCTV', 'GDTC(Thịnh)', 'KH', 'MT (Thy)'],
    'T3_C_3': ['AN (Tâm)', 'TH (Phương)', 'TNXH(Phước)', 'ĐĐ', 'TA (Nương)', 'TV', 'TCT(Nhàn)', 'CN', 'MT (Thy)', 'GDTC(Thịnh)'],

    # THỨ 4 - SÁNG
    'T4_S_1': ['TV', 'TV', 'TA (Nương)', 'MT (Thy)', 'TV', 'TV', 'GDTC(Thịnh)', 'TV', 'TV', 'CN (Nhàn)'],
    'T4_S_2': ['TV', 'TV', 'HĐTN (Thy)', 'TA (Nương)', 'T', 'TV', 'TCT(Nhàn)', 'GDTC(Thịnh)', 'T', 'TV'],
    'T4_S_3': ['T', 'TNXH(Phước)', 'TV', 'TV', 'CN (Nhàn)', 'GDTC(Thịnh)', 'TV', 'BDAN (Tâm)', 'HĐTN (Thy)', 'T'],
    'T4_S_4': ['TNXH(Phước)', 'TCT(Nhàn)', 'T', 'T', 'TA (Nương)', 'HĐTN (Thy)', 'TV', 'T', 'AN (Tâm)', 'LS-ĐL'],

    # THỨ 4 - CHIỀU
    'T4_C_1': ['TV', 'T', 'TNXH(Phước)', 'CN (Nhàn)', 'LS-ĐL', 'TH (Phương)', 'BDAN (Tâm)', 'HĐTN (Thy)', 'LS-ĐL', 'TA (Nương)'],
    'T4_C_2': ['TCT(Phước)', 'TCTV(Nhàn)', 'CN', 'LS-ĐL', 'KH', 'TV', 'HĐTN (Thy)', 'TA (Nương)', 'BDAN (Tâm)', 'TH (Phương)'],
    'T4_C_3': ['ĐĐ(Nhàn)', 'HĐTN (Thy)', 'TH (Phương)', 'KH', 'AN (Tâm)', 'TNXH(Phước)', 'GDTC(Thịnh)', 'TCTV', 'TA (Nương)', 'TCT'],

    # THỨ 5 - SÁNG
    'T5_S_1': ['GDTC(Thịnh)', 'TCTV(Nhàn)', 'TV', 'TV', 'TV', 'BDAN (Tâm)', 'TV', 'TNXH(Phước)', 'TV', 'TV'],
    'T5_S_2': ['HĐTN (Thy)', 'GDTC(Thịnh)', 'TV', 'TV', 'TV', 'T', 'TV', 'TV', 'TV', 'TV'],
    'T5_S_3': ['TV', 'TV', 'GDTC(Thịnh)', 'T', 'T', 'TCTV(Nhàn)', 'T', 'TV', 'T', 'T'],
    'T5_S_4': ['TV', 'TV', 'T', 'TA (Nương)', 'TCT(Nhàn)', 'TNXH(Phước)', 'T', 'T', 'TA (Nương)', 'HĐTN (Thy)'],

    # THỨ 5 - CHIỀU
    'T5_C_1': ['BDAN (Tâm)', 'TCT(Nhàn)', 'TCT', 'TA (Nương)', 'BDAN (Tâm)', 'TV', 'TCTV', 'GDTC(Thịnh)', 'TA (Nương)', 'T'],
    'T5_C_2': ['TCT(Nhàn)', 'T', 'TCTV', 'BDAN (Tâm)', 'MT (Thy)', 'TCT(Nhàn)', 'TCTV', 'TA (Nương)', 'GDTC(Thịnh)', 'TCT'],
    'T5_C_3': ['TCT(Phước)', 'TCTV(Nhàn)', 'GDTC(Thịnh)', 'HĐTN (Thy)', 'TCT', 'TCT', 'TCT(Nhàn)', 'TCT', 'TA (Nương)', 'BDAN (Tâm)'],

    # THỨ 6 - SÁNG
    'T6_S_1': ['TV', 'TV', 'TV', 'TV', 'HĐTN (Thy)', 'TV', 'T', 'TA (Nương)', 'TV', 'TV'],
    'T6_S_2': ['TV', 'TV', 'T', 'T', 'TV', 'TV', 'TV', 'T', 'T', 'T'],
    'T6_S_3': ['T', 'T', 'TCTV', 'TCTV', 'T', 'T', 'TV', 'TV', 'TCTV', 'TCTV'],
    'T6_S_4': ['HĐTN (SHL)', 'HĐTN (SHL)', 'HĐTN (SHL)', 'HĐTN (SHL)', 'HĐTN (SHL)', 'HĐTN (SHL)', 'HĐTN (SHL)', 'HĐTN (SHL)', 'HĐTN (SHL)', 'HĐTN (SHL)'],
}
