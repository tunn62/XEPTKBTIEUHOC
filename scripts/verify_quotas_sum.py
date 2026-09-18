import sys
from collections import defaultdict
import json

CLASSES = ['1A', '2A', '3A', '4A', '5A', '1B', '2B', '3B', '4B', '5B']
DIEM1 = {'1A', '2A', '3A', '4A', '5A'}
DIEM2 = {'1B', '2B', '3B', '4B', '5B'}

GVCN = {
    '1A': 'Chi', '2A': 'Trang', '3A': 'Dương', '4A': 'Hằng', '5A': 'Tuấn',
    '1B': 'Bé Năm', '2B': 'Chinh', '3B': 'Đạt', '4B': 'Yến', '5B': 'Huế'
}

# Official target quotas:
TARGET_QUOTAS = {
    'Chi': 19, 'Trang': 16, 'Dương': 19, 'Hằng': 19, 'Tuấn': 19,
    'Bé Năm': 19, 'Chinh': 19, 'Đạt': 19, 'Yến': 19, 'Huế': 20,
    'Tâm': 20, 'Thy': 20, 'Phước': 20, 'Thịnh': 20, 'Nhàn': 10,
    'Nương': 24, 'Phương': 20, 'Quan': 2
}

print(f"Total target teaching periods: {sum(TARGET_QUOTAS.values())}")
print(f"Total school periods: {len(CLASSES) * 32}")
assert sum(TARGET_QUOTAS.values()) == len(CLASSES) * 32, "Target quotas sum to exactly 320!"
print("Quotas sum matches 320 perfectly!")
