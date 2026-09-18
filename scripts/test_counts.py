import json
from collections import defaultdict

# Perfect quotas:
# Tâm: 20 (10 AN, 10 BD_AN) -> Diem 1: T3, T4; Diem 2: T2, T5
# Thy: 22 (10 MT, 10 BD_MT, 2 HDTN) -> Diem 1: T2, T5, T6; Diem 2: T3, T4
# Thịnh: 20 GDTC (already fixed)
# Phương: 10 TH (already fixed)
# Nương: 20 TA (already fixed)
# Phước: 19 (15 in Diem 1, 4 in Diem 2 on T4_C)
# Nhàn: 16 (all in Diem 2)
# Quan: 6 (all in Diem 1)

with open('scripts/problem_data.json') as f:
    data = json.load(f)

fixed_sched = data['fixedSched']
free_slots = data['freeSlots']

print(f"Total free slots to assign: {len(free_slots)}")
c1_slots = [s for s in free_slots if s['campus'] == 'diem1']
c2_slots = [s for s in free_slots if s['campus'] == 'diem2']
print(f"C1 slots: {len(c1_slots)}, C2 slots: {len(c2_slots)}")
