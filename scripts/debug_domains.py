import json

with open('scripts/problem_data.json') as f:
    data = json.load(f)

free_slots = data['freeSlots']

# Let's inspect each slot and see which teachers are allowed
from solve_85 import reqs, is_teacher_allowed

free_slots.sort(key=lambda s: (s['slotId'], s['classId']))

for slot in free_slots:
    cid = slot['classId']
    sid = slot['slotId']
    day = slot['day']
    campus = slot['campus']
    sess_id = f"T{day}_{sid.split('_')[1]}"
    
    allowed = []
    for sub, teacher in set(reqs[cid]):
        if is_teacher_allowed(teacher, campus, day, sess_id):
            if teacher == 'Phước' and campus == 'diem1' and sess_id in ('T2_C', 'T4_C'):
                continue
            allowed.append((sub, teacher))
    if len(allowed) == 0:
        print(f"EMPTY DOMAIN: {cid} {sid} ({campus}, {sess_id})")
    else:
        print(f"{cid} {sid} ({sess_id}): {len(allowed)} options -> {allowed}")
