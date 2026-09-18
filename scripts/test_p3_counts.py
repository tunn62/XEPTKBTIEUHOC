# Let's precisely map Page 3 from the OCR and screenshot
# Page 3 header:
# Phước | Thịnh | Nhàn | Nương (TA) | Phương (Tin) | Quan (PHT) | Tiết | Buổi | Thứ

slots_p3 = [
    # Thứ 2 Sáng
    ('T2_S_1', {'Nhàn': '2A'}),
    ('T2_S_2', {}),
    ('T2_S_3', {}),
    ('T2_S_4', {}),
    # Thứ 2 Chiều
    ('T2_C_1', {'Phước': '1B', 'Nhàn': '2A', 'Nương': '3A', 'Phương': '2B', 'Quan': '5A'}),
    ('T2_C_2', {'Phước': '2B', 'Thịnh': '4A', 'Nương': '5A', 'Phương': '3B'}),
    ('T2_C_3', {'Phước': '3B', 'Thịnh': '5A', 'Nhàn': '2B', 'Nương': '4A', 'Phương': '4B', 'Quan': '5B'}),
    # Thứ 3 Sáng
    ('T3_S_1', {'Thịnh': '2A'}),
    ('T3_S_2', {'Thịnh': '3A'}),
    ('T3_S_3', {'Thịnh': '1A', 'Nương': '4B'}),
    ('T3_S_4', {'Nhàn': '4B', 'Nương': '3B', 'Phương': '1A'}),
    # Thứ 3 Chiều
    ('T3_C_1', {'Phước': '1A', 'Thịnh': '4B', 'Nhàn': '5B', 'Nương': '3A', 'Phương': '4A', 'Quan': '4B'}),
    ('T3_C_2', {'Phước': '2A', 'Thịnh': '3B', 'Nhàn': '1B', 'Nương': '4A', 'Phương': '5A'}),
    ('T3_C_3', {'Phước': '3A', 'Thịnh': '2B', 'Nhàn': '5A', 'Nương': '2A', 'Phương': '4A'}), # wait check Quan?
    # Thứ 4 Sáng
    ('T4_S_1', {'Thịnh': '1B', 'Nhàn': '5B'}),
    ('T4_S_2', {'Thịnh': '2B', 'Nhàn': '2B', 'Nương': '4A'}),
    ('T4_S_3', {'Phước': '2A', 'Thịnh': '3B', 'Nhàn': '5A'}),
    ('T4_S_4', {'Phước': '1A', 'Nhàn': '2A', 'Nương': '5A'}),
    # Thứ 4 Chiều
    ('T4_C_1', {'Phước': '1A', 'Nhàn': '4A', 'Nương': '5B', 'Phương': '1B'}),
    ('T4_C_2', {'Phước': '3A', 'Thịnh': '5B', 'Nhàn': '2A', 'Nương': '3B', 'Phương': '5B'}),
    ('T4_C_3', {'Phước': '1B', 'Thịnh': '2B', 'Nhàn': '1A', 'Nương': '4B', 'Phương': '3A'}),
    # Thứ 5 Sáng
    ('T5_S_1', {'Thịnh': '1A'}),
    ('T5_S_2', {'Thịnh': '2A'}),
    ('T5_S_3', {'Thịnh': '3A'}),
    ('T5_S_4', {}),
    # Thứ 5 Chiều
    ('T5_C_1', {}),
    ('T5_C_2', {}),
    ('T5_C_3', {}),
    # Thứ 6 Sáng
    ('T6_S_1', {}),
    ('T6_S_2', {}),
    ('T6_S_3', {}),
    ('T6_S_4', {}),
]

for sid, tmap in slots_p3:
    print(sid, tmap)
